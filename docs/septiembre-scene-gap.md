# Septiembre Gap Analysis — Hero · Gallery · Scroll · Transition

> 목표: [Septiembre Arquitectura](https://www.septiembrearquitectura.com/) 메인 페이지 **동일 재현**  
> 기준: Hero · Gallery · Scroll · Transition · Hover · Page Transition  
> 분석일: 2026-06-13

---

## 1. Hero

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| DOM | `.home-intro` > `.intro-sticky` 단일 pin viewport | ✅ `.home-intro` > `.intro-sticky` | 구조 유사 |
| Back title | `.intro-title--back` z1, fs--210, red | `[data-hero-title-back]` black, clamp size | **비주얼 토큰** 미일치 |
| Center media | `.intro-media` z2, sticky **내부** | `[data-intro-media]` sticky 내부 | ✅ |
| Front title | `.intro-title--front` multiply z3 | `[data-hero-title-front]` multiply | ✅ |
| Subtitle | `.intro-subtitle` "arquitectura" | `[data-intro-subtitle]` placeholder | ✅ 구조 |
| Gallery 위치 | `.intro-gallery` sticky **내부** z4–5 | `IntroGallery` sticky **내부** | ⚠️ **z-index 분리 필요** |
| 레이어 관통 | 이미지가 타이포 사이 | grid 겹침 composition | ✅ |

**핵심 Gap:** Hero(z1) / Gallery(z2) **덮기 레이어** 없음. Gallery가 Hero sticky 내부에 flat하게 존재.

---

## 2. Gallery

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| 초기 상태 | opacity 0, translateY +180~200px | GSAP set opacity 0, y 200 | ✅ 코드상 유사 |
| 등장 | scroll stagger | timeline stagger | ✅ |
| 클릭 | FLIP → fullscreen → detail | **링크 없음 / 즉시 이동 없음** | ❌ FLIP 미구현 |
| Hover | VIEW cursor (mix/view state) | `data-cursor-style` **없음** | ❌ |
| Hero 덮기 | gallery + backdrop이 intro 위에 쌓임 | backdrop **없음**, cover phase **없음** | ❌ |
| pointer-events | hover/click 가능 | `pointer-events: none` | ❌ |

---

## 3. Scroll

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| Pin | `.intro-sticky` ≈250vh | ✅ 250vh / 180vh | ✅ |
| Center move | **translateY ↑ 강하게** (0–38%) | y: -140px desktop | ⚠️ **이동량 부족** |
| Text drift | scale/opacity only | + **composition drift y** | ❌ **텍스트 블록 이동 과다** |
| Gallery reveal | 22–78% stagger | 22–78% | ✅ |
| Gallery cover | intro 위 gallery layer 완전 덮음 | **없음** | ❌ |
| About cover | 72–100% translateY | ✅ aboutCover | ✅ |
| Scene feel | 한 viewport 내 재배치 | 요소별 GSAP | ⚠️ **장면 전환감 부족** |

**사용자 체감 문제:** composition 전체 `y` drift → "텍스트만 이동"처럼 느껴짐. center media 이동이 약함.

---

## 4. Transition (Scene)

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| Hero → Gallery | 같은 scene 재배치 | stagger + 약한 center move | ❌ |
| Center → gallery cluster | media Y↑ + gallery surround | center scale만, FLIP 없음 | ❌ |
| Gallery → Hero cover | gallery layer z2 덮음 | z-index 분리 없음 | ❌ |
| Section handoff | About slide-up | ✅ | ✅ |

**목표 동작:** Hero 중앙 이미지가 **먼저** 위로 크게 이동 → gallery items stagger → gallery backdrop이 hero **완전히** 가림.

---

## 5. Hover

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| VIEW 버튼 | 원형, scale 0→1, opacity 0→1 | CursorProvider VIEW state **존재** | ⚠️ gallery 미연결 |
| 위치 | **마우스 추적** (quickTo) | global cursor quickTo ✅ | gallery item hover **미연결** |
| data-cursor-style | `view` / `mix` on gallery | gallery items **없음** | ❌ |

---

## 6. Page Transition

| 항목 | Septiembre | 현재 구현 | Gap |
|------|-----------|----------|-----|
| Gallery click | thumbnail rect 캡처 | **없음** | ❌ |
| Expand | FLIP → fullscreen image | **없음** | ❌ |
| Detail enter | shared element morph | Next.js instant route | ❌ |
| Back | reverse FLIP to gallery slot | **없음** | ❌ |
| GSAP Flip plugin | 사용 | **미등록** | ❌ |

---

## 7. 구현 우선순위 ↔ Gap 매핑

| 순위 | 작업 | 해결 Gap |
|------|------|---------|
| **1** | Hero → Gallery Scene Transition | center Y↑ 강화, composition drift 제거, scene phase |
| **2** | Gallery가 Hero 덮기 | galleryLayer z2 + backdrop cover |
| **3** | Gallery stagger 등장 | y 150–250, opacity 0, pointer-events |
| **4** | Hover VIEW cursor | data-cursor-style="view" on items |
| **5** | Shared Element Page Transition | Flip plugin + galleryPageTransition |

---

## 8. 이번 스프린트 적용 범위

- [x] Gap 문서 (본 파일)
- [ ] Gallery → HomeStory `galleryLayer` (z2) 분리
- [ ] `galleryCover` + backdrop hero 덮기
- [ ] centerMove 강화, compositionDrift **제거**
- [ ] gallery stagger y 200→0
- [ ] gallery item `data-cursor-style="view"`
- [ ] `galleryPageTransition.ts` scaffold (priority 5)

---

## 9. 참고

- 이전 분석: `docs/septiembre-gap-analysis.md`
- 원본 분석: `docs/site-analysis.md`
