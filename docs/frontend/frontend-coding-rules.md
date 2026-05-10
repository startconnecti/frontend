# Frontend Coding Rules: Startconnecti Client App

This document defines the strict coding standards and architectural rules for the Startconnecti Client Application. All AI Agents and developers must adhere to these rules without exception.

## 1. General Principles

- **Feature-First Architecture**: Group code by business domain (e.g., `bookings`, `auth`) rather than technical type.
- **Reusable First**: If a UI pattern appears twice, move it to `components/shared/` or `components/ui/`.
- **Mock-First Development**: All features must be fully functional with mock data before any API integration.
- **No Premature Integration**: Do not add real `fetch` or `axios` calls until the UX is validated.
- **Desktop-First Responsive**: Design for large screens first, then implement specific mobile behaviors (drawers, stacked cards).

## 2. File & Folder Rules

- **`app/`**: Contains ONLY layouts and "thin" pages. Use Route Groups `(public)`, `(auth)`, `(student)`, `(tutor)`.
- **`features/`**: The core of the app. Each folder is a module containing its own hooks, components, and services.
- **`components/ui/`**: Atomic Shadcn primitives. Do not add business logic here.
- **`components/shared/`**: UI components used across multiple features or roles.
- **`services/`**: Generic API clients. Feature-specific calls live in `features/[name]/services/`.
- **`mock-data/`**: Central store for all entity mock files.

## 3. Component Rules

- **Naming**: Use PascalCase (e.g., `TutorCard.tsx`).
- **Typing**: Every component must have a clearly defined `interface Props`. No `any`.
- **Folder Structure**: If a component has multiple sub-components, give it its own folder with an `index.ts`.
- **Logic**: Keep components focused on UI. Move complex data transformations to hooks.

## 4. Page Rules

- **Thin Pages**: `page.tsx` files should only compose feature components. They should not contain logic, styles, or direct data fetching.
- **No Direct Fetching**: Pages must use React Query hooks from the `features` module.
- **Layouts**: Use `layout.tsx` to handle role-based shell wrapping and metadata.

## 5. Service Layer Rules

- **Isolation**: Components and hooks never call `axios` or `fetch` directly. They call a service function.
- **Mock Services**: During the mock-first phase, service functions must return a `Promise` that resolves with mock data after a small delay.
- **Contract**: Mock service signatures must match the future real API (request params and response DTOs).

## 6. React Query Rules

- **Query Keys**: Use a central constant or a robust factory for query keys (e.g., `bookingKeys.list(filters)`).
- **Naming**: Queries start with `use...Query` (e.g., `useBookingsQuery`). Mutations start with `use...Mutation` (e.g., `useCreateBookingMutation`).
- **Invalidation**: Mutations must explicitly invalidate related query keys in their `onSuccess` callback.

## 7. Zustand Rules

- **Global Only**: Only use Zustand for state that truly needs to be shared across many disconnected components (e.g., `AuthStore`, `SidebarStore`).
- **No Persistence**: Do not persist data unless necessary (e.g., Auth tokens).
- **No Form State**: Never put form data in Zustand; use React Hook Form.

## 8. Form Rules

- **Stack**: React Hook Form + Zod.
- **Schemas**: Define Zod schemas in `features/[name]/types.ts`.
- **Validation**: Enable `onBlur` or `onChange` validation for better UX.
- **Error Handling**: Standardize server error display using the `components/ui/form.tsx` primitives.

## 9. TypeScript Rules

- **Strict Mode**: `noImplicitAny` must be respected.
- **Enums**: Use string-based Enums or Literal Types for statuses (e.g., `type PayoutStatus = 'pending' | 'paid'`).
- **DTOs**: Explicitly type request and response objects (e.g., `interface CreateBookingRequest`).

## 10. Styling Rules

- **Tailwind Only**: Use Tailwind classes for all styling. No CSS modules unless absolutely necessary.
- **Design Tokens**: Use standard variables (`primary`, `secondary`, `muted`, `oklch` colors) from `globals.css`.
- **No Magic Colors**: Never use a hex code that isn't a theme variable.
- **Spacing**: Use standard Tailwind spacing scale (`p-4`, `m-6`, etc.).

## 11. Responsive Rules

- **Sidebar**: Fixed on desktop, Radix `Sheet` (Drawer) on mobile.
- **Tables**: Full table on desktop, stacked card list on mobile.
- **Chat**: Split-screen on desktop, two-page navigation on mobile.
- **Calendars**: 7-day grid on desktop, 1-day list or compact view on mobile.

## 12. Mock Data Rules

- **Entity Files**: `mock-data/tutors.ts`, `mock-data/bookings.ts`, etc.
- **Simulation**: Implement a `getPaginatedData` utility to simulate limit/offset behavior.
- **Latent Feel**: Always wrap mock returns in a `setTimeout` (300-600ms) to ensure loading states are visible and tested.

## 13. Auth Rules

- **Access Level**:
    - `(student)/*`: Requires `user.role === 'student'`.
    - `(tutor)/*`: Requires `user.role === 'tutor'`.
- **Pending Tutors**: Tutors with `approvalStatus === 'pending'` must see a "Verification in Progress" overlay on their dashboard.
- **Blocked Users**: Automatically redirect to `/blocked` if `user.status === 'blocked'`.

## 14. AI Agent Safety Rules

- **No Regressions**: Never modify `app/admin` or `components/admin` unless explicitly tasked.
- **Atomic Commits**: Make changes in small, logical chunks (e.g., one component at a time).
- **No Rewrite**: Do not refactor existing architecture without an approved plan.
- **Dependency Guard**: Never run `npm install` for a new package without asking the user.

## 15. Commit Rules

Use the following conventional commit format:
- `feat(client): ...` for general client work.
- `feat(student): ...` for student-specific features.
- `feat(tutor): ...` for tutor-specific features.
- `feat(shared): ...` for reusable components.
- `fix(...)`: for bug fixes.
- `docs(...)`: for documentation changes.

## 16. Manual Testing Rules

Before declaring a feature "Done", verify:
1.  **Loading**: Does a skeleton or spinner show during data fetch?
2.  **Empty**: What happens when there is zero data? (Show `EmptyState`).
3.  **Error**: What happens if the service "fails"? (Show `ErrorState`).
4.  **Responsive**: Does it look good on 375px, 768px, and 1440px?
5.  **Interactive**: Do hover, focus, and active states feel premium?
