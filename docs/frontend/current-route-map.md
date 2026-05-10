# Current Frontend Route Map

This document lists all active and placeholder routes in the Connecti Frontend project as of May 10, 2026.

## 1. Public Routes

| Route Path | File Path | Purpose | Role/Access | Category | Status | Main Components | Mock Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Main landing page | Guest/All | Public Client | Complete UI | `Navbar`, `Hero`, `DiscoverSection`, `Footer` | None |

## 2. Auth Routes

| Route Path | File Path | Purpose | Role/Access | Category | Status | Main Components | Mock Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | `app/admin/login/page.tsx` | Admin login portal | Guest/Admin | Auth | Complete UI | `Card`, `Input`, `Button` | None |

## 3. Admin Portal Routes

All admin routes share the `AdminShell` layout with a persistent sidebar and header.

### Core Management
| Route Path | File Path | Purpose | Role/Access | Status | Main Components | Mock Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin` | `app/admin/page.tsx` | Dashboard Overview | Admin | Complete UI | `AdminStatCard`, `RecentActivity` | `mockStats` |
| `/admin/users` | `app/admin/users/page.tsx` | User Management | Admin | Complete UI | `Table`, `AdminStatusBadge`, `AdminPagination` | `mockUsers` |
| `/admin/users/[id]` | `app/admin/users/[id]/page.tsx` | User Profile View | Admin | Partial UI | `Card`, `UserDetails` | `getUserById` |
| `/admin/tutors` | `app/admin/tutors/page.tsx` | Tutor Approval List | Admin | Complete UI | `Table`, `AdminStatusBadge` | `mockTutors` |
| `/admin/tutors/[id]` | `app/admin/tutors/[id]/page.tsx` | Tutor Profile Detail | Admin | Complete UI | `Card`, `AdminConfirmDialog` | `getTutorById` |
| `/admin/tutors/create` | `app/admin/tutors/create/page.tsx` | Manual Tutor Creation | Admin | Placeholder | `Form` | None |
| `/admin/tutors/[id]/edit`| `app/admin/tutors/[id]/edit/page.tsx`| Edit Tutor Profile | Admin | Placeholder | `Form` | `getTutorById` |

### Operations & Finance
| Route Path | File Path | Purpose | Role/Access | Status | Main Components | Mock Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/bookings` | `app/admin/bookings/page.tsx` | Booking History | Admin | Complete UI | `Table`, `AdminStatusBadge` | `mockBookings` |
| `/admin/payments` | `app/admin/payments/page.tsx` | Transaction History | Admin | Complete UI | `Table`, `AdminStatusBadge` | `mockPayments` |
| `/admin/payouts` | `app/admin/payouts/page.tsx` | Payout Requests | Admin | Complete UI | `Table`, `AdminConfirmDialog` | `mockPayouts` |
| `/admin/refunds` | `app/admin/refunds/page.tsx` | Refund Management | Admin | Complete UI | `Table`, `AdminStatusBadge` | `mockRefunds` |
| `/admin/disputes` | `app/admin/disputes/page.tsx` | Dispute Resolution | Admin | Complete UI | `Table`, `PriorityBadge` | `mockDisputes` |

### Communication & System
| Route Path | File Path | Purpose | Role/Access | Status | Main Components | Mock Data |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/conversations` | `app/admin/conversations/page.tsx`| Message Monitoring | Admin | Complete UI | `Table`, `ChatList` | `mockConversations` |
| `/admin/audit-logs` | `app/admin/audit-logs/page.tsx`| Action Tracking | Admin | Complete UI | `Table`, `ActionBadge` | `mockAuditLogs` |
| `/admin/notifications` | `app/admin/notifications/page.tsx`| System Broadcasts | Admin | Complete UI | `Table`, `NotificationBadge`| `mockNotifications`|
| `/admin/system-settings`| `app/admin/system-settings/page.tsx`| Platform Config | Admin | Partial UI | `Tabs`, `Form` | `mockSystemSettings`|
| `/admin/subjects` | `app/admin/subjects/page.tsx`| Subject Taxonomy | Admin | Complete UI | `Table`, `Badge` | `mockSubjects` |
| `/admin/admins` | `app/admin/admins/page.tsx` | Admin User List | Admin | Complete UI | `Table`, `Badge` | `mockAdmins` |
| `/admin/roles` | `app/admin/roles/page.tsx` | RBAC Management | Admin | Complete UI | `Table`, `PermissionGrid` | `mockRoles` |

## 4. Implementation Status Summary

- **Complete UI (Mocked)**: ~80% of routes. They have a full UI but rely entirely on local state and mock data.
- **Partial UI**: Routes like `/admin/system-settings` have the layout but some settings sections are empty or non-functional.
- **Placeholder**: Routes like `tutors/create` or `edit` usually lead to simple form shells without validation or submission logic.
- **Mock Data Dependency**: Every management route currently imports from `@/lib/admin/mock-data`.

## 5. Future Changes for Client App

- **API Integration**: All `use client` pages must replace `mockUsers` imports with TanStack Query (or similar) hooks calling the real backend.
- **Auth Guard**: Implement middleware to protect `/admin` and `/dashboard` routes.
- **Route Groups**: Move client-facing routes into `(public)`, `(student)`, and `(tutor)` route groups for cleaner layout management.
- **Dynamic Routing**: Ensure detail pages correctly fetch data based on `params.id` from the API.

---

## Recommended Client Route Additions

The current app is heavily skewed towards Admin. The following routes are needed for a complete Student/Tutor experience:

### Guest / Auth
- `/login`: Unified login for Students and Tutors.
- `/register`: Multi-step registration (select Student or Tutor).
- `/forgot-password`: Password recovery flow.
- `/discover`: Advanced tutor search with filters.
- `/tutor/[slug]`: Public tutor profile page.

### Student Client (`/student/` or `(student)` group)
- `/student/dashboard`: Overview of upcoming sessions and progress.
- `/student/bookings`: Manage active and past bookings.
- `/student/messages`: Chat with tutors.
- `/student/profile`: Edit preferences, subjects of interest.
- `/student/payments`: Manage saved cards and billing history.

### Tutor Client (`/tutor/` or `(tutor)` group)
- `/tutor/dashboard`: Earnings overview and upcoming schedule.
- `/tutor/profile/edit`: Manage bio, subjects, and hourly rate.
- `/tutor/schedule`: Set weekly availability and manage time slots.
- `/tutor/bookings`: Accept/reject student requests.
- `/tutor/payouts`: View balance and request withdrawals.
- `/tutor/verification`: Upload ID and certificates (leads to Admin approval).

### Shared Logged-in Pages
- `/messages/[id]`: The actual real-time chat interface.
- `/sessions/[id]`: The virtual classroom / session details page.
- `/settings`: Security, password change, and notification preferences.
