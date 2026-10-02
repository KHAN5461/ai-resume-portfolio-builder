# Implementation Plan - Editor UI/UX Refinement & Tab Integration

A comprehensive blueprint to refine the editor workspace for both the Resume and Portfolio builders, addressing head tool aesthetics, device-responsive viewport containment, and the integration of the visual Portfolio Form editor.

> [!IMPORTANT]
> This plan adopts a **Zero-Overlap responsive posture**:
> - **Desktop Baseline (1440px)**: Side-by-side split screen with an adjustable multi-tab left panel (Form Editor / AI Assistant) and real-time live preview canvas.
> - **Mobile Viewports (<768px)**: Full-bleed live preview canvas overlaid with a tactile slide-up Bottom Sheet (Drawer) containing the editing form, ensuring active edits do not overlap the rendering area.

---

## 1. Overview & Core Concept

We are upgrading the workspace editor for both the **Resume Builder** and the **Portfolio Builder** to ensure premium usability, tactile responsiveness, and layout parity. 

### Key Objectives:
1. **Premium Header Refinement**: Revamp the top toolbar (`GlobalEditorToolbar`) with hairline dividers, high-contrast action triggers, clean loading/sync telemetry, and tooltips.
2. **Device Isolation Layout**:
   - **Desktop**: Left panel gets dual-tab mode (AI Copilot vs. Form Section). Right panel hosts the fine-grained Inspector. Center canvas displays the interactive live preview.
   - **Mobile**: The viewport renders the live canvas as the background field, with editing fields housed in a gestural, slide-up bottom drawer, enabling instant live visual feedback.
3. **Portfolio Form Tab Integration**: Wire the existing, unused `PortfolioFormSection` (which includes Draggable Bento grid project ordering, about text, contacts, and custom blocks) into the main editor workspace.

---

## 2. User Experience & Visual Design

### Responsive Layout Strategy

#### Desktop (Split Workspace)
```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Back    [Resume/Portfolio Name]    Saved ●       [ Undo Redo ] Export │
├─────────────────────────┬─────────────────────────┬────────────────────┤
│                         │                         │                    │
│ Left Sidebar (Tabs)     │   Center Canvas         │ Properties Panel   │
│ ┌─────────────────────┐ │ ┌─────────────────────┐ │ ┌────────────────┐ │
│ │  Form  │  AI Chat   │ │ │                     │ │ │ Section Config │ │
│ ├─────────────────────┤ │ │                     │ │ ├────────────────┤ │
│ │                     │ │ │     Interactive     │ │ │                │ │
│ │  Portfolio/Resume   │ │ │     Live Preview    │ │ │  Block-level   │ │
│ │  Editing Form       │ │ │     A4 / Web Page   │ │ │  Properties    │ │
│ │  Fields             │ │ │                     │ │ │                │ │
│ │                     │ │ │                     │ │ │                │ │
│ └─────────────────────┘ │ └─────────────────────┘ │ └────────────────┘ │
└─────────────────────────┴─────────────────────────┴────────────────────┘
```

#### Mobile (Overlay Bottom Sheet)
```
┌─────────────────────────────────────────┐
│ ← Back      Portfolio Editor    Export  │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│            Live Preview Canvas          │
│            (Interactive Background)     │
│                                         │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │             ═══                 │   │  <--- Drag Handle
│   │    Section Form Editor          │   │  <--- Slide-up Bottom Sheet (60% Height)
│   │    - Hero Profile               │   │
│   │    - Draggable Bento Projects   │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│    Chat    ·    Preview    ·   Editor   │  <--- Tab bar switcher
└─────────────────────────────────────────┘
```

### Visual Identity & Palette Compliance
- **60-30-10 Color Distribution**: Off-white/slate canvas (60%), borders and form card frames tinted with subtle cool gray/slate (30%), interactive state indicators and primary accents budgetary focused on premium Indigo/Sky Blue (10%).
- **Aesthetic Direction**: Ultra-clean, editorial layout with elegant typography and crisp dividers. Eliminates static badges and bulky boxes.

---

## 3. Technical Implementation & Data Strategy

### Technical Component Mapping

```
[Store/State (Redux Undo)]
      │
      ▼
[EditPortfolio / EditResume Pages]
      │
      ├─► [GlobalEditorToolbar] (Premium sticky top header)
      │
      ├─► [Desktop Workspace] (md:flex)
      │     ├─► Left Panel (Tabs: PortfolioFormSection / AIPortfolioChat)
      │     ├─► Center Panel (PreviewWindow -> CanvasArea)
      │     └─► Right Panel (UnifiedInspector)
      │
      └─► [Mobile Workspace] (md:hidden)
            ├─► Full Screen Background Canvas
            ├─► Slide-Up Bottom Drawer (Framer Motion: PortfolioFormSection)
            └─► Gemini-style Navigation bar (Chat, Preview, Editor toggles)
```

### Step-by-Step Execution Plan:
1. **Refine `GlobalEditorToolbar.jsx`**:
   - Modernize border styling and align icons.
   - Adjust vertical alignment, padding, and text contrast to ensure zero-wrap layouts.
2. **Update `src/dashboard/portfolio/[portfolioId]/edit/index.jsx`**:
   - Add state: `leftPanelTab` ('form' | 'ai') defaulting to 'form'.
   - Render a segmented tab control at the top of the Left Panel (Desktop).
   - Render `PortfolioFormSection` inside the Left Panel if 'form' is active; render `AIPortfolioChat` if 'ai' is active.
   - Implement the Framer-motion slide-up Bottom Sheet on mobile for the `builder` (Editor) view.
3. **Parity Tuning for Resume Editor**:
   - Match toolbar layout and ensure zero-overlap margins.
   - Restructure mobile views to keep preview container as base and use responsive bottom drawer layout for forms.
4. **Compile & Verification**:
   - Run linter and compiler checks to guarantee a flawless, high-performance production build.
