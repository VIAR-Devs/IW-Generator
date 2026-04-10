# Design Guidelines: Shariah-Compliant Islamic Will Generator

## Design Approach: Professional Design System

**Selected Approach**: Material Design with Islamic Cultural Adaptation
**Justification**: This is a utility-focused legal application requiring trust, clarity, and structured information flow. Material Design's robust form components and clear hierarchy serve the functional needs while allowing tasteful cultural customization.

**Core Principles**:
- Professional credibility and legal gravitas
- Cultural sensitivity with Islamic design elements
- Clear, guided user journey through complex legal requirements
- Accessibility and readability for all age groups

## Color Palette

**Primary Colors (Dark & Light Mode)**:
- Primary: 158 65% 35% (Deep teal - trustworthy, professional, Islamic aesthetic)
- Primary Light: 158 55% 92%
- Secondary: 220 15% 25% (Charcoal for structure)
- Background Dark: 220 18% 12%
- Background Light: 0 0% 98%

**Semantic Colors**:
- Success: 142 76% 36%
- Warning: 38 92% 50%
- Error: 0 72% 51%
- Info: 210 100% 50%

**Accent (Minimal Use)**:
- Gold accents: 45 80% 45% (only for Islamic decorative elements, sparingly)

## Typography

**Font Families**:
- Primary: 'Inter' (clarity for legal text, excellent at all sizes)
- Headings: 'Inter' (600-700 weight for hierarchy)
- Arabic/Islamic Text: 'Amiri' or 'Scheherazade New' (for Quranic verses/Arabic terms)

**Type Scale**:
- H1: text-4xl font-semibold (page titles)
- H2: text-2xl font-semibold (section headers)
- H3: text-xl font-medium (subsections)
- Body: text-base (legal content, questions)
- Small: text-sm (helper text, disclaimers)
- Legal Fine Print: text-xs

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20
- Form fields: p-4, gap-6
- Section spacing: py-12 to py-20
- Container padding: px-6 md:px-8

**Container Strategy**:
- Max-width: max-w-4xl (optimal for form readability)
- Centered layout: mx-auto
- Responsive: Full-width mobile, constrained desktop

## Component Library

**Navigation**:
- Top navigation bar with logo, progress indicator, and save draft button
- Sticky header: h-16 with shadow-sm
- Progress stepper showing: Personal Info → Beneficiaries → Assets → Islamic Provisions → Review

**Core UI Elements**:

*Forms & Inputs*:
- Text inputs: Outlined style, h-12, rounded-lg, clear labels above
- Radio/checkbox: Material-style with generous touch targets (min-w-6 h-6)
- Select dropdowns: Custom styled with chevron icons
- Date pickers: Integrated calendar component
- Text areas: min-h-32 for longer responses

*Cards*:
- Elevated cards (shadow-md) for question groups
- Border cards (border-2) for beneficiary/asset entries
- Rounded corners: rounded-xl
- Padding: p-6

*Buttons*:
- Primary: Filled teal, h-12, rounded-lg, font-medium
- Secondary: Outlined with border-2
- Tertiary: Text-only for "Add another" actions
- Navigation: "Previous" (secondary), "Continue" (primary)

*Information Display*:
- Alert boxes for Islamic requirements (bg-blue-50 dark:bg-blue-950)
- Warning cards for legal considerations (border-l-4 border-amber-500)
- Success confirmations (bg-emerald-50 with icon)

**Data Displays**:
- Summary tables: Striped rows for beneficiary/asset lists
- Document preview: Card with shadow-lg, mimicking paper
- Collapsible sections: For optional Islamic provisions
- Timeline view: For multi-executor scenarios

**Overlays**:
- Modal dialogs: For confirmations, centered, max-w-lg
- Side drawers: For help content and Islamic guidance
- Tooltips: For legal term definitions (appearing on hover/tap)

## Unique Features

**Islamic Design Elements**:
- Subtle geometric patterns in header (opacity-5, using CSS)
- Bismillah (بسم الله الرحمن الرحيم) option at document top
- Crescent moon icon for Islamic provisions section
- Respectful use of gold accent only for Quranic quotes

**Multi-Step Form Experience**:
- Persistent side navigation showing all steps (desktop)
- Bottom progress bar (mobile)
- Auto-save indicators
- Field validation with clear error messages
- Conditional logic showing/hiding based on answers

**Document Generation**:
- Live preview panel (desktop side-by-side, mobile toggle)
- PDF download with professional legal formatting
- Print-optimized styles
- Digital signature area

## Animations

**Minimal, Purposeful Motion**:
- Smooth transitions between form steps (300ms ease)
- Field validation shake animation on error
- Progress indicator fill animation
- Success checkmark animation on completion
- NO decorative animations

## Images

**Strategic Image Use**:
- **Hero Section**: Professional image showing a diverse Muslim family reviewing documents together (warm, trustworthy atmosphere) - height: 60vh on landing, max-w-4xl
- **Section Headers**: Subtle background patterns with Islamic geometric art (very low opacity: 0.03)
- **Empty States**: Friendly illustrations for "No beneficiaries added yet"
- **Help Section**: Infographic explaining UK Islamic will requirements

**Image Placement**:
- Landing page hero with overlaid headline and CTA
- Inline educational images explaining Shariah compliance points
- Document preview thumbnail in review step

## Accessibility & Trust

- WCAG AAA contrast ratios for all text
- Clear focus indicators (ring-2 ring-offset-2)
- Keyboard navigation throughout
- Screen reader labels for all form fields
- Language toggle (English/Arabic) for Islamic terms
- Large tap targets (min 44x44px)
- Loading states with clear messaging
- Secure badges/trust indicators
- Privacy policy and data handling transparency

**Critical Success Factors**: Professional credibility, cultural respect, legal clarity, guided user experience, data security assurance.