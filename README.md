# FE Challenge

## 📁 Files Structure:

- solution is isolated under **`/app/challenge`** folder

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) - Full-stack React framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual/latest) - Virtualization for handling large datasets
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Testing**: [Playwright](https://playwright.dev/) - End-to-end testing
- **Code Quality**: ESLint + Prettier + TypeScript

## 🛠️ Available Scripts

### Development

- **`npm run dev`** - Start the development server
  - Launches the React Router development server with hot reload
  - Available at `http://localhost:5173`

- **`npm run start:server`** - Start the JSON server (if using mock API)
  - Runs a JSON server on port 3001 for API mocking
  - Watches `db/db.json` for changes

### Building & Deployment

- **`npm run build`** - Build the application for production
  - Creates optimized production build in `/build` directory
  - Includes both client and server builds

- **`npm start`** - Start the production server
  - Serves the built application from `/build/server/index.js`
  - Use this to run the app in production

### Code Quality & Formatting

- **`npm run lint`** - Run ESLint with strict settings
  - Checks for code quality issues and errors
  - Fails if any warnings or errors are found (`--max-warnings 0`)

- **`npm run lint:fix`** - Auto-fix ESLint issues
  - Automatically fixes fixable linting problems
  - Manual review may be needed for complex issues

- **`npm run format`** - Format code with Prettier
  - Formats all files according to Prettier configuration
  - Ensures consistent code style across the project

- **`npm run format:check`** - Check code formatting
  - Verifies if files are properly formatted
  - Useful in CI/CD pipelines

### Type Checking

- **`npm run typecheck`** - Run TypeScript type checking
  - Generates React Router types and runs TypeScript compiler
  - Ensures type safety without emitting files

### Testing - Not fully completed

- **`npm test`** - Run Playwright tests
  - Executes end-to-end tests in headless mode
  - Tests run against the built application

- **`npm run test:headed`** - Run tests with browser UI
  - Same as `npm test` but shows browser windows
  - Useful for debugging test failures

- **`npm run test:ui`** - Open Playwright UI mode
  - Interactive test runner with UI
  - Great for writing and debugging tests

- **`npm run test:debug`** - Debug tests
  - Runs tests in debug mode with developer tools
  - Allows stepping through test execution

## 💡 Solution

This implementation demonstrates production-ready patterns and best practices for building scalable React applications with complex data requirements.

### Architecture & Design

**Component-Based Architecture:** The solution follows a modular approach with clear separation of concerns:

- **Generic Components** (`VirtualizedList`, `SearchBox`) provide reusable building blocks
- **Feature Components** compose generic components with domain-specific logic
- **Custom Hooks** (`useInfiniteList`, `useVirtualization`, `useSearchWithDebounce`) encapsulate complex behaviors
- **Service Layer** handles API communication with runtime validation

**State Management Strategy:**

- **Server State:** React Query manages data fetching, caching, and synchronization
- **Client State:** Zustand stores handle UI state with separate stores for Users and Reviewers
- **Local State:** Component-specific state for UI interactions

### Performance Optimizations

**Virtualization:** Implements `@tanstack/react-virtual` to efficiently render thousands of items by only mounting visible DOM nodes, achieving 60fps scrolling with datasets of any size.

**Infinite Scroll:** Smart pagination with:

- Intersection Observer triggers at 85% scroll depth
- Debounced scroll restoration preserves position during data updates
- Background data fetching with React Query's `fetchNextPage`

**Search Optimization:**

- 300ms debounce prevents excessive API calls
- Field-specific filtering (name/email) for precise results
- Search state persistence across component remounts

**Memoization:** Strategic use of `React.memo` and `useCallback` to prevent unnecessary re-renders, particularly in list items and search components.

### Best Practices Demonstrated

**Type Safety:** Comprehensive TypeScript coverage with:

- Zod schemas for runtime validation of all API responses
- Generic types for reusable components (`VirtualizedList<T>`)
- Strict type inference without `any` types

**Error Handling:**

- Graceful error states with user-friendly messages
- Retry mechanisms for failed requests
- Loading states for initial load, search, and pagination

**Code Reusability:**

- Single `VirtualizedList` component handles both Users and Reviewers
- Shared hooks and utilities reduce code duplication
- Component composition pattern for feature assembly

**API Validation:** All external data validated at runtime with Zod, ensuring type safety at API boundaries and preventing runtime errors from malformed data.

### Key Implementation Features

**Dual-List Solution:** Elegant side-by-side layout with:

- Independent scroll positions and search states
- Shared component architecture for consistency
- Responsive design adapting to screen sizes

**Search Architecture:**

- Dynamic field selection (name vs email)
- Real-time filtering with debouncing
- Maintained scroll position during searches

**Data Management:**

- Efficient caching strategy with React Query
- Optimistic updates for smooth UX
- Proper cleanup and memory management

### Technologies Used

- React Router v7 (Remix) - Modern React framework with SSR support
- React Query (TanStack Query) - Server state management with caching
- @tanstack/react-virtual - Virtualization for handling large datasets
- Zustand - Client state management for search and UI state
- Zod - Runtime type validation for API responses
- use-debounce - Search input optimization
- Shadcn UI + TailwindCSS - Component library and styling

## 📝 Challenge Specification

### General

In this challenge you will create a React app with a virtualized infinite scroll list.

### Task

1. Clone the repo.
2. Create a React app with a build system of your choice (e.g. RSPack, Vite, Webpack, etc.).
3. Implement an infinite scroll (data is lazy loaded) virtualized list component that will load data from the server. You can use a library or create your own implementation.
4. Display a list of users using the list component. A user item should include all fields, but id.
5. Add a search input that will filter the list by name or by email using the API.
6. Add a second list of reviewers to the app reusing the code you've created. Both lists should appear side by side, have their own search box, and load data from their respective api endpoints.

### Finishing the challenge

1. Don't forget to push your changes to your repo.
2. Send us a link to your repo.

### Technical Info

#### How to start

1. Install the dependencies.
2. Run npm start to start the server on port 3001.

#### API

- Users are available on localhost:3001/users
- Reviewers are available on localhost:3001/reviewers
- This mock API uses a basic json-server

#### Requirements

1. User friendly - empty state, loading state, error state, etc...
2. Visually appealing - use a design system of your choice (e.g. Material UI, Ant Design, etc.) or create your own
3. Smooth scrolling
4. Scalable (support extremely high amount of items)

#### Notes

- Don't be shy about using AI, as long as you understand the code and can explain it.
- Feel free to use any libraries you find useful for state management, calling APIs, etc.

**Solved by: Reuven Naor <a href="https://www.linkedin.com/in/reuven-naor/" target="_blank">LinkedIn</a>**
