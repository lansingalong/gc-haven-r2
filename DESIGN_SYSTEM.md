# Quill Web UI Kit

Independent design library for web projects. Separate from the Wellframe Mobile Library.

**Figma source:** https://www.figma.com/design/UxdhVyubwT21HTXzwhMSQ1/Quill--Web-UI-Kit

---

## Stack

- React + TypeScript
- CSS Modules for component styles
- No Tailwind — all styling via CSS custom properties and `.module.css` files
- Icons: use `@mui/icons-material` or inline SVG — never emoji

---

## Token system

| File | Purpose |
|------|---------|
| `src/tokens/tokens.ts` | TypeScript token object |
| `src/tokens/variables.css` | CSS custom properties — import once at app root |

**Rules:**
- Never hardcode hex values, font sizes, or spacing in component files
- Always reference a token: `var(--color-primary)` in CSS, `tokens.color.primary.main` in TS
- Do not import `tokens.ts` inside `.module.css` — use `variables.css` custom properties

---

## Typography

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `--font-size-xs` | 11px | 400/500 | Caption, chip label, input label |
| `--font-size-sm` | 13px | 400 | Body2, input value, menu item |
| `--font-size-md` | 14px | 400/500 | Body, subtitle2 |
| `--font-size-xl` | 20px | 500 | h6 |

Base font: **Roboto** (weights 400 and 500 only).
Mono font: **Roboto Mono** (library headings only).

---

## Colors

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | `#005d9f` | Brand actions, links, focus |
| `--color-text-primary` | `#000000de` | Body text |
| `--color-text-secondary` | `#00000099` | Labels, placeholders |
| `--color-text-disabled` | `#00000061` | Disabled states |
| `--color-error` | `#d32f2f` | Error, required markers |
| `--color-divider` | `#0000001f` | Borders, dividers |
| `--color-action-active` | `#0000008f` | Icons, adornments |
| `--color-action-selected` | `#00000014` | Hover/selected BG |

Semantic colors (not in tokens file — use directly):
- Secondary: `#9c27b0`
- Warning: `#ed6c02`
- Info: `#0288d1`
- Success: `#2e7d32`

---

## Border radius

- `--radius-sm`: `4px` — inputs, dropdowns, cards, buttons
- `--radius-full`: `100px` — chips, pill badges, FABs

---

## Elevation / Shadows

- `--shadow-1` — standard card/dropdown shadow

---

## Component conventions

### File structure
```
src/components/
  ComponentName/
    ComponentName.tsx        # Component + types
    ComponentName.module.css # Scoped styles using CSS vars
    ComponentName.test.tsx   # Unit tests
    index.ts                 # Re-export (optional)
```

### Naming
- Props interfaces: `ComponentNameProps`
- CSS classes: camelCase in `.module.css`
- Named exports only — no default exports for components

### States every interactive component must handle
`default` → `hover` → `focus` → `pressed` → `disabled` → `error`

---

## Component inventory

### ✅ Built
| Component | File | Notes |
|-----------|------|-------|
| `AutocompleteSingle` | `Autocomplete/` | Single select with filtering, clear, keyboard |
| `AutocompleteMulti` | `Autocomplete/` | Multi-select with chips |
| `Button` | `Button/` | contained/outlined/text × 8 colors × 3 sizes |
| `IconButton` | `Button/` | 3 sizes × 9 colors |
| `LoadingButton` | `Button/` | Spinner replaces start icon |

### 🔲 Scaffolded (props typed, CSS pending)
**Inputs**
- `ButtonGroup` — horizontal/vertical grouping of Buttons
- `Checkbox` — indeterminate support, label slot
- `DateTimePicker` — date/time/datetime modes
- `FloatingActionButton` — circular, extended variant
- `LogoButton` — button with image/logo slot
- `RadioGroup` + `Radio` — controlled group
- `Rating` — star rating, readonly mode
- `Select` — single/multi, grouped options
- `Slider` — range, marks, tooltips
- `Switch` — toggle, label slot
- `TextField` — outlined/filled/standard, adornments
- `ToggleButton` + `ToggleButtonGroup` — exclusive/multi select

**Data Display**
- `Avatar` + `AvatarGroup` — image/initials/icon, stacked group
- `Badge` — dot/count, color variants
- `Chip` — filled/outlined, deletable, clickable
- `Divider` — horizontal/vertical, with text
- `Icon` — wrapper for icon library
- `List` + `ListItem` + `ListItemText` + `ListSubheader`
- `Tooltip` — placement variants, arrow
- `Typography` — h1–h6, body1/2, caption, overline

**Feedback**
- `Alert` + `AlertTitle` — severity: error/warning/info/success
- `Backdrop` — overlay with onClick
- `Dialog` + `DialogTitle` + `DialogContent` + `DialogActions`
- `CircularProgress` + `LinearProgress` — determinate/indeterminate
- `Skeleton` — text/rect/circular variants
- `Snackbar` — auto-hide, action slot

**Surfaces**
- `Accordion` + `AccordionSummary` + `AccordionDetails`
- `AppBar` + `Toolbar`
- `Paper` — elevation levels 0–8
- `Popover` — anchor-based positioning

**Navigation**
- `Breadcrumbs` — separator, max items collapse
- `Drawer` — temporary/persistent, left/right/top/bottom
- `Footer`
- `Link` — underline variants, color
- `Menu` + `MenuItem` + `MenuList`
- `Pagination` — size, shape, sibling count
- `SpeedDial` + `SpeedDialAction`
- `Stepper` + `Step` + `StepLabel` — horizontal/vertical, alternativeLabel
- `Tabs` + `Tab` — scrollable, indicator color

**Layout**
- `Container` — maxWidth breakpoints
- `Stack` — direction, spacing, dividers
- `ImageList` + `ImageListItem` — masonry/quilted/woven/standard

**Data Visualization**
- `Timeline` + `TimelineItem` + `TimelineContent`
- `TreeView` + `TreeItem`
- `ChartWrapper` — Recharts-based (see `Charts/README.md`)

**Forms**
- `Form` + `FormField` + `FormActions` — layout wrapper

---

## Claude Code instructions

- Read this file and `src/tokens/variables.css` before building any component
- When building a scaffolded component, pull the Figma node using the MCP tool first
- Never introduce raw color values — always map to tokens
- Follow the file structure above exactly
- Export all new components from `src/components/index.ts`
- When a Figma node URL is provided, extract the node ID and call the Figma tool

## Figma node map (for Claude Code reference)

| Component | Node ID |
|-----------|---------|
| Button | `6543:36648` |
| ButtonGroup | `6543:39713` |
| Checkbox | `6543:43023` |
| FloatingActionButton | `6556:38207` |
| LogoButton | `6700:66907` |
| RadioGroup | `6558:39248` |
| Rating | `6562:39536` |
| Forms | `6569:39787` |
| Select | `6569:39888` |
| Slider | `6562:38897` |
| Switch | `6564:39109` |
| TextField | `6570:46740` |
| ToggleButton | `6601:50950` |
| Avatar | `6587:47387` |
| Badge | `6587:47476` |
| Chip | `6588:47646` |
| Divider | `6589:48662` |
| Icons | `6594:47638` |
| List | `6591:48829` |
| Tooltip | `6590:48756` |
| Typography | `6605:52433` |
| Alert | `6595:48177` |
| Backdrop | `6586:47112` |
| Dialog | `6586:47137` |
| Progress | `6586:46832` |
| Skeleton | `6596:49007` |
| Snackbar | `6586:47073` |
| Accordion | `6583:45995` |
| AppBar | `6583:46303` |
| Paper | `6584:46700` |
| Popover | `1488:24653` |
| Footer | `3835:12436` |
| Breadcrumbs | `6572:50395` |
| Drawer | `6574:50653` |
| Link | `6574:50673` |
| Menu | `6576:50713` |
| Pagination | `6598:49047` |
| SpeedDial | `6599:50806` |
| Stepper | `6576:50917` |
| Tabs | `6579:45052` |
| Container | `7556:51279` |
| Spacing | `8991:87924` |
| Timeline | `6602:51369` |
| Stack | `11084:151828` |
| ImageList | `1473:8106` |
| DateTime | `6569:39384` |
| Charts | `1182:9218` |
| TreeView | `6601:51109` |
| Autocomplete | `6570:49843` |
