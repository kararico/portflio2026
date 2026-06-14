# Septiembre Arquitectura 사이트 분석

> 분석 대상: [https://www.septiembrearquitectura.com/index.html](https://www.septiembrearquitectura.com/index.html)  
> 분석일: 2026-06-13  
> 제작: Emexs + Programatório (Laravel/Vite 기반 SPA, GSAP ScrollSmoother)

---

## 1. 전체 페이지 구조

### 1.1 글로벌 레이어 (모든 페이지 공통)

```
body
├── #loader                    — 초기 로딩 (브랜드명 + 진행률 %)
├── .cursor-wrapper            — 커스텀 커서 (fixed, pointer-events: none)
├── #header                    — 고정 헤더 (로고 + 햄버거 메뉴)
│   └── nav.menu               — 풀스크린 오버레이 내비게이션
├── #main-transition           — PJAX 페이지 전환 래퍼
│   └── .wrapper[data-scroll-container]
│       └── main
│           └── [섹션들]
└── footer#footer              — Contact / Social / Newsletter
```

### 1.2 홈 페이지 (`data-pg="pg-home"`)

| 순서 | 섹션 클래스 | ID | 역할 |
|------|------------|-----|------|
| 1 | `.home-intro` | — | Hero: 대형 타이포 + GIF + Featured 프로젝트 갤러리 |
| 2 | `.home-about-us` | `#home-about-us` | About: 텍스트 컬러라이저 + 비디오 + Swiper 슬라이더 |
| 3 | `.home-other-projects` | `#home-other-projects` | Works: 카테고리 필터 + 아코디언 프로젝트 리스트 |
| 4 | `.home-things-that-inspire` | `#home-things-that-inspire` | Philosophy: 수평 스크롤 + Pinned 썸네일 네비 |
| 5 | `.home-team` | `#home-team` | Team: Marquee 드래그 캐러셀 |
| 6 | `footer#footer` | `#footer` | Contact / Social / Newsletter |

### 1.3 프로젝트 상세 (`data-pg="pg-project-post"`, 예: `/garden.html`)

| 순서 | 섹션 클래스 | 역할 |
|------|------------|------|
| 1 | `.project-intro` | Hero: 프로젝트명 + 메타데이터 그리드 |
| 2 | `.project-info` | Overview: 설명 + 이미지 (2-column) |
| 3 | `.project-media` | Full-width 이미지 |
| 4 | `.project-media-text` | 이미지 + 본문 텍스트 |
| 5 | `.project-two-medias` | 2-column 이미지 갤러리 |
| 6 | `.next-project` | 다음 프로젝트 프리뷰 + Back to top |

### 1.4 포트폴리오 적용 시 구조 매핑

| 레퍼런스 | 포트폴리오 변환 |
|---------|----------------|
| `.home-intro` | **Hero** — "Frontend Developer & UI Engineer" |
| `.home-about-us` | **About** — 짧은 소개 (경력 연혁 제거) |
| `.home-other-projects` | **Works** — MLB, 스타벅스 등 실무 프로젝트 |
| `.home-things-that-inspire` | *(선택)* Skills / Approach 또는 제거 |
| `.home-team` | *(제거)* — 팀 섹션 불필요 |
| `footer#footer` | **Contact** |
| `.project-*` | **WorkDetail** — `/work/[slug]` |

---

## 2. 섹션 순서 & 스크롤 흐름

```
[Loader 0→100%]
    ↓
[Hero Intro — Sticky 타이포 + Scroll-triggered Gallery]
    ↓ (ScrollSmoother smooth scroll)
[About — Pinned text + Parallax video/slider]
    ↓
[Works — Category tabs + Accordion list + Hover image reveal]
    ↓
[Philosophy — Horizontal scroll (pinned thumbs + content sections)]
    ↓
[Team Marquee — Drag interaction]
    ↓
[Footer — Parallax reveal + Large CTA typography]
```

**핵심 스크롤 패턴**
- `data-scroll-container` 래퍼 + GSAP **ScrollSmoother** (Lenis 대체 가능)
- `data-sticky` + `data-trigger` — 섹션 내 요소 Pin
- `data-parallax` + `data-translate-y-from` — 이미지/배경 패럴랙스
- `data-aos="d:loop"` — ScrollTrigger 기반 reveal (데스크톱 루프 재생)
- Hero Gallery: `data-get-target` / `data-set-target` 트리거로 이미지 교체

---

## 3. Grid 시스템

### 3.1 기반

- **Bootstrap-like 12-column grid** (`container-fluid` > `row` > `col-*`)
- 컬럼 클래스: `col-lg-*`, `col-md-*`, `col-tablet-*`, `col-mobile-landscape-*`, `offset-*`

### 3.2 레이아웃 규칙

| 속성 | Desktop (1025px+) | Tablet (768–1025px) | Mobile (<768px) |
|------|-------------------|---------------------|-----------------|
| `--padding-fluid` | `4rem` | `2.5rem` | `2rem` |
| `--padding` | `0.8rem` | 동일 | 동일 |
| `--header-height` | `6.5rem` | 동일 | 동일 |
| `html font-size` | `0.609759vw` (fluid) | `1.302086vw` | `2.564105vw` |

### 3.3 Fluid Typography Scale

rem 기반 fluid sizing — viewport에 따라 `html` font-size가 변해 모든 `rem` 단위가 비례 스케일.

### 3.4 포트폴리오 Grid 기준 (요구사항)

| Breakpoint | Width |
|------------|-------|
| Mobile | 390px |
| Tablet | 768px |
| Desktop | 1280px |
| Wide | 1440px+ |

---

## 4. Typography 시스템

### 4.1 Font Families

| 토큰 | Font | 용도 |
|------|------|------|
| `.font-1` | **Adelphi PE Variable** (Adobe Typekit) | UI, 본문, 라벨, Bold 강조 |
| `.font-2` | **Gilda Display** (Google Fonts) | Display, Hero, 섹션 타이틀 |

```css
.font-1 { font-family: adelphi-pe-variable, sans-serif; }
.font-2 { font-family: "Gilda Display", serif; font-feature-settings: "liga" 1, "clig" 1; }
body   { font-family: adelphi-pe-variable, sans-serif; font-variation-settings: "opsz" 6, "slnt" 0; }
```

### 4.2 Font Size Scale (`fs--*` utility classes)

| Class | Desktop | Tablet | Mobile | 용도 |
|-------|---------|--------|--------|------|
| `fs--210` | 21rem | 15rem | 7.8rem | Hero "Septiembre." |
| `fs--103` | 10.3rem | 6rem | 5.6rem | Section titles, category |
| `fs--72` | 7.2rem | 5rem | 4.8rem | About body text |
| `fs--50` | — | — | — | Column titles |
| `fs--47` | 4.7rem | 3.3rem | 1.65rem | Subtitle "arquitectura" |
| `fs--35` | — | — | — | Paragraph |
| `fs--28` | — | — | — | Section labels |
| `fs--16` | — | — | — | Scroll hint, UI |
| `fs--13` | — | — | — | Counter numbers |
| `fs--12` | — | — | — | Footer, meta |
| `fs--9` | — | — | — | File indicator |

### 4.3 Font Weight

- `fw-300`, `fw-400`, `fw-600`, `fw-700`, `fw-900`
- Variable font: `font-variation-settings: "wght" 300`

### 4.4 Text Treatment

- `split-words` — 단어별 SplitText 애니메이션
- `text-colorizer` — 스크롤에 따라 단어 색상 전환
- `text-uppercase` / `text-lowercase` — 섹션별 case 규칙
- `btn-underline` — hover 시 underline expand (1s cubic-bezier)

---

## 5. Color System

### 5.1 Core Tokens (`utils.css :root`)

| Token | Value | 용도 |
|-------|-------|------|
| `--white-1` | `#FFFBF2` | Background (warm off-white) |
| `--white-2` | `#FFFFFF` | Pure white |
| `--red-1` | `#9B0000` | Primary text, accent, cursor |
| `--black-1` | `#000000` | Pure black |

### 5.2 Semantic Usage

| Context | Colors |
|---------|--------|
| Body | `background: var(--white-1)`, `color: var(--red-1)` |
| Cursor default | `--color: var(--red-1)`, `--content: var(--white-1)` |
| Dark sections | `data-cursor-style="white"` — inverted cursor |
| Hover accent | `var(--purple-1)` (cursor hover state) |
| Theme meta | `#111111` (browser chrome) |

### 5.3 포트폴리오 Color Direction

레퍼런스의 **warm cream + deep red** 대신 **흑백 미니멀** 적용:

| Token | Suggested |
|-------|-----------|
| `--color-bg` | `#FAFAFA` or `#FFFFFF` |
| `--color-text` | `#111111` |
| `--color-muted` | `#666666` |
| `--color-border` | `#E5E5E5` |
| `--color-accent` | `#111111` (hover invert) |

---

## 6. Spacing 규칙

### 6.1 Layout Spacing

| Token | Value | 용도 |
|-------|-------|------|
| `--padding-fluid` | 4rem → 2.5rem → 2rem | Section horizontal padding |
| `--padding` | 0.8rem | Inner micro spacing |
| `--header-height` | 6.5rem | Header offset |
| `--pt-header` | 0 | Header padding-top |

### 6.2 Section Spacing Patterns

- Hero intro: `100vh` sticky spacer + gallery scroll area
- About: `mt-lg-90`, `mt-mobile-40` — responsive margin-top utilities
- Footer row-2: `padding-top: 8.1rem`
- Column offsets: `offset-lg-1`, `offset-lg-2`, `offset-lg-3`

### 6.3 Utility Classes

- `mt-lg-*`, `mt-mobile-*` — breakpoint별 margin
- `lh-104`, `lh-115`, `lh-130`, `lh-133` — line-height ratios

---

## 7. Animation 패턴

### 7.1 Tech Stack

| Library | Version | Role |
|---------|---------|------|
| GSAP | 3.x | Core animation engine |
| ScrollTrigger | 3.12.7 | Scroll-linked animations |
| ScrollSmoother | 3.12.7 | Smooth scroll (Lenis 대체) |
| SplitText | (Club) | Word/char split reveals |
| Swiper | — | About slider, team carousel |
| Custom AOS | `data-aos` | Declarative scroll animations |

### 7.2 Animation Types

| Pattern | Implementation | Example |
|---------|---------------|---------|
| **Loader** | Progress 0→100%, brand text | `#loader` + `#loading-progress` |
| **Text Reveal** | SplitText + stagger | `.split-words` + `data-aos="d:loop"` |
| **Fade In Up** | opacity + translateY | `fadeInUp .8s ease-out-cubic .6s` |
| **Text Colorizer** | ScrollTrigger scrub | `.text-colorizer[data-colorizer]` |
| **Parallax** | translateY on scroll | `data-parallax data-translate-y-from="-20rem"` |
| **Sticky Pin** | ScrollTrigger pin | `data-sticky data-trigger` |
| **Horizontal Scroll** | Pinned container + x scroll | `.horizontal-scroll` |
| **Gallery Swap** | Trigger zones swap images | `data-get-target` / `data-set-target` |
| **Marquee Drag** | Observer + inertia | `.marquee-team[data-cursor-style="drag"]` |
| **Accordion** | Height expand + image reveal | `.accordion-item` in Works |
| **Hover Gallery** | Image stack on hover | `.b-hover-gallery` |

### 7.3 Easing

| Name | Value | Usage |
|------|-------|-------|
| ease-out-cubic | `cubic-bezier(0.42, 0, 0.58, 1)` | General transitions |
| ease-in-out-cubic | `cubic-bezier(0.785, 0.135, 0.15, 0.86)` | Menu, page transitions |
| expo-out | `cubic-bezier(0.19, 1, 0.155, 1.01)` | Underline hover (1s) |

### 7.4 Timing

| Duration | Usage |
|----------|-------|
| 0.1s | Cursor follow |
| 0.6s | Fade, section reveal |
| 0.8s | Text slide up |
| 1s | Scroll hint, underline |

---

## 8. Scroll Interaction

### 8.1 Smooth Scroll

```javascript
// ScrollSmoother (원본)
ScrollSmoother.create({
  wrapper: "#main-transition",
  content: "[data-scroll-container]",
  smooth: 1.5,
  effects: true
});
```

**포트폴리오 구현**: Lenis + GSAP ScrollTrigger `scrollerProxy` 연동

### 8.2 ScrollTrigger Patterns

| Attribute | Behavior |
|-----------|----------|
| `data-sticky` | Pin element during scroll |
| `data-trigger` | ScrollTrigger trigger selector |
| `data-end` | End position (e.g. `"top 20%"`, `"bottom bottom"`) |
| `data-parallax` | Y-axis parallax on scroll |
| `data-translate-y-from` | Starting offset for parallax |
| `data-parallax-no-mobile` | Disable parallax on mobile |
| `data-scrollto` | Smooth scroll to anchor |
| `data-scrollSection` | Horizontal section navigation |

### 8.3 Scroll Direction

- `body[data-scroll-direction]` — `"initial"` | `"up"` | `"down"`
- Header/menu visibility에 활용

---

## 9. Hover Effect

### 9.1 Link Underline

```css
.btn-underline span {
  background-image: linear-gradient(to right, var(--red-1) 100%, var(--red-1) 0%);
  background-size: 0 1px;
  transition: background-size 1s cubic-bezier(0.19, 1, 0.155, 1.01);
}
/* hover: background-size: 100% 1px */
```

### 9.2 Project Card

- Image scale on hover (subtle zoom)
- Cursor changes to `view` state
- Accordion: hover 시 이미지 프리뷰 reveal

### 9.3 Image Gallery Hover

- `.b-hover-gallery` — stacked images, hover position에 따라 이미지 전환

### 9.4 Category Tabs

- Active category title scale/opacity transition
- Project count badge (`fs--13`)

---

## 10. Page Transition

### 10.1 PJAX Navigation

- `data-pjax` on internal links
- `#main-transition` wrapper handles enter/leave
- `data-navigate-track="reload"` on assets

### 10.2 Transition Flow

```
Click link
  → page-leave-active (opacity 0, translateY)
  → Fetch new page content
  → Replace #main-transition innerHTML
  → page-enter (fade in)
  → Re-init ScrollTrigger, cursor, animations
```

### 10.3 Loader (Every Page Load)

- Full-screen `#loader`
- Brand text "Septiembre." (`fs--210`)
- Progress counter 0→100%
- `body[data-load="first-loading"]` → `"loaded"`

### 10.4 포트폴리오 구현

Next.js App Router:
- View Transitions API 또는 Framer Motion `AnimatePresence`
- Route change 시 GSAP timeline crossfade
- ScrollTrigger `ScrollTrigger.refresh()` on navigation

---

## 11. Custom Cursor

### 11.1 Structure

```html
<div class="cursor-wrapper" id="wrapper-cursor">
  <div></div>  <!-- inner dot/circle -->
</div>
```

### 11.2 Base Styles

```css
.cursor-wrapper {
  position: fixed;
  width: 200px; height: 200px;
  margin: -100px 0 0 -100px;
  transform: var(--mouse-position);
  z-index: 1600000;
  pointer-events: none;
  --width: 1.3rem; --height: 1.3rem;
  --borderRadius: 50%;
  transition: all 0.1s;
}
```

### 11.3 Cursor States (`data-cursor-style`)

| State | Context | Behavior |
|-------|---------|----------|
| `default` | Body default | Small dot (1.3rem circle) |
| `small` | Links, menu, buttons | Smaller dot |
| `small-white` | Footer/dark bg links | Inverted small |
| `view` | Project cards | Scale up + "View" label |
| `drag` | Team marquee | Drag indicator |
| `mix` | Hero image | Blend mode cursor |
| `white` | Dark sections | White cursor |
| `play` | Video buttons | Play icon |
| `prev` / `next` | Swiper nav | Arrow indicators |
| `open` | Team member cards | Expand indicator |
| `off` | Modal iframe | Hidden |

### 11.4 Implementation Notes

- GSAP `quickTo` or lerp for smooth follow
- State managed via `body[data-cursor-style]` or element `data-cursor-style`
- Mobile: `display: none` on `.cursor-wrapper`

---

## 12. 기술 스택 (원본)

| Layer | Technology |
|-------|-----------|
| Backend | Laravel (Blade templates) |
| Build | Vite |
| Animation | GSAP 3 + ScrollTrigger + ScrollSmoother |
| Slider | Swiper |
| Analytics | GTM, Microsoft Clarity |
| Fonts | Adobe Typekit + Google Fonts |
| Navigation | Custom PJAX |

---

## 13. 포트폴리오 리브랜딩 가이드

### 유지할 UX/인터랙션

- Full-viewport Hero + 대형 타이포그래피
- Scroll-triggered project gallery (Hero)
- Works accordion/list + hover image reveal
- Custom cursor (view/drag states)
- Smooth scroll + parallax + text reveal
- Project detail: Hero → Overview → Gallery → Next Project
- Page transition + loader

### 변경/제거

| 레퍼런스 | 포트폴리오 |
|---------|-----------|
| "Septiembre. arquitectura" | "Frontend Developer & UI Engineer" |
| Architecture projects | MLB, 스타벅스, W컨셉 등 |
| Team marquee | **제거** |
| Philosophy horizontal scroll | Skills/Approach 또는 **제거** |
| Red/cream palette | **흑백 미니멀** |
| Career timeline | **제거** |
| Category filter (housing, etc.) | Tech stack / Industry filter |

### CMS-ready Project Fields

```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  year: string;
  client: string;
  description: string;
  thumbnail: string;
  images: string[];
  skills: string[];
}
```

---

## 14. 참고 파일 (분석 소스)

- HTML: `index.html`, `garden.html` (project detail)
- CSS: `utils.css` (tokens), `app.css` (components)
- JS: `app2.js` (GSAP ScrollSmoother, cursor, PJAX)
