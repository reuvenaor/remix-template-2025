# React Router Template 2025

A modern React Router v7 application template with TypeScript, TailwindCSS, and comprehensive development tooling.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) - Full-stack React framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Testing**: [Playwright](https://playwright.dev/) - End-to-end testing
- **Code Quality**: ESLint + Prettier + TypeScript

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd remix-template-2025

# Install dependencies
npm install
```

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

### Testing

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

## 🏗️ Project Structure

```
├── app/                    # Application source code
│   ├── components/         # Reusable UI components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   ├── routes/            # Route components
│   ├── welcome/           # Welcome page assets
│   ├── app.css           # Global styles
│   ├── root.tsx          # Root layout component
│   └── routes.ts         # Route configuration
├── build/                 # Production build output
├── public/               # Static assets
├── .react-router/        # Generated types and build artifacts
├── components.json       # shadcn/ui configuration
├── eslint.config.js     # ESLint configuration
├── playwright.config.ts  # Playwright test configuration
├── tailwind.config.ts   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🎨 UI Components

This template includes a curated set of UI components built with Radix UI and styled with TailwindCSS:

- **Button** - Versatile button component with multiple variants
- **Card** - Container component for content sections
- **Dropdown Menu** - Accessible dropdown menu component
- **Input** - Form input component with consistent styling

Components follow the [shadcn/ui](https://ui.shadcn.com/) pattern and can be found in `app/components/ui/`.

## 🔧 Development Tools

### Code Quality

- **ESLint**: Configured with TypeScript, React, and React Query rules
- **Prettier**: Consistent code formatting with single quotes preference
- **TypeScript**: Strict type checking enabled

### State Management

- **Zustand**: Lightweight alternative to Redux for client state
- **TanStack Query**: Server state management with caching and synchronization

### Styling

- **TailwindCSS v4**: Latest version with improved performance
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Intelligent class merging utility

## 🚦 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

4. **Start building** your application by editing files in the `app/` directory

## 📝 Code Style

This project uses:

- **Single quotes** for strings and JSX attributes
- **No semicolons** (handled by Prettier)
- **2-space indentation**
- **Trailing commas** where valid

Run `npm run format` to ensure your code follows the project's style guidelines.

## 🧪 Testing

Tests are written with Playwright and located in the `tests/` directory. The test configuration supports:

- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Screenshot comparisons
- Network mocking

## 📚 Learn More

- [React Router Documentation](https://reactrouter.com/start/framework/installation)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Playwright Documentation](https://playwright.dev/docs/intro)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run typecheck`
5. Run `npm test` to ensure tests pass
6. Submit a pull request

## 📄 License

This project is private and not licensed for public use.
