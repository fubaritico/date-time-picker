# DateTimePicker Component Architecture

This document outlines the architecture of the DateTimePicker component, explaining how the various parts of the system work together.

## Project Structure

```
date-time-picker/
├── dist/                   # Built package output (generated)
├── dist-dev/               # Development build output (generated)
├── dev/                    # Development preview environment
│   ├── index.html          # HTML entry point for preview
│   ├── main.tsx            # React entry point for preview
│   └── styles.css          # Styles for preview (includes Tailwind)
├── src/                    # Source code
│   └── DateTimePicker/     # Component code
│       ├── components/     # Sub-components
│       ├── formats/        # Date formatting utilities
│       ├── hooks/          # Custom React hooks
│       ├── stories/        # Component stories
│       ├── DateTimePicker.context.tsx  # Context provider
│       ├── DateTimePicker.test.tsx     # Component tests
│       ├── DateTimePicker.tsx          # Main component
│       ├── DateTimePicker.types.ts     # TypeScript types
│       ├── DateTimePicker.utils.ts     # Utility functions
│       ├── index.ts                    # Public API
│       └── styles.css                  # Component styles (includes Tailwind)
├── __mocks__/              # Jest mocks
├── .gitignore              # Git ignore file
├── .husky/                 # Husky git hooks
├── .npmignore              # npm ignore file
├── .npmrc                  # npm/pnpm configuration file
├── .prettierrc             # Prettier configuration
├── commitlint.config.js    # Commitlint configuration
├── eslint.config.js        # ESLint configuration
├── jest.config.ts          # Jest configuration
├── jest.setup.js           # Jest setup
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── rollup.config.js        # Rollup configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Key Components

### Build System

- **Rollup**: Used to bundle the component for distribution. Configured to output both CommonJS and ES modules formats, as well as TypeScript declaration files.
- **TypeScript**: Used for type checking and generating declaration files.
- **PostCSS**: Used to process CSS, including Tailwind CSS.
- **Tailwind CSS**: Used for styling the component.

### Development Environment

- **Vite**: Used to provide a development server for previewing the component during development.
- **React 19**: The component is built for React 19, which is specified as a peer dependency.
- **pnpm**: Used as the package manager (version 10.0.0) for managing dependencies and running scripts.
- **ESLint**: Used for linting JavaScript and TypeScript code with a flat configuration (eslint.config.js).
- **Prettier**: Used for code formatting with a consistent style.
- **Commitlint**: Used to enforce conventional commit message format.
- **Husky**: Used to set up Git hooks for pre-commit linting and commit message validation.
- **lint-staged**: Used to run linters only on staged files in Git.

### Testing

- **Jest**: Used as the test runner.
- **React Testing Library**: Used for testing React components.
- **ts-jest**: Used to run TypeScript tests with Jest.

## Workflow

### Development

1. Run `pnpm dev` to start the development server.
2. Edit the component code in the `src/DateTimePicker` directory.
3. Preview the component in the browser at http://localhost:3000.

### Testing

1. Write tests in `*.test.tsx` files.
2. Run `pnpm test` to run the tests.

### Building

1. Run `pnpm build` to build the component for distribution.
2. The built files will be in the `dist` directory.

### Publishing

1. Update the version in `package.json`.
2. Run `pnpm publish` to publish the package to npm.

## Design Decisions

### Component API

The component is designed to be used as a controlled or uncontrolled component:

- **Controlled**: Pass a `value` and `onChange` prop to control the component's state externally.
- **Uncontrolled**: Don't pass a `value` or `onChange` prop, and the component will manage its own state.

### Styling

The component uses Tailwind CSS for styling, with a custom prefix (``) to avoid conflicts with other CSS frameworks.

### Bundle Size

The component is designed to be as small as possible, with peer dependencies (React, React DOM) excluded from the bundle.

### TypeScript

The component is written in TypeScript to provide type safety and better developer experience.
