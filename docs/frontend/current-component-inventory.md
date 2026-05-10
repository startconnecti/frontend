# Current Frontend Component Inventory

This document provides a detailed inventory of all UI components in the Connecti Frontend project as of May 10, 2026.

## 1. Admin Portal Components

These components are specifically designed for the administrative dashboard but many serve as excellent blueprints for client-side dashboards.

| Component | File Path | Purpose | Reusable for Client? | How to Reuse |
| :--- | :--- | :--- | :--- | :--- |
| **AdminShell** | `components/admin/admin-shell.tsx` | Main layout shell for admin portal | **Yes** | Use as a template for `StudentDashboardLayout` or `TutorDashboardLayout`. |
| **AdminSidebar** | `components/admin/admin-sidebar.tsx` | Vertical navigation sidebar | **Yes** | Adapt the `navigationItems` array for Student/Tutor specific links. |
| **AdminHeader** | `components/admin/admin-header.tsx` | Top bar with search and profile | **Yes** | Reuse the search and user dropdown logic for client headers. |
| **AdminPageHeader**| `components/admin/admin-page-header.tsx`| Page title, description, and primary action | **Yes** | Perfect for dashboard sub-pages (e.g., "My Bookings"). |
| **AdminStatusBadge**| `components/admin/admin-status-badge.tsx`| Colored badges for various statuses | **Yes** | Add Student/Tutor specific statuses to the `statusStyles` map. |
| **AdminPagination** | `components/admin/admin-pagination.tsx`| Table pagination controls | **Yes** | Fully reusable for any paginated list in the client app. |
| **AdminTableActions**| `components/admin/admin-table-actions.tsx`| Row-level dropdown actions (View/Edit/Delete) | **Yes** | Adapt the links for student/tutor management views. |
| **AdminConfirmDialog**| `components/admin/admin-confirm-dialog.tsx`| Confirmation modal wrapper | **Yes** | Generic enough to be used for any "Are you sure?" action. |
| **AdminStatCard** | `components/admin/admin-stat-card.tsx` | Visual metric cards for dashboard | **Yes** | Use for "Total Earnings" or "Hours Mentored" on tutor dashboard. |
| **AdminRowActions** | `components/admin/admin-row-actions.tsx` | Inline row actions | **Yes** | Use for quick actions on booking/session lists. |
| **AdminBulkActions** | `components/admin/admin-bulk-actions.tsx` | Action bar for selected table rows | **Partial**| Useful if students/tutors need to bulk-archive messages or notifications. |

## 2. Public / Client Components

These components are used on the main landing page and public-facing sections.

| Component | File Path | Purpose | Type |
| :--- | :--- | :--- | :--- |
| **Navbar** | `components/navbar.tsx` | Main public navigation bar | Public Client |
| **Footer** | `components/footer.tsx` | Standard multi-column footer | Public Client |
| **Hero** | `components/hero.tsx` | Large headline section with count-up stats | Public Client |
| **MentorCard** | `components/mentor-card.tsx` | Public preview of a mentor profile | Public Client |
| **MentorSection** | `components/mentor-section.tsx` | Grid of mentor cards | Public Client |
| **HowItWorks** | `components/how-it-works.tsx` | Step-by-step guide section | Public Client |
| **DiscoverSection** | `components/discover-section.tsx`| Featured categories/tutors | Public Client |
| **Testimonials** | `components/testimonials.tsx` | Customer success stories | Public Client |
| **FinalCTA** | `components/final-cta.tsx` | Bottom call-to-action section | Public Client |
| **ThemeProvider** | `components/theme-provider.tsx`| Next-themes wrapper for dark mode | Generic UI |

## 3. Shadcn UI (Generic) Components

These are low-level primitive components located in `components/ui/`. They are the building blocks for all other components.

- **Layout**: `Sidebar`, `Separator`, `ScrollArea`, `Resizable`, `AspectRatio`.
- **Forms**: `Button`, `Input`, `Select`, `Checkbox`, `Textarea`, `Switch`, `Slider`, `RadioGroup`, `Label`, `Form`.
- **Feedback**: `Alert`, `AlertDialog`, `Dialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `Progress`, `Skeleton`, `Spinner`, `Toast`, `Toaster`, `Sonner`.
- **Data Display**: `Table`, `Card`, `Badge`, `Avatar`, `Accordion`, `Carousel`, `Chart`, `Empty`.
- **Navigation**: `Breadcrumb`, `NavigationMenu`, `Tabs`, `Menubar`, `DropdownMenu`, `Pagination`, `Command`.

## 4. Reusability Analysis

### Why Admin Components are Highly Reusable:
1.  **Standardized Props**: Most admin components use simple, well-defined interfaces (`title`, `description`, `onClick`).
2.  **Context Agnostic**: While named "Admin", the logic for `AdminPagination` or `AdminConfirmDialog` is not tied to the admin role.
3.  **Styling Consistency**: They all use the same Tailwind design tokens and Shadcn primitives, ensuring they will look correct in a Student/Tutor context.

### Adaptation Strategy:
- **Renaming**: For the future client app, we should create a `client/` subdirectory in `components/` and copy/refactor `AdminStatusBadge` into `ClientStatusBadge` to handle client-specific states.
- **Icon Swapping**: Replace admin-heavy icons with more user-friendly ones in the sidebars.

---

## Recommended Reusable Client Components

We should create these new components for the client app by leveraging existing patterns:

### Layouts & Navigation
- **PublicLayout**: A wrapper for all non-logged-in pages (includes `Navbar` and `Footer`).
- **StudentDashboardLayout**: Derived from `AdminShell`, but with student-specific navigation.
- **TutorDashboardLayout**: Derived from `AdminShell`, with tutor-specific navigation and an "Earnings" metric in the header.
- **ClientHeader**: A simplified version of `AdminHeader` focusing on session count and profile.

### Cards & Display
- **TutorCard**: An enhanced version of `MentorCard` for the search/discovery results.
- **BookingCard**: A list-view card showing upcoming session time, tutor name, and status.
- **SessionCard**: A detailed card for a single lesson with "Join Link" and "View Recording" buttons.
- **PaymentCard**: A small card for the payment history list.

### Feedback & State
- **ClientStatusBadge**: Adapted from `AdminStatusBadge` to handle `booked`, `completed`, `paid`, `refunded` from a student's perspective.
- **EmptyState**: A generic wrapper using `components/ui/empty.tsx` to show when no bookings or messages exist.
- **LoadingState**: Full-page and section-level skeletons using `components/ui/skeleton.tsx`.
- **ErrorState**: A friendly error boundary component for failed API calls.
