# Septiembre Arquitectura — Hero & 첫 스크롤 인터랙션 분석

> 분석 대상: [https://www.septiembrearquitectura.com/](https://www.septiembrearquitectura.com/)  
> 분석일: 2026-06-13  
> 목적: 레이아웃 복제가 아닌 **스크롤 경험·레이어·전환 방식** 동일 구현

---

## 1. DOM 구조 & z-index 계층

### 1.1 원본 (`.home-intro`) 추정 구조

```
.home-intro                          ← ScrollTrigger 트랙 (≈200–300vh 스크롤 거리)
└── [data-sticky] .intro-sticky      ← pin 대상 (100vh 뷰포트, 스크롤 중 고정)
    ├── .intro-title--back           ← z:1  대형 "Septiembre." (진한 레드)
    ├── .intro-media / GIF           ← z:2  중앙 세로형 Featured 미디어
    ├── .intro-title--front          ← z:3  동일 타이포 (연한/ multiply 오버레이)
    ├── .intro-subtitle              ← z:3  "arquitectura" (소형 sans)
    ├── .intro-ui                    ← z:4  Scroll hint, counter
    └── .intro-gallery               ← z:4–5  비대칭 floating 이미지 N장
        └── .gallery-item × 6        ← absolute, 초기 opacity:0 / translateY(+)

.home-about-us                       ← z:10 (Hero 레이어 위)
    └── translateY(100vh → 0)        ← Hero 마지막 구간에서 커튼처럼 올라옴
```

### 1.2 z-index 요약

| 레이어 | z-index | 역할 |
|--------|---------|------|
| Back Typography | 1 | 타이포 베이스 — 이미지 뒤에서 전체 폭 유지 |
| Center Media | 2 | Featured GIF/이미지 — 타이포 관통 |
| Front Typography | 3 | multiply/저채도 — 이미지 위 에디토리얼 레이어 |
| UI Meta | 4 | Scroll, Since, index |
| Gallery Items | 4–5 | 스크롤 reveal — 타이포 위·주변에 떠오름 |
| Next Section (About) | 10+ | Hero 위를 덮으며 등장 |

### 1.3 포트폴리오 매핑

```
[data-hero-section]                  ← scroll track (250vh / mobile 180vh)
└── [data-hero-stage]                ← ScrollTrigger pin (100vh)
    ├── [data-hero-meta]             ← UI (credential, scroll hint)
    ├── [data-hero-composition]
    │   ├── [data-hero-title]        ← Back: "Jungwon Heo."
    │   ├── [data-hero-image-layer]  ← Center slider
    │   └── [data-hero-title-front]  ← Front overlay
    └── [data-hero-gallery]          ← Floating gallery
        └── [data-hero-float] × N

[data-about-cover]                   ← About(Profile) 커튼 레이어
```

---

## 2. 스크롤 타임라인 (0% → 100%)

Hero pin 구간 전체를 100%로 정규화. (데스크톱 ≈250vh 스크롤)

### Scroll 0% — Intro Rest

| 요소 | 상태 |
|------|------|
| Stage | **pin 시작**, 100vh 고정 |
| Back / Front Typography | 정지, full opacity |
| Center Image | 중앙, auto-play crossfade |
| Gallery | **숨김** (opacity 0, y +180~200px) |
| UI Meta | 표시 |
| About | 화면 아래 (`translateY: 100vh`) |

### Scroll 25% — Early Scroll / Decomposition Start

| 요소 | 동작 |
|------|------|
| UI Meta | **fade out** + translateY(-) |
| Center Image | **translateY ↑** (위로 이동 시작), 미세 scale |
| Back Typography | scale ↓ 시작 (0.95), opacity 유지 |
| Front Typography | opacity ↓ (multiply 레이어 약화) |
| Gallery | **1–2장** 하단에서 stagger 등장 시작 |
| About | 아직 off-screen |

### Scroll 50% — Gallery Assembly

| 요소 | 동작 |
|------|------|
| Stage | **여전히 pin** |
| Center Image | 상단 1/3 쪽으로 이동 완료에 가까움 |
| Typography | scale 0.88~0.92, back opacity 0.5~0.7 |
| Gallery | **3–4장** reveal, 비대칭 배치 완성 중 |
| Front Typography | 거의 투명 — 갤러리가 주연 |

### Scroll 75% — Gallery Complete

| 요소 | 동작 |
|------|------|
| Composition | 전체 **미세 drift** upward |
| Gallery | **전체 visible**, y:0, opacity:1 |
| Typography | 배경 그래픽처럼 잔존 (low opacity) |
| Center Image | 갤러리 클러스터의 일부처럼 feel |
| About | **slide-up 시작** (72~75% 지점) |

### Scroll 100% — Section Handoff

| 요소 | 동작 |
|------|------|
| Hero Stage | pin **해제** 직전 |
| About Cover | **translateY(0)** — Hero 완전히 덮음 |
| Gallery / Typography | 가려짐 (About solid bg) |
| UX | "새 페이지가 아래에서 밀려 올라온다" |

---

## 3. 애니메이션 구현 방식 추정

| 기법 | Septiembre | 포트폴리오 적용 |
|------|------------|----------------|
| **ScrollTrigger pin** | `data-sticky` on intro viewport | `pin: heroStage` |
| **scrub timeline** | scroll-linked progress | `scrub: 0.85` single timeline |
| **translateY** | gallery rise, about cover, center media | GSAP `y` |
| **scale** | typography shrink | GSAP `scale` on title layers |
| **opacity** | meta fade, front type fade, gallery reveal | GSAP `opacity` |
| **stagger** | gallery items sequential | timeline offset per item |
| **ScrollSmoother** | wrapper smooth | **Lenis** + ST refresh |
| **data-get/set-target** | scroll zone → center image swap | auto slider (3s) + scroll independent |

**GSAP ScrollTrigger 적합성: ✅**  
pin + scrub timeline + layered transforms는 ScrollTrigger 단일 타임라인으로 재현 가능.

---

## 4. 포트폴리오 구현 원칙

1. **레이아웃 복제 ❌** — cream/red, 폰트 크기 등 시각 디자인 미복제  
2. **인터랙션 복제 ✅** — pin → center move → gallery stagger → about cover  
3. **레이어 구조 유지** — Back Type / Image / Front Type / Gallery / About Cover  
4. **모바일** — pin 거리 축소, gallery 3장, center move 축소  
5. **reduced-motion** — pin/gallery/cover 비활성, static stack

---

## 5. 구현 Phase 상수 (코드)

```ts
scrollPhases: {
  metaFade:      { start: 0,    end: 0.15 },
  centerMove:    { start: 0,    end: 0.38 },
  titleBack:     { start: 0.08, end: 0.65 },
  titleFront:    { start: 0.12, end: 0.55 },
  galleryReveal: { start: 0.22, end: 0.78 },
  compositionDrift: { start: 0.58, end: 0.85 },
  aboutCover:    { start: 0.72, end: 1.0  },
}
```

---

## 6. 참고

- 기존 전체 사이트 분석: [`site-analysis.md`](./site-analysis.md) §1.2, §7, §8  
- 구현 파일: `src/sections/HomeStory/homeStoryAnimation.ts`, `src/data/heroStory.ts`
