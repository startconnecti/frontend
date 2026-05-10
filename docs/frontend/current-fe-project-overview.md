# Current Frontend Project Overview

This document provides a comprehensive overview of the current state of the Connecti Frontend project. It is intended to help developers (and AI assistants) understand the architecture, tech stack, and progress before continuing development of the client-facing application.

## 1. Tech Stack
- **Framework**: [Next.js 16.2.4](https://nextjs.org/) (App Router)
- **Package Manager**: NPM (uses `package-lock.json`)
- **UI Library**: [Radix UI](https://www.radix-ui.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Styling Solution**: [Tailwind CSS v4.2.0](https://tailwindcss.com/) (using `@theme inline` and `oklch` colors)
- **Form Library**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **State Management**: Native React State (`useState`, `useContext`)
- **Data Fetching Approach**: Native `fetch` (Note: Real API integration is not yet implemented)
- **Auth Handling**: Mocked (Client-side redirect in `/admin/login`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Library**: [date-fns 4.1.0](https://date-fns.org/)

## 2. Project Structure
```text
frontend/
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── admin/            # Admin Portal Routes (Users, Tutors, Payouts, etc.)
│   ├── globals.css       # Global Styles & Tailwind Config
│   ├── layout.tsx        # Root Layout (Fonts, Context Providers)
│   └── page.tsx          # Public Landing Page
├── components/           # UI Components
│   ├── admin/            # Admin-specific UI (Shell, Sidebar, Table Actions)
│   ├── ui/               # Shadcn UI (Radix Primitives)
│   └── ...               # Public Section Components (Hero, Navbar, etc.)
├── hooks/                # Custom React Hooks
├── lib/                  # Shared Logic & Mock Data
│   ├── admin/            # Admin Mock Data, Types, and Utils
│   └── utils.ts          # Tailwind Class Merger
├── public/               # Static Assets (Logos, Favicons)
└── styles/               # CSS Modules and global styles
```

### Important Folders
- `app/admin/`: Contains all administrative modules. Each subfolder typically represents a resource (e.g., `users`, `payouts`).
- `components/ui/`: Standardized Radix/Shadcn components used across the whole app.
- `lib/admin/mock-data.ts`: Central repository for all mock data used to simulate backend responses.

## 3. Existing Routes / Pages

| Route Path | Page Name | Role/Access | Purpose | Status | Related Files |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Landing Page | Public | Platform landing page | Partial | `app/page.tsx` |
| `/admin/login` | Admin Login | Admin | Sign in to admin portal | Done (Mock) | `app/admin/login/page.tsx` |
| `/admin` | Dashboard | Admin | Overview of platform stats | Done (Mock) | `app/admin/page.tsx` |
| `/admin/users` | Users | Admin | Manage platform users | Done (Mock) | `app/admin/users/page.tsx` |
| `/admin/tutors` | Tutors | Admin | Approve/Reject tutor profiles | Done (Mock) | `app/admin/tutors/page.tsx` |
| `/admin/payouts` | Payouts | Admin | Process payout requests | Done (Mock) | `app/admin/payouts/page.tsx` |
| `/admin/bookings` | Bookings | Admin | Monitor class bookings | Done (Mock) | `app/admin/bookings/page.tsx` |
| `/admin/payments` | Payments | Admin | Transaction history | Done (Mock) | `app/admin/payments/page.tsx` |
| `/admin/audit-logs`| Audit Logs | Admin | System action tracking | Done (Mock) | `app/admin/audit-logs/page.tsx` |
| `/admin/system-settings`| Settings | Admin | Global platform config | Partial | `app/admin/system-settings/page.tsx`|

## 4. Layout Structure
- **Public Layout**: Defined in `app/layout.tsx`. Uses Geist fonts and sets the base background. The landing page adds a `Navbar` and `Footer`.
- **Admin Layout**: Wrapped in `AdminShell` (`components/admin/admin-shell.tsx`).
    - **Sidebar**: Fixed on large screens, collapsible/hidden on mobile. Contains navigation for all admin modules.
    - **Header**: Top bar with search, notifications, and user profile.
- **Mobile Behavior**: The `AdminSidebar` is responsive, and tables/forms are designed to scale, though some complex tables may require horizontal scrolling.

## 5. Reusable Components

| Component | File Path |
| :--- | :--- |
| **Buttons** | `components/ui/button.tsx` |
| **Forms** | `components/ui/form.tsx`, `components/ui/input.tsx` |
| **Tables** | `components/ui/table.tsx` |
| **Modals** | `components/ui/dialog.tsx`, `components/admin/admin-confirm-dialog.tsx` |
| **Cards** | `components/ui/card.tsx`, `components/admin/admin-stat-card.tsx` |
| **Status Badges**| `components/admin/admin-status-badge.tsx`, `components/ui/badge.tsx` |
| **Pagination** | `components/admin/admin-pagination.tsx` |
| **Sidebar** | `components/admin/admin-sidebar.tsx` |
| **Empty States** | `components/ui/empty.tsx`, `components/admin/admin-record-not-found.tsx` |
| **Loading** | `components/ui/spinner.tsx`, `components/ui/skeleton.tsx` |

## 6. Mock Data
- **Storage**: All mock data is stored in `lib/admin/mock-data.ts`.
- **Usage**: All current admin pages import mock data directly (e.g., `import { mockUsers } from '@/lib/admin/mock-data'`).
- **Data Shapes**: Defined in `lib/admin/types.ts`. Key interfaces include `User`, `Tutor`, `Booking`, `Payment`, `Payout`, and `AuditLog`.

## 7. Auth Current Status
- **Login**: Implemented as a mock page. Any email/password combination will redirect to `/admin`.
- **Register**: Not yet implemented for clients or admins.
- **Token Storage**: None.
- **Route Protection**: None. All admin routes are currently accessible via direct URL.
- **Role Handling**: Data models support roles (`student`, `tutor`, `admin`), but the UI does not yet enforce permissions.
- **Logout**: Redirects back to `/admin/login`.

## 8. API Integration Status
- **Real Integration**: **No**.
- **Approach**: Currently using local React state and mock data filters.
- **API Client**: Not yet created.
- **Environment Variables**: `NEXT_PUBLIC_API_URL` is not yet configured.

## 9. Admin Current Status
- **Modules**: Almost all core admin modules are built with UI and mock data integration.
- **Shell**: Stable dashboard shell with sidebar navigation.
- **Reusable Parts**: The entire `components/admin/` folder and `components/ui/` can be reused or adapted for the Client/Tutor dashboards.
- **Known Admin Issues**: Deletions and status changes are only reflected in the current page session (they don't persist after refresh).

## 10. Known Issues / Missing Parts
- **Persistence**: No database connection; all actions are temporary.
- **Search/Filters**: Some filters in the UI are placeholders and don't affect the data.
- **Detail Pages**: Many "View Details" links lead to `[id]` pages that are still basic or missing data.
- **Security**: No middleware to protect private routes.
- **Types**: Some minor `any` types remain in complex table components.
- **Responsive**: Payout and Payment tables are very wide and have layout issues on small devices.

## 11. Design Style Summary
- **Color Palette**: Modern and warm. Uses `oklch` colors with a primary brown/earth tone (`#8B3D2B`).
- **Typography**: Geist Sans (Body) and Geist Mono (Technical/Data).
- **Spacing**: Consistent use of Tailwind spacing classes. Card radius is `0.625rem`.
- **Dashboard Style**: Clean, modular cards, high-contrast typography, and subtle border dividers.
