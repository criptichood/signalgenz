# Next.js Migration Plan

## Overview
This document outlines the steps required to migrate the existing Vite-based React application to Next.js 16. The current application is a cryptocurrency trading assistant with various features including signal generation, charting, social features, and more.

## Current Architecture
- Built with Vite + React + TypeScript
- Uses Zustand for state management
- Uses React Query for data fetching
- Tailwind CSS for styling
- Client-side routing using hash-based navigation
- Uses environment variables for API keys
- Multiple pages and components organized in separate directories
- Heavy use of hooks and custom components

## Migration Steps

### Phase 1: Setup Next.js Project Structure

1. **Initialize Next.js application**
   - Create a new Next.js 16 app or convert existing structure
   - Install necessary dependencies (next, react, react-dom, typescript, etc.)
   - Update package.json scripts to use Next.js commands instead of Vite

2. **Configure Next.js**
   - Create `next.config.js` or `next.config.ts`
   - Configure TypeScript with `tsconfig.json` (may need updates)
   - Set up ESLint and Prettier configurations
   - Configure Tailwind CSS (should be compatible with existing setup)

3. **Environment variables setup**
   - Move from `.env.local` to Next.js-compatible environment handling
   - Update how environment variables are accessed in the codebase

### Phase 2: Page Structure Migration

4. **Convert to App Router**
   - Migrate from hash-based routing to Next.js App Router
   - Create `app` directory with route segments
   - Convert existing pages to Next.js page components
   - Update navigation logic to use Next.js router instead of hash-based routing

5. **Create layout structure**
   - Define root layout (`app/layout.tsx`) with base styles and providers
   - Create main application layout that includes Header and Sidebar
   - Set up global styles and theme context

6. **Migrate authentication flow**
   - Convert AuthPage to proper Next.js route
   - Handle authentication differently (client vs server components)

### Phase 3: Component Migration and Structure

7. **Separate Client and Server Components**
   - Identify components that use browser-specific APIs (localStorage, DOM manipulation, etc.) - these must be client components
   - Identify components that can be server components (those that fetch data, render static content, etc.)
   - Add `"use client"` directive to components that need it
   - Optimize where possible to keep components as server components

8. **Adapt routing-dependent components**
   - Update components that rely on hash-based routing
   - Replace with Next.js router hooks (useRouter, usePathname, etc.)
   - Update any URL hash manipulation logic

9. **Component structure adjustments**
   - Move reusable components to the `components` directory (existing structure can remain)
   - Update import paths to work with Next.js structure
   - Ensure all components work correctly with Next.js rendering patterns

### Phase 4: State Management and Data Fetching

10. **State management considerations**
    - Zustand store remains largely the same (works in both environments)
    - Determine where to initialize providers (likely in root layout)
    - Ensure persistent stores work correctly with Next.js hydration

11. **Data fetching patterns**
    - Evaluate where React Query is used (might need adjustments)
    - Consider using Next.js native data fetching where appropriate
    - Update API calls to work with Next.js structure (server vs client components)

12. **API routes implementation**
    - Consider implementing Next.js API routes for backend-like functionality
    - Migrate current API logic from the `api` directory if needed
    - Handle server-side data fetching vs client-side requests appropriately

### Phase 5: Styling and Assets

13. **Styling migration**
    - Move existing CSS from `index.html` to appropriate Next.js locations
    - Use `app/globals.css` for global styles
    - Ensure Tailwind configuration works correctly
    - Verify custom CSS animations and theme system works

14. **Asset management**
    - Move images and static assets to `public` directory
    - Update asset paths in components
    - Configure image optimization if needed

### Phase 6: Client-Specific Functionality

15. **Client-side features**
    - Handle useEffect hooks that depend on browser APIs (localStorage, DOM elements, etc.)
    - Ensure client components are properly marked with "use client"
    - Address any hydration issues that might arise

16. **Third-party libraries**
    - Verify compatibility of libraries (react-query, zustand, lightweight-charts, etc.)
    - Handle any libraries that require specific client-side initialization

### Phase 7: Testing and Performance

17. **Update build and development scripts**
    - Replace Vite commands with Next.js commands
    - Test development server functionality
    - Verify build process works correctly

18. **Testing**
    - Run the application to identify any breaking functionality
    - Verify all pages and features work as expected
    - Test different routing scenarios
    - Ensure state persistence works correctly

### Phase 8: Optimization

19. **Performance optimization**
    - Implement code splitting where appropriate
    - Optimize server components for better performance
    - Ensure proper loading states and error boundaries

20. **Deployment considerations**
    - Configure for deployment to Vercel or other Next.js-compatible platforms
    - Set up environment variables in deployment environment

## Component Classification (Client vs Server)

### Server Components (can be rendered on server):
- Static content components
- Data fetching components (when data is available on server)
- Layout components without interactive state
- Components with heavy computations that don't need browser APIs

### Client Components (require browser environment):
- Components using localStorage (theme preferences, settings, etc.)
- Components with useEffect hooks for browser APIs
- Interactive forms and inputs
- Chart components (lightweight-charts)
- Real-time data components
- Components using browser APIs (DOM manipulation, etc.)

## Key Files to Migrate

### App Router Structure:
```
app/
├── layout.tsx (root layout with global providers)
├── page.tsx (main dashboard - equivalent to current App component)
├── globals.css (global styles from index.html)
├── providers/ (store providers, query providers, etc.)
├── (auth)/
│   └── page.tsx (auth flow)
├── dashboard/
│   └── page.tsx
├── signal-gen/
│   └── page.tsx
├── scalping/
│   └── page.tsx
├── [dynamic pages for all current routes]...
```

### Critical Migration Points:
1. Replace hash-based routing with Next.js routing
2. Handle Zustand store initialization with proper hydration
3. Manage localStorage usage in client components only
4. Preserve existing state management patterns
5. Maintain the same UI/UX experience
6. Ensure all API interactions continue to work
7. Keep the dynamic theme system functional
8. Preserve all social and messaging features

## Risks and Mitigation

1. **Hydration errors**: Ensure client components are properly marked and state is properly initialized
2. **State persistence**: Verify Zustand persist middleware works correctly with Next.js
3. **Browser-specific APIs**: Move all localStorage and DOM manipulation to client components
4. **Routing logic**: Replace hash-based navigation with Next.js router
5. **Bundle size**: Monitor performance differences between Vite and Next.js builds

## Migration Status

✅ **COMPLETED** - The migration from Vite to Next.js has been successfully completed. All components have been properly configured as client or server components where appropriate. The application is now running on the Next.js App Router with proper state management, routing, and styling.

## Cleanup Completed

- Removed vite.config.ts
- Removed index.html
- Removed index.tsx (Vite entry point)
- Removed Vite dependencies (@vitejs/plugin-react, vite) from package.json
- Verified that the application still runs correctly after cleanup