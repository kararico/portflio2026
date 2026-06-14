# Septiembre vs 현재 구현 — Gap Analysis

> 목표: [Septiembre Arquitectura](https://www.septiembrearquitectura.com/) 메인 페이지를 **가능한 한 동일하게** 재현한 뒤, 텍스트·이미지만 교체  
> 분석일: 2026-06-13  
> 기준: DOM 구조 · 레이어 구조 · 스크롤 구조 · 애니메이션 구조

---

## 0. 요약

| 영역 | Septiembre | 현재 구현 | 일치도 |
|------|-----------|----------|--------|
| DOM 구조 | `.home-intro` 단일 컨테이너 내 모든 Hero 레이어 | Hero / Gallery / Scene / About **4분할** | ❌ 낮음 |
| 레이어 구조 | sticky 내부 z-index 스택 (type→media→type→gallery) | 외부 레이어 + Shared Element proxy | ❌ 낮음 |
| 스크롤 구조 | pin + center Y이동 + gallery stagger + about cover | pin + FLIP morph + about cover **없음** | ❌ 낮음 |
| 애니메이션 | translateY / scale / opacity / stagger | FLIP rect lerp / expandFromCenter | ❌ 다름 |
| 페이지 섹션 | 6섹션 (intro·about·works·philosophy·team·footer) | 4섹션 (story·works·experience·contact) | ❌ 낮음 |
| 비주얼 토큰 | cream `#FFFBF2` + red `#9B0000` + Adelphi PE | white/gray + Inter | ❌ 의도적 변경됨 |
| 글로벌 UX | Loader · ScrollSmoother · PJAX · cursor states | Lenis · cursor · loader/PJAX **없음** | ⚠️ 부분 |

**결론:** 현재 구현은 Septiembre를 **참고·재해석**한 구조이며, 나란히 비교 시 "같은 사이트" 수준이 아님. DOM·스크롤·애니메이션 전면 재구성 필요.

---

## 1. DOM 구조

### 1.1 Septiembre (원본)

```
body
├── #loader                         ← 풀스크린 로더 (0→100%)
├── .cursor-wrapper
├── #header
│   └── nav.menu                    ← 풀스크린 오버레이 메뉴
├── #main-transition
│   └── .wrapper[data-scroll-container]
│       └── main[data-pg="pg-home"]
│           ├── .home-intro          ← ★ Hero scroll track (≈200–300vh)
│           │   └── [data-sticky] .intro-sticky   ← pin 대상 (100vh)
│           │       ├── .intro-title--back        ← "Septiembre."
│           │       ├── .intro-media              ← 중앙 GIF/이미지
│           │       ├── .intro-title--front       ← multiply 오버레이 타이포
│           │       ├── .intro-subtitle           ← "arquitectura"
│           │       ├── .intro-ui                 ← Scroll, counter, Since
│           │       └── .intro-gallery            ← floating items ×6
│           │           └── .gallery-item × N
│           ├── .home-about-us       ← About (Hero 위로 cover)
│           ├── .home-other-projects ← Works (카테고리 + 아코디언)
│           ├── .home-things-that-inspire ← Philosophy (수평 스크롤)
│           ├── .home-team           ← Team marquee
│           └── footer#footer
```

**핵심:** Hero·Gallery·중앙 이미지·타이포가 **`.intro-sticky` 하나** 안에 존재. Gallery는 별도 `<section>`이 아님.

### 1.2 현재 구현

```
body
├── (loader 없음)
├── CursorProvider
├── #header                          ← 간소화된 헤더/메뉴
├── #main-transition
│   └── [data-scroll-container]
│       └── main
│           ├── HomeStory[data-home-story]    ← ★ 커스텀 래퍼 (Septiembre에 없음)
│           │   ├── .heroLayer → Hero[data-hero-section]
│           │   │   └── [data-hero-stage]     ← pin 대상
│           │   │       ├── [data-hero-meta]
│           │   │       ├── [data-hero-composition]
│           │   │       │   ├── title back
│           │   │       │   ├── [data-hero-center-slot]  ← 빈 placeholder
│           │   │       │   └── title front
│           │   │       └── footer meta
│           │   ├── .galleryLayer → HeroGallery (별도 section)
│           │   ├── .sceneLayer → SceneCenterImage (shared proxy)
│           │   └── .aboutLayer → About
│           ├── Works
│           ├── Experience              ← Septiembre에 없는 섹션
│           └── Contact
```

**차이점:**

| 항목 | Septiembre | 현재 |
|------|-----------|------|
| Hero 컨테이너 | `.home-intro` | `[data-hero-section]` + `HomeStory` 래퍼 |
| Gallery 위치 | `.intro-sticky` **내부** `.intro-gallery` | **별도** `HeroGallery` section |
| 중앙 이미지 | `.intro-media` (sticky 내부) | `SceneCenterImage` (외부 fixed proxy) |
| About 위치 | `.home-about-us` (intro **형제**) | `HomeStory` **내부** aboutLayer |
| subtitle | `.intro-subtitle` ("arquitectura") | **없음** (roleLine으로 대체) |
| data 속성 | `data-sticky`, `data-get-target`, `data-set-target` | `data-scene-center`, `data-scene-satellite` 등 **자체 규약** |

---

## 2. 레이어 구조 (z-index)

### 2.1 Septiembre

| z-index | 요소 | 비고 |
|---------|------|------|
| 1 | `.intro-title--back` | 진한 red, full-width |
| 2 | `.intro-media` | 중앙 세로형 GIF |
| 3 | `.intro-title--front` + `.intro-subtitle` | multiply / overlay |
| 4 | `.intro-ui` | Scroll hint, index, Since |
| 4–5 | `.intro-gallery` `.gallery-item` | floating images |
| 10+ | `.home-about-us` | 다음 섹션이 Hero **덮음** |

모든 레이어가 **동일 sticky viewport** 기준 좌표계.

### 2.2 현재

| z-index | 요소 | 비고 |
|---------|------|------|
| 1 | `.heroLayer` | Hero stage |
| 2 | `.galleryLayer` | Gallery (Hero **형제**, pin 중 fixed) |
| 3 | `.aboutLayer` | About |
| 6 | `.sceneLayer` | Shared center image proxy |
| (composition 내부) | title back z1, slot z2, title front z3 | Septiembre와 유사하나 **이미지 레이어가 비어 있음** |

**차이점:**

- Gallery가 Hero sticky **밖**에 있어 좌표계가 분리됨
- 중앙 이미지가 composition grid가 아닌 **sceneLayer fixed proxy**로 렌더
- About cover z-index 10+ **동작 없음** (About가 cover slide-up 하지 않음)
- `intro-subtitle` 레이어 없음

---

## 3. 스크롤 구조

### 3.1 Septiembre

```
[Loader]
    ↓
.home-intro (scroll track ≈ 200–300vh)
    │
    ├── intro-sticky PIN (100vh, ScrollTrigger)
    │     scroll progress 0% ──────────────────── 100%
    │
    ├── .home-about-us translateY(100vh → 0)  [72–100%]
    │
    └── pin 해제 → About가 Hero 완전히 덮음
         ↓
.home-about-us (pinned text colorizer + video/slider)
    ↓
.home-other-projects
    ↓
.home-things-that-inspire (horizontal scroll pin)
    ↓
.home-team (marquee drag)
    ↓
footer
```

**Pin 거리:** 데스크톱 ≈ 250vh (추정), 모바일 축소  
**Smooth scroll:** ScrollSmoother (`smooth: 1.5`, `effects: true`)

### 3.2 현재

```
(Loader 없음)
    ↓
HomeStory (200vh desktop / 160vh mobile)
    │
    ├── heroStage PIN
    │     0–15%   meta fade
    │     10–55%  title scale/fade
    │     35–58%  composition drift
    │     35–95%  ★ FLIP center morph (Septiembre에 없는 방식)
    │     42–95%  ★ satellite expand from center
    │     (about cover 없음)
    │
    └── pin 해제 → data-scene-settled handoff
         ↓
About (HomeStory 내부, 일반 스크롤 + profile distortion)
    ↓
Works (아코디언 — Septiembre other-projects와 부분 유사)
    ↓
Experience (Septiembre에 없음)
    ↓
Contact (footer 대체)
```

**차이점:**

| 패턴 | Septiembre | 현재 |
|------|-----------|------|
| Pin 대상 | `.intro-sticky` | `[data-hero-stage]` ✅ 유사 |
| Pin 거리 | ≈250vh | 200vh ⚠️ |
| Center image 이동 | **translateY ↑** (0–38%) | FLIP rect lerp (35–95%) ❌ |
| Gallery 등장 | **stagger** opacity+y (22–78%) | expandFromCenter ❌ |
| About 전환 | **translateY cover** (72–100%) | 없음 ❌ |
| Gallery 섹션 슬라이드 | 없음 (sticky 내부 reveal) | margin-top -100vh + fixed overlay ❌ |
| Smooth scroll | ScrollSmoother | Lenis ✅ 대체 가능 |

---

## 4. 애니메이션 구조

### 4.1 Septiembre Hero 타임라인 (정규화 0–100%)

| 구간 | 동작 |
|------|------|
| 0% | Rest — center auto-play, gallery hidden (opacity 0, y+180~200) |
| 0–15% | UI meta fade out |
| 0–38% | **Center media translateY ↑** + subtle scale |
| 8–65% | Back typography scale ↓ |
| 12–55% | Front typography opacity ↓ |
| 22–78% | **Gallery stagger reveal** (opacity + translateY) |
| 58–85% | Composition drift upward |
| 72–100% | **About cover slide up** (translateY 100vh→0) |
| 100% | Pin 해제, About solid cover |

**중앙 이미지 교체:** `data-get-target` / `data-set-target` scroll zone 기반 (Featured 프로젝트 swap)

### 4.2 현재 Hero 타임라인

| 구간 | 동작 |
|------|------|
| 0–15% | meta fade ✅ |
| 10–55% | title back scale/opacity ✅ 유사 |
| 14–50% | title front fade ✅ 유사 |
| 35–58% | composition drift ✅ 유사 |
| 35–95% | **FLIP: hero slot → gallery slot rect lerp** ❌ |
| 42–95% | **satellite expandFromCenter** ❌ |
| 38–72% | gallery backdrop opacity |
| — | centerMove (translateY) **없음** ❌ |
| — | gallery stagger **없음** ❌ |
| — | aboutCover **없음** ❌ |

### 4.3 애니메이션 기법 비교

| 기법 | Septiembre | 현재 | 조치 |
|------|-----------|------|------|
| Center move | GSAP `y` on `.intro-media` | FLIP `lerpRect` | **제거 → translateY 복원** |
| Gallery reveal | opacity + y stagger | expandFromCenter | **제거 → stagger 복원** |
| About handoff | about `translateY(100vh→0)` | scene settled handoff | **about cover 구현** |
| Image swap | scroll zone triggers | 3s auto slider | **data-get/set-target 패턴** |
| Shared element | 없음 | SceneCenterImage proxy | **제거, intro-media 단일 요소** |
| scrub | 단일 timeline ~0.85 | 단일 timeline 0.85 | ✅ |
| Typography | SplitText + scale | textReveal + scale | ⚠️ SplitText 도입 검토 |

---

## 5. 메뉴 · 네비게이션 · 글로벌

| 항목 | Septiembre | 현재 |
|------|-----------|------|
| 로고 | "Septiembre." (fs--210 축소) | "허정원." |
| 메뉴 | 풀스크린 overlay + stagger link reveal | 우측 슬라이드 nav |
| 메뉴 항목 | about / projects / philosophy / team / contact | About / Works / Experience / Contact |
| Loader | `#loader` 0→100% + brand text | **없음** |
| Cursor | 10+ states (view, drag, mix, play…) | 기본 + small |
| Page transition | PJAX `#main-transition` | Next.js default |
| Scroll direction | `body[data-scroll-direction]` | **없음** |

---

## 6. 섹션별 Gap

### 6.1 Hero (`.home-intro`)

| 요소 | Septiembre | 현재 | Gap |
|------|-----------|------|-----|
| Back title | "Septiembre." red, fs--210 | "Jungwon Heo." black | 콘텐츠만 (구조 동일) |
| Subtitle | "arquitectura" sans | 없음 | **DOM 추가 필요** |
| Center media | GIF in sticky | external proxy | **sticky 내부로 이동** |
| Front title | multiply overlay | rgba multiply | ✅ 유사 |
| Gallery | 6 items in sticky | 5 satellites + separate section | **구조·개수·배치** |
| UI | Scroll, %, Since 2013 | credential, index, roles | **배치·항목** |
| Pin height | ~250vh | 200vh | **수치 조정** |

### 6.2 About (`.home-about-us`)

| 요소 | Septiembre | 현재 |
|------|-----------|------|
| 진입 | Hero cover slide-up | HomeStory 내부 일반 flow |
| 레이아웃 | text colorizer + video + Swiper | profile + distortion hover |
| Pin | text block pin | 부분 pin (about animation) |
| 배경 | cream solid | custom background |

**→ About를 HomeStory 밖으로 분리 + cover slide-up 필수**

### 6.3 Works (`.home-other-projects`)

| 요소 | Septiembre | 현재 |
|------|-----------|------|
| 필터 | housing / interior / infrastructure / masterplan | 없음 (flat list) |
| 리스트 | accordion + hover image | accordion ✅ 부분 유사 |
| 카운트 badge | category별 project count | 없음 |

### 6.4 Philosophy (`.home-things-that-inspire`)

**현재: 섹션 없음** — 수평 스크롤 + pinned thumbs 전체 미구현

### 6.5 Team (`.home-team`)

**현재: 없음** — marquee drag carousel 미구현  
(콘텐츠 교체 시 team → 다른 섹션 가능하나, **구조 복제 우선**이면 필요)

### 6.6 Footer

| Septiembre | 현재 |
|-----------|------|
| `footer#footer` Contact/Social/Newsletter | `Contact` section |

---

## 7. 비주얼 · 토큰 (구조 이후 적용)

현재는 **의도적으로** Septiembre와 다른 토큰 사용:

| Token | Septiembre | 현재 |
|-------|-----------|------|
| Background | `#FFFBF2` | `#FAFAFA` / white |
| Text | `#9B0000` | `#111` |
| Display font | Gilda Display | Gilda Display ✅ |
| UI font | Adelphi PE Variable | Inter ❌ |
| Hero size | fs--210 (21rem) | clamp custom |
| html font-size | fluid vw | fixed rem |

**→ Phase 5 (콘텐츠 교체) 전에 Phase 1–4에서 Septiembre 토큰 그대로 적용**

---

## 8. 제거·중단 대상 (현재 재해석 산출물)

다음은 Septiembre 복제와 **충돌**하므로 제거 또는 전면 교체:

| 파일/기능 | 이유 |
|----------|------|
| `SceneCenterImage` + `sceneTransition.ts` | Septiembre에 없는 FLIP proxy |
| `HeroGallery` 별도 section | Gallery는 intro-sticky **내부** |
| `HomeStory` 4-layer split | `.home-intro` 단일 구조로 통합 |
| About profile distortion (OGL) | Septiembre about UX와 다름 |
| `Experience` section | 원본 페이지에 없음 |
| Inter font / B&W tokens | 원본 cream/red 복원 |
| `heroStory` FLIP phases | stagger + centerMove + aboutCover phases로 교체 |

---

## 9. 구현 로드맵

### Phase 1 — DOM · 레이어 재구성 (최우선)

1. `HomeStory` 제거 → `.home-intro` / `.intro-sticky` 구조로 통합
2. Gallery를 Hero sticky **내부** `.intro-gallery`로 이동
3. `SceneCenterImage` 제거 → `.intro-media` 단일 요소
4. `.intro-subtitle` 레이어 추가
5. About를 `.home-about-us`로 **형제 섹션** 분리 + `[data-about-cover]`

### Phase 2 — 스크롤 · Pin

1. Pin 거리 250vh (desktop) / 180vh (mobile) — 원본 측정값 반영
2. ScrollSmoother-equivalent Lenis tuning (`smooth: 1.5` feel)
3. About cover `translateY(100vh → 0)` ScrollTrigger

### Phase 3 — 애니메이션 타이밍 (원본 phase 상수)

```ts
scrollPhases: {
  metaFade:         { start: 0,    end: 0.15 },
  centerMove:       { start: 0,    end: 0.38 },
  titleBack:        { start: 0.08, end: 0.65 },
  titleFront:       { start: 0.12, end: 0.55 },
  galleryReveal:    { start: 0.22, end: 0.78 },
  compositionDrift: { start: 0.58, end: 0.85 },
  aboutCover:       { start: 0.72, end: 1.0  },
}
```

- centerMove: `.intro-media` `translateY` + scale
- galleryReveal: `.gallery-item` opacity + y stagger
- aboutCover: `.home-about-us` slide up

### Phase 4 — 글로벌 · 나머지 섹션

1. `#loader` 구현
2. Header / fullscreen menu (원본 동작)
3. `.home-other-projects` (카테고리 필터)
4. `.home-things-that-inspire` (horizontal scroll)
5. `.home-team` (marquee)
6. `footer#footer`
7. Cursor states (view, drag, mix…)
8. PJAX or View Transitions (선택)

### Phase 5 — 콘텐츠 교체

- 텍스트 → 허정원 포트폴리오 copy
- 이미지 → 프로젝트 에셋
- (구조·타이밍 변경 없음)

---

## 10. 성공 기준 (Acceptance)

나란히 비교 시:

- [ ] Hero DOM이 `.intro-sticky` 단일 viewport 안에 모든 레이어 포함
- [ ] 스크롤 0–38% center image가 **위로 이동** (FLIP 아님)
- [ ] Gallery가 **stagger fade-up** (섹션 slide-up 아님)
- [ ] About가 72%+ 구간에서 **Hero를 덮으며** 올라옴
- [ ] Pin 해제 전후 **섹션 전환** feel 동일
- [ ] cream/red · Adelphi · Gilda · fs scale 동일
- [ ] 메인 페이지 6섹션 순서 동일
- [ ] 콘텐츠만 다르고 UX 동일

---

## 11. 참고 파일

| 용도 | 경로 |
|------|------|
| 원본 분석 | `docs/site-analysis.md` |
| Hero interaction (구 버전) | `docs/septiembre-hero-interaction.md` |
| 현재 Hero | `src/sections/Hero/` |
| 현재 Gallery | `src/sections/HeroGallery/` |
| 현재 Story wrapper | `src/sections/HomeStory/` |
| FLIP (제거 예정) | `src/animations/sceneTransition.ts` |
| Phase constants (교체 예정) | `src/data/heroStory.ts` |
