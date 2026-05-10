# Frontend Client Architecture Specification

This document defines the technical architecture for the Startconnecti Client Application (Guest, Student, and Tutor roles).

## 1. Final Recommended Folder Architecture

We will adopt a **Feature-Based Architecture** to ensure scalability and isolation of business logic.

```text
frontend/
├── app/                        # Next.js App Router
│   ├── (public)/               # Guest pages (Landing, Discover, Profiles)
│   ├── (auth)/                 # Login, Register, Recovery
│   ├── (student)/              # Student Dashboard & Management
│   ├── (tutor)/                # Tutor Dashboard & Management
│   └── admin/                  # Existing Admin Portal (Isolated)
├── components/                 # Reusable UI Components
│   ├── ui/                     # Shadcn Primitives (Atomic)
│   ├── shared/                 # Cross-role components (Badges, Empty States)
│   ├── client/                 # Common client-side UI (Tutor Cards, etc.)
│   └── admin/                  # Existing Admin components
├── features/                   # Domain-driven feature modules
│   ├── auth/                   # Login/Register logic
│   ├── bookings/               # Booking flow & management
│   ├── tutors/                 # Discovery & Profile details
│   ├── sessions/               # Virtual classroom & scheduling
│   └── ...                     # Other modules (Payments, Messages)
├── hooks/                      # Global reusable hooks
├── services/                   # API service layer (Axios/Fetch instances)
├── stores/                     # Global state (Zustand)
├── providers/                  # React Context providers (Query, Auth, Theme)
├── types/                      # Global TypeScript definitions
├── constants/                  # Config, Enums, Magic strings
├── lib/                        # Utility functions
└── mock-data/                  # Mock data for local development
```

## 2. Feature Module Architecture

Each feature module in `features/` should follow this structure:
- `components/`: UI components exclusive to this feature.
- `hooks/`: Feature-specific React Query hooks (`useBookings`, `useCreateBooking`).
- `services/`: API call definitions for this feature.
- `types/`: Domain-specific TypeScript interfaces.
- `mock/`: Feature-specific mock data.
- `index.ts`: Public API for the module.

### Route Ownership
- **Auth**: Owns `(auth)` group.
- **Tutors**: Owns `(public)/discover` and `(public)/tutor/[id]`.
- **Bookings/Payments**: Owns `(student)/bookings` and `(tutor)/bookings`.

## 3. State Management Strategy

### Recommended Stack:
1.  **TanStack Query (React Query)**: For **Server State**. Handles caching, synchronization, and data fetching for all API resources.
2.  **Zustand**: For **Global UI State**. Manages auth sessions, sidebar toggles, and multi-step form progress.
3.  **React Hook Form + Zod**: For **Form State**. Manages local input validation and submission logic.
4.  **Native `useState`**: For **Local UI State**. Manages ephemeral toggles, tabs, and open/close states within a single component.

## 4. API Layer Architecture

### Implementation:
- **Client**: `Axios` instance with a base URL and interceptors.
- **Interceptors**:
    - **Request**: Automatically injects `Authorization: Bearer <token>` from the Auth Store.
    - **Response**: Handles `401 Unauthorized` by triggering the logout flow and `403 Forbidden` for role-mismatch errors.
- **Hook Pattern**:
    - **Queries**: `useQuery` hooks wrapped in feature-specific hooks.
    - **Mutations**: `useMutation` with `onSuccess` cache invalidation to keep the UI in sync.

## 5. Auth Architecture

### Implementation:
- **AuthProvider**: Wraps the app to manage initial session hydration.
- **AuthStore (Zustand)**: Persists the `User` object and `accessToken` in `localStorage` (via middleware).
- **Route Protection**:
    - **(student)**: Redirects to `/login` if `user.role !== 'student'`.
    - **(tutor)**: Redirects to `/login` if `user.role !== 'tutor'`.
- **Tutor Approval Handling**:
    - If `user.role === 'tutor'` and `approvalStatus === 'pending'`, limit access to a "Pending Verification" view.
    - Blocked users (`status === 'blocked'`) are redirected to a "Suspended" page.

## 6. Layout Architecture

### Responsive Layouts:
- **PublicLayout**: Max-width container (`6xl`), sticky `Navbar`, and `Footer`.
- **AuthLayout**: Centered card layout with branding.
- **DashboardLayout (Student/Tutor)**:
    - **Sidebar**: Persistent left-side navigation.
    - **Mobile**: Sidebar becomes a bottom drawer or a full-screen overlay (Radix `Sheet`).
    - **Header**: Contains role-specific stats (e.g., "Next Session" for students, "Wallet Balance" for tutors).

## 7. Mobile-First Responsive Strategy

- **Breakpoints**: 
    - `sm`: 640px (Mobile)
    - `md`: 768px (Tablet)
    - `lg`: 1024px (Desktop)
- **Tables**: Use `Table` components on desktop; switch to `Card` lists on mobile.
- **Calendar**: Full grid on desktop; day-list view on mobile.
- **Chat**: List/Detail view on desktop; separate full-screen views on mobile.

## 8. Shared UI Strategy

### Core Reusable Components:
- **StatusBadges**: Centrally defined in `components/shared/status-badge.tsx`.
- **EmptyStates**: Illustration + Message + CTA pattern.
- **LoadingStates**: Skeletons that match the target component's structure.
- **Modals/Drawers**: Use `Dialog` for desktop and `Drawer` (Vaul) for mobile for better UX.

## 9. Mock Data Architecture

- **Location**: `mock-data/` directory.
- **Organization**: One file per entity (e.g., `mock-data/tutors.ts`).
- **Simulations**:
    - **Pagination**: Use `.slice()` on mock arrays based on `page` and `limit` query params.
    - **Latency**: Use a helper function `delay(500)` in services to simulate real-world API feel.

## 10. Development Rules for AI Agent

1.  **Strict Isolation**: Never edit `app/admin` or `components/admin`.
2.  **No `any`**: All data must have a TypeScript interface.
3.  **Component Dryness**: If a component is used in more than two features, move it to `components/shared`.
4.  **Atomic Edits**: Implement the feature folder structure before writing page code.
5.  **No Hardcoding**: API URLs must come from `process.env`. Colors must use Tailwind variables.

## 11. Recommended Dependencies

- `@tanstack/react-query`: For server state management.
- `zustand`: For lightweight global store.
- `axios`: For robust HTTP requests.
- `date-fns`: For modern date manipulation (already in project).
- `react-day-picker`: For availability calendars (already in project).
- `vaul`: For high-quality mobile drawers.

## 12. Final Implementation Roadmap

### Phase A: Core Infrastructure (Highest Priority)
- Route groups, global layouts, and Auth/Query providers.
- **Mock**: User session and basic dashboard stats.

### Phase B: Discovery & Marketplace
- Tutor search (`/discover`) and public profile pages.
- **Mock**: Tutor list and detailed bio data.

### Phase C: Onboarding & Profile
- Registration flow and profile editing.
- **Mock**: File upload simulation for certificates.

### Phase D: Booking & Payments
- Checkout flow and booking management.
- **Mock**: Payment status transitions (Pending -> Success).

### Phase E: Real-time & Operations
- Messaging and Session management.
- **Mock**: Message history and session countdowns.

### Phase F: Final Polish
- Error boundaries, custom 404s, and mobile optimization.

---
**Note**: API integration should be delayed until the full UX flow is validated with mock data.
