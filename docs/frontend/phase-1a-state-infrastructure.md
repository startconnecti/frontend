# Phase 1A: State Infrastructure Hydration

This phase initializes the global state management and data fetching infrastructure for the client application.

## 1. Dependencies Added
- `@tanstack/react-query`: Server state management, caching, and data fetching.
- `@tanstack/react-query-devtools`: Developer tools for inspecting the query cache.
- `zustand`: Lightweight client-side global state management.

## 2. Provider Behavior
### QueryProvider
- **QueryClient**: Initialized with a default configuration.
- **Stale Time**: Set to 30 seconds to minimize redundant fetches.
- **Retry**: Set to 1 to handle transient network issues without excessive spamming.
- **Window Focus**: Disabled `refetchOnWindowFocus` to prevent unexpected UI jumps during development.
- **DevTools**: Enabled and visible only in development mode.

### AuthProvider
- **Hydration**: Uses an `useEffect` hook to mark the auth store as hydrated once the component mounts on the client.
- **Context**: Provides a lightweight wrapper for future-proofing, though most logic resides in the Zustand store.

## 3. Store Behavior
### AuthStore (Zustand)
- **State**: Tracks `user`, `accessToken`, `isAuthenticated`, and `isHydrated`.
- **Mock Actions**: `loginMock` allows for simulating successful authentication without a real backend.
- **Isolation**: Completely separate from the Admin Portal's mock data logic.

### UIStore (Zustand)
- **Mobile Navigation**: Manages the state of the mobile drawer/sidebar.
- **Actions**: Simple toggles and explicit open/close functions.

## 4. Intentionally Not Implemented
- **Persistence**: `localStorage` persistence is omitted for now to keep development cycles clean and predictable.
- **API Integration**: No real network calls are made.
- **Middleware**: Route protection and redirects are not yet active.
- **Token Refresh**: Logic for session extension is postponed until real API integration.
