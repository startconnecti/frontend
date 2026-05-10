# Frontend Client Development Plan

This document outlines the strategic plan for developing the client-facing (Guest, Student, and Tutor) features of the Startconnecti platform, while maintaining the integrity of the existing Admin Portal.

## 1. Current FE Assessment

### What Already Exists
- **Admin Portal**: A highly mature administrative dashboard with over 25 routes and complete UI for managing platform resources.
- **Public Landing Page**: A high-fidelity home page with custom animations and branding.
- **UI Library**: A robust collection of 57 Shadcn UI primitives.
- **Mock Infrastructure**: A established pattern for using mock data and TypeScript types to simulate backend behavior.

### What Can Be Reused
- **Shadcn UI Components**: All components in `components/ui/` are fully reusable.
- **Design Tokens**: Design tokens and HSL/OKLCH color variables in `globals.css`.
- **Logic Patterns**: The patterns for pagination, status badges, and table actions established in the Admin portal.
- **Data Types**: The TypeScript interfaces in `lib/admin/types.ts` can serve as a base for client types.

### What Must Not Be Touched
- **`/app/admin/`**: Existing admin routes must remain functional and isolated.
- **`components/admin/`**: Do not modify these directly to avoid regressions in the Admin Portal.
- **Admin Mock Data**: `lib/admin/mock-data.ts` should remain untouched to ensure the Admin Portal continues to work during development.

### Current Risks
- **Shared Component Bloat**: Modifying generic UI components to fit client needs might inadvertently break admin layouts.
- **Namespace Collision**: Routes or components might clash if not properly isolated into groups.
- **State Leakage**: Mock data from different roles might get mixed if not properly namespaced.

## 2. Target Route Architecture

We will implement **Next.js Route Groups** to cleanly separate concerns and layout logic.

### Recommended Structure:
- `app/(public)/`: Publicly accessible pages (Landing, Discover, Tutor Profiles).
- `app/(auth)/`: Authentication pages (Login, Register).
- `app/(student)/`: Student-specific dashboard and management.
- `app/(tutor)/`: Tutor-specific dashboard and management.
- `app/admin/`: Existing administrative portal (kept separate).

**Decision**: The existing `app/page.tsx` should be moved to `app/(public)/page.tsx` to align with the new group structure and allow for a dedicated `(public)` layout.

## 3. Target Component Architecture

To prevent regressions, we will implement a tiered component structure:

- `components/ui/`: Standard Shadcn primitives (Shared by everyone).
- `components/shared/`: New folder for cross-client components (e.g., `StatusBadge`, `EmptyState`).
- `components/client/`: New folder for student/tutor specific logic.
- `components/admin/`: Existing admin components (Protected).

**Guideline**: Admin components like `AdminStatusBadge` or `AdminSidebar` should be **copied and refactored** into `components/shared/` or `components/client/` rather than directly reused, as their logic and icons will quickly diverge from administrative needs.

## 4. Client Route List

### Public / Guest
- `/`: Landing Page (Existing, to be moved to `(public)`).
- `/discover`: Tutor search and filters.
- `/tutor/[id]`: Public tutor profile page.
- `/how-it-works`: Detailed platform guide.

### Auth
- `/login`: Unified login for Students and Tutors.
- `/register`: Multi-role registration flow.
- `/forgot-password`: Password recovery.

### Student Client
- `/student`: Dashboard overview.
- `/student/bookings`: Manage active and past sessions.
- `/student/messages`: Chat list with tutors.
- `/student/profile`: Account and preference settings.

### Tutor Client
- `/tutor`: Dashboard and earnings summary.
- `/tutor/bookings`: Student request management.
- `/tutor/schedule`: Availability calendar.
- `/tutor/payouts`: Withdrawal history and requests.
- `/tutor/profile/edit`: Professional profile management.

### Shared & System
- `/messages/[id]`: Chat interface.
- `/sessions/[id]`: Session/Classroom detail.
- `/404`: Custom Not Found page.
- `/500`: Custom Error page.

## 5. Client Mock Data Strategy

We will maintain strict isolation for client-side data:
- **Location**: Create `lib/client/mock-data.ts` and `lib/client/types.ts`.
- **Reasoning**: This allows the client app to have its own data lifecycle and specific fields (like "Student Favorites" or "Tutor Availability") without polluting the Admin models.
- **Sync**: Types can extend the base `User` or `Tutor` types from the admin lib if necessary, but data arrays must be separate.

## 6. Implementation Phases

### Phase 0: Documentation & Structure
- **Goal**: Establish the filesystem foundation.
- **Changes**: Create `app/(public)`, `(auth)`, `(student)`, `(tutor)` folders. Move existing landing page.
- **Manual Test**: Verify the landing page still loads at `/`.

### Phase 1: Route Groups & Layouts
- **Goal**: Create the shell for each role.
- **Changes**: Implement `layout.tsx` for each group. Create placeholder sidebars for student/tutor.
- **Manual Test**: Navigate to `/student` and verify the student-specific sidebar appears.

### Phase 2: Shared Client Components
- **Goal**: Build the core UI kit for clients.
- **Changes**: Create `components/shared/client-status-badge.tsx`, `empty-state.tsx`, and `loading-state.tsx`.
- **Manual Test**: Preview components in a temporary "Kitchen Sink" page.

### Phase 3: Public Marketplace Pages
- **Goal**: Build the "Tutor Discovery" experience.
- **Changes**: Implement `/discover` with filters and the public `/tutor/[id]` profile.
- **Manual Test**: Search for a tutor and view their profile.

### Phase 4: Auth UI
- **Goal**: Complete the sign-in/up experience.
- **Changes**: Implement `/login` and `/register` forms with Zod validation.
- **Manual Test**: Verify form validation and mock redirect to dashboards.

### Phase 5: Student Pages
- **Goal**: Build the Student experience.
- **Changes**: Dashboard, Bookings list, and Profile settings.
- **Manual Test**: View "My Bookings" and see mock student data.

### Phase 6: Tutor Pages
- **Goal**: Build the Tutor experience.
- **Changes**: Earnings dashboard, Booking requests, and Schedule management.
- **Manual Test**: Accept a mock booking request and see balance updates.

### Phase 7: Shared Logged-in Pages
- **Goal**: Implement communication and session details.
- **Changes**: `/messages/[id]` and `/sessions/[id]`.
- **Manual Test**: Open a chat and verify mock message history.

### Phase 8: Responsive Polish
- **Goal**: Ensure mobile excellence.
- **Changes**: Mobile-specific navigation, responsive table stacking.
- **Manual Test**: Test all primary flows on mobile viewport sizes.

### Phase 9: API Integration Preparation
- **Goal**: Prepare for real data.
- **Changes**: Create `lib/api/` folder. Define base Axios/Fetch instance.
- **Expected Output**: Codebase ready for "Phase 10: Backend Integration".

## 7. Risk Controls for AI Agent

To ensure project stability, the following rules are **STRICT**:

1.  **Isolation**: Never modify files inside `app/admin/` or `components/admin/` unless the task is explicitly about the admin portal.
2.  **No Deletion**: Do not delete existing admin components or mock data files.
3.  **No Persistence**: Do not introduce database calls or `localStorage` persistence yet. Stay purely on mock data.
4.  **Middleware Restraint**: Do not add global auth middleware that might block existing admin routes.
5.  **Clean Styles**: Use existing design tokens from `globals.css`. Do not introduce ad-hoc HEX colors in components.
6.  **TypeScript**: All new components and mock data must have proper TypeScript types. No `any` allowed.
7.  **Atomic Edits**: Focus on one phase at a time. Do not jump to Tutor pages while building Student layouts.
