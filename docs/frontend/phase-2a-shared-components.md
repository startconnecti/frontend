# Phase 2A: Shared Client Components

This phase introduces a robust set of reusable UI components tailored for the Connecti client application.

## 1. Domain UI Components

### ClientStatusBadge
A centralized component for displaying various platform statuses with consistent semantic colors.
- **Category Support**: Users, Tutor Approval, Bookings, Sessions, Payments, Disputes, Refunds, Payouts.
- **Visual Mapping**: Uses custom success/warning shades paired with standard Shadcn variants.

### TutorCard
Designed for public marketplace and search results.
- **Key Features**: Rating display, expertise badges, hourly rate, and quick actions.

### BookingCard
Used in student/tutor dashboard lists to manage scheduled mentorships.
- **Key Features**: Status badge, tutor/student avatar, date/time summary, and contextual actions.

### SessionCard
A high-priority card for the upcoming sessions section.
- **Key Features**: Timeline-based layout, "Join" button, and participant summary.

### PaymentCard
Simplified list item for transaction history.
- **Key Features**: Transaction type indicator (Inbound/Outbound) and price display.

## 2. Helper & Layout Components

- **FormSection**: Standardized grouping for settings and profile forms.
- **InfoRow**: A clean key-value pair display for detail pages.
- **PriceDisplay**: Centralized currency formatting with multiple size variants.
- **ListState**: A high-level wrapper to manage Loading, Error, Empty, and Data states automatically.

## 3. Usage Guidance

- **Props Only**: These components are intentionally stateless regarding data fetching. Always pass data and action handlers via props.
- **Atomic Design**: These components rely heavily on `components/ui/` primitives (Cards, Buttons, Badges).
- **No Side Effects**: Do not add API calls or global store modifications inside these components.
- **Responsive**: All cards use flexible layouts (flex/grid) to ensure they work on both desktop and mobile viewports.
