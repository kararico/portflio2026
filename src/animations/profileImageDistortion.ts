import { gsap } from '@/utils/gsap/registerGsap';
import { ABOUT_PROFILE_REVEAL_EVENT } from '@/animations/aboutProfileReveal';
import { registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { PROFILE_DISTORTION_DEFAULTS } from '@/utils/profileImageConfig';
import type { Camera, Mesh, Program, Renderer } from 'ogl';

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform sampler2D tDisplacement;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform vec2 uCoverScale;
  uniform vec2 uCoverOffset;
  uniform float uImageOpacity;

  varying vec2 vUv;

  void main() {
    vec2 baseUv = vUv * uCoverScale + uCoverOffset;

    vec2 disp = texture2D(tDisplacement, vUv).rg;
    disp = disp * 2.0 - 1.0;

    vec2 mouseInfluence = (uMouse - vec2(0.5)) * 0.1 * uIntensity;
    vec2 distortedUv = baseUv + disp * uIntensity * 0.32 + mouseInfluence;

    vec4 color = texture2D(tMap, distortedUv);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    gl_FragColor = vec4(vec3(gray), color.a * uImageOpacity);
  }
`;

export interface ProfileDistortionOptions {
  frame: HTMLElement;
  media: HTMLElement;
  canvas: HTMLCanvasElement;
  imageSrc: string;
  intensity?: number;
  enterDuration?: number;
  leaveDuration?: number;
  ease?: string;
  displacementMapUrl?: string;
  objectPositionY?: number;
  imageOpacity?: number;
  forceHover?: boolean;
  /** true: 스크롤 등장 시 1회 재생 / false: hover (legacy debug) */
  revealOnScroll?: boolean;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function computeCoverUniforms(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  objectPositionY: number,
): { scale: [number, number]; offset: [number, number] } {
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;
  const objectPosition: [number, number] = [0.5, objectPositionY];

  if (imageAspect > containerAspect) {
    const scaleX = containerAspect / imageAspect;
    return {
      scale: [scaleX, 1],
      offset: [(1 - scaleX) * objectPosition[0], 0],
    };
  }

  const scaleY = imageAspect / containerAspect;
  return {
    scale: [1, scaleY],
    offset: [0, (1 - scaleY) * objectPosition[1]],
  };
}

export function bindProfileImageDistortion(options: ProfileDistortionOptions): () => void {
  registerGsapPlugins();

  const {
    frame,
    media,
    canvas,
    imageSrc,
    intensity = PROFILE_DISTORTION_DEFAULTS.intensity,
    enterDuration = PROFILE_DISTORTION_DEFAULTS.enterDuration,
    leaveDuration = PROFILE_DISTORTION_DEFAULTS.leaveDuration,
    ease = PROFILE_DISTORTION_DEFAULTS.ease,
    displacementMapUrl = PROFILE_DISTORTION_DEFAULTS.displacementMapUrl,
    objectPositionY = PROFILE_DISTORTION_DEFAULTS.objectPositionY,
    imageOpacity = PROFILE_DISTORTION_DEFAULTS.imageOpacity,
    forceHover = false,
    revealOnScroll = true,
  } = options;

  let disposed = false;
  let initialized = false;
  let initPromise: Promise<void> | null = null;
  let rafId: number | null = null;
  let isHovering = false;
  let needsRender = false;
  let enterTween: gsap.core.Tween | null = null;
  let leaveTween: gsap.core.Tween | null = null;
  let mouseTween: gsap.core.Tween | null = null;

  let renderer: Renderer | null = null;
  let program: Program | null = null;
  let mesh: Mesh | null = null;
  let camera: Camera | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let imageDimensions = { width: 0, height: 0 };

  const mouseTarget = { x: 0.5, y: 0.5 };
  const mouseCurrent = { x: 0.5, y: 0.5 };
  const animState = { intensity: 0, opacity: 0, scale: 1 };

  const render = () => {
    if (disposed || !renderer || !mesh || !program) return;

    program.uniforms.uIntensity.value = animState.intensity;
    program.uniforms.uMouse.value = [mouseCurrent.x, mouseCurrent.y];
    program.uniforms.uImageOpacity.value = imageOpacity * animState.opacity;

    renderer.render({ scene: mesh, camera: camera ?? undefined });
    needsRender = false;
  };

  const loop = () => {
    if (disposed) return;

    if (needsRender || isHovering || animState.intensity > 0.001 || animState.opacity > 0.001) {
      render();
    }

    if (isHovering || animState.intensity > 0.001 || animState.opacity > 0.001) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  };

  const startLoop = () => {
    needsRender = true;
    if (rafId === null) {
      rafId = requestAnimationFrame(loop);
    }
  };

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const syncSize = () => {
    if (!renderer || !program) return;

    const { width, height } = media.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;

    renderer.setSize(width, height);

    const image = program.uniforms.tMap.value as { image?: HTMLImageElement };
    if (imageDimensions.width > 0 && imageDimensions.height > 0) {
      const cover = computeCoverUniforms(
        imageDimensions.width,
        imageDimensions.height,
        width,
        height,
        objectPositionY,
      );
      program.uniforms.uCoverScale.value = cover.scale;
      program.uniforms.uCoverOffset.value = cover.offset;
    } else if (image?.image?.naturalWidth && image.image.naturalHeight) {
      imageDimensions = {
        width: image.image.naturalWidth,
        height: image.image.naturalHeight,
      };
      const cover = computeCoverUniforms(
        imageDimensions.width,
        imageDimensions.height,
        width,
        height,
        objectPositionY,
      );
      program.uniforms.uCoverScale.value = cover.scale;
      program.uniforms.uCoverOffset.value = cover.offset;
    }

    needsRender = true;
    startLoop();
  };

  const initDistortion = async () => {
    if (initialized || disposed) return;
    initialized = true;

    const { Renderer, Camera, Mesh, Program, Plane, Texture } = await import('ogl');

    const [imageEl, displacementEl] = await Promise.all([
      loadImage(imageSrc),
      loadImage(displacementMapUrl),
    ]);

    if (disposed) return;

    imageDimensions = {
      width: imageEl.naturalWidth,
      height: imageEl.naturalHeight,
    };

    const { width, height } = media.getBoundingClientRect();
    renderer = new Renderer({
      canvas,
      width: Math.max(1, width),
      height: Math.max(1, height),
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: false,
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    camera = new Camera(gl, { left: -1, right: 1, bottom: -1, top: 1, near: 0.01, far: 10 });
    camera.position.z = 1;

    const imageTexture = new Texture(gl, {
      image: imageEl,
      generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const displacementTexture = new Texture(gl, {
      image: displacementEl,
      generateMipmaps: false,
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const cover = computeCoverUniforms(
      imageEl.naturalWidth,
      imageEl.naturalHeight,
      Math.max(1, width),
      Math.max(1, height),
      objectPositionY,
    );

    program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        tMap: { value: imageTexture },
        tDisplacement: { value: displacementTexture },
        uIntensity: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uCoverScale: { value: cover.scale },
        uCoverOffset: { value: cover.offset },
        uImageOpacity: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    mesh = new Mesh(gl, {
      geometry: new Plane(gl, { width: 2, height: 2 }),
      program,
    });

    frame.dataset.distortionReady = 'true';
    syncSize();
  };

  const ensureInit = () => {
    if (!initPromise) {
      initPromise = initDistortion().catch(() => {
        initialized = false;
        initPromise = null;
      });
    }
    return initPromise;
  };

  const setMediaActive = (active: boolean) => {
    media.dataset.distortionActive = active ? 'true' : 'false';
  };

  const playEnterAnimation = (onComplete?: () => void) => {
    void ensureInit().then(() => {
      if (disposed || !initialized) return;

      enterTween?.kill();
      leaveTween?.kill();
      startLoop();

      enterTween = gsap.to(animState, {
        intensity,
        opacity: 1,
        scale: 1.015,
        duration: enterDuration,
        ease,
        onUpdate: () => {
          if (animState.opacity > 0.04 && frame.dataset.distortionReady === 'true') {
            setMediaActive(true);
          }
          canvas.style.opacity = String(animState.opacity);
          gsap.set(media, { scale: animState.scale });
          needsRender = true;
          startLoop();
        },
        onComplete: () => {
          onComplete?.();
        },
      });
    });
  };

  const playLeaveAnimation = () => {
    enterTween?.kill();

    leaveTween = gsap.to(animState, {
      intensity: 0,
      opacity: 0,
      scale: 1,
      duration: leaveDuration,
      ease,
      onUpdate: () => {
        gsap.set(media, { scale: animState.scale });
        canvas.style.opacity = String(animState.opacity);
        needsRender = true;
        startLoop();
      },
      onComplete: () => {
        if (disposed) return;
        setMediaActive(false);
        canvas.style.opacity = '0';
        gsap.set(media, { scale: 1 });
        stopLoop();
      },
    });
  };

  let scrollTriggerInstance: ScrollTrigger | null = null;
  let revealHandler: (() => void) | null = null;

  if (revealOnScroll && !forceHover) {
    const inHomeStory = Boolean(frame.closest('[data-home-story]'));

    if (inHomeStory) {
      revealHandler = () => {
        playEnterAnimation(() => playLeaveAnimation());
      };
      window.addEventListener(ABOUT_PROFILE_REVEAL_EVENT, revealHandler, { once: true });
    } else {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: frame.closest('[data-about-profile-row]') ?? frame,
        start: 'top bottom',
        once: true,
        onEnter: () => {
          playEnterAnimation(() => playLeaveAnimation());
        },
      });
    }
  } else {
    const onEnter = () => {
      isHovering = true;
      playEnterAnimation();
    };

    const onMove = (event: MouseEvent) => {
      if (!isHovering) return;

      const rect = frame.getBoundingClientRect();
      mouseTarget.x = (event.clientX - rect.left) / rect.width;
      mouseTarget.y = (event.clientY - rect.top) / rect.height;

      mouseTween?.kill();
      mouseTween = gsap.to(mouseCurrent, {
        x: mouseTarget.x,
        y: mouseTarget.y,
        duration: 0.35,
        ease: 'sine.out',
        onUpdate: () => {
          needsRender = true;
          startLoop();
        },
      });
    };

    const onLeave = () => {
      isHovering = false;
      playLeaveAnimation();
    };

    frame.addEventListener('mouseenter', onEnter);
    frame.addEventListener('mousemove', onMove);
    frame.addEventListener('mouseleave', onLeave);

    if (forceHover) {
      void ensureInit().then(() => {
        if (!disposed) onEnter();
      });
    }

    resizeObserver = new ResizeObserver(() => syncSize());
    resizeObserver.observe(media);

    return () => {
      disposed = true;
      isHovering = false;
      stopLoop();

      enterTween?.kill();
      leaveTween?.kill();
      mouseTween?.kill();

      frame.removeEventListener('mouseenter', onEnter);
      frame.removeEventListener('mousemove', onMove);
      frame.removeEventListener('mouseleave', onLeave);
      resizeObserver?.disconnect();

      gsap.set(media, { scale: 1, x: 0, y: 0 });
      setMediaActive(false);
      canvas.style.opacity = '0';

      const gl = renderer?.gl;
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        ext?.loseContext();
      }

      renderer = null;
      program = null;
      mesh = null;
      camera = null;
      initPromise = null;
      frame.dataset.distortionReady = 'false';
    };
  }

  resizeObserver = new ResizeObserver(() => syncSize());
  resizeObserver.observe(media);

  return () => {
    disposed = true;
    isHovering = false;
    stopLoop();

    enterTween?.kill();
    leaveTween?.kill();
    mouseTween?.kill();
    scrollTriggerInstance?.kill();
    if (revealHandler) {
      window.removeEventListener(ABOUT_PROFILE_REVEAL_EVENT, revealHandler);
    }
    resizeObserver?.disconnect();

    gsap.set(media, { scale: 1, x: 0, y: 0 });
    setMediaActive(false);
    canvas.style.opacity = '0';

    const gl = renderer?.gl;
    if (gl) {
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    }

    renderer = null;
    program = null;
    mesh = null;
    camera = null;
    initPromise = null;
    frame.dataset.distortionReady = 'false';
  };
}
