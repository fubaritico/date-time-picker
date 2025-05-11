# DateTimePicker Component

A React 19 date and time picker component with Tailwind CSS styling.

## Installation

```bash
npm install @your-scope/date-time-picker
# or
yarn add @your-scope/date-time-picker
# or
pnpm add @your-scope/date-time-picker
```

> **Note:** Replace `@your-scope` with your actual npm scope or username.

## Usage

```jsx
import React, { useState } from 'react';
import { DateTimePicker } from '@your-scope/date-time-picker';

// Import the styles (optional if you're using a CSS loader in your project)
import '@your-scope/date-time-picker/dist/index.css';

function App() {
  const [value, setValue] = useState(new Date());

  return (
    <div>
      <h1>Date Time Picker Example</h1>
      <DateTimePicker 
        value={value} 
        onChange={setValue} 
      />
      <p>Selected value: {value.toString()}</p>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| date | Date | null | The selected date |
| extraIcon | ReactNode | null | Additional icon to display |
| enablePortal | boolean | false | Whether to render the panel in a portal |
| errors | string[] | [] | Error messages to display |
| loading | boolean | false | Whether the component is in a loading state |
| locale | string | 'en' | The locale to use for formatting |
| maxDate | Date | null | The maximum selectable date |
| minDate | Date | null | The minimum selectable date |
| pickerMode | 'date' \| 'time' \| 'datetime' | 'datetime' | The mode of the picker |
| noDefault | boolean | false | Whether to use a default date |
| onDateChange | function | null | Callback when the date changes |
| placement | string | 'bottom-start' | The placement of the panel |
| size | 'small' \| 'medium' \| 'large' | 'medium' | The size of the component |
| timezone | string | null | The timezone to use |

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

### Development Server

Run the development server to preview the component:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will start a development server at http://localhost:3000 with a preview of the component.

### Testing

Run the tests:

```bash
npm test
# or
yarn test
# or
pnpm test
```

### Linting and Formatting

The project uses ESLint for linting and Prettier for code formatting.

Run the linter:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
# or
yarn lint:fix
# or
pnpm lint:fix
```

Format code with Prettier:

```bash
npm run format
# or
yarn format
# or
pnpm format
```

### Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This helps to generate changelogs and makes commit history more readable.

Format: `<type>(<scope>): <subject>`

Examples:
- `feat: add new date format option`
- `fix: correct time zone calculation`
- `docs: update API documentation`
- `style: format code with prettier`

Allowed types:
- `build`: Changes that affect the build system or external dependencies
- `chore`: Other changes that don't modify src or test files
- `ci`: Changes to CI configuration files and scripts
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Reverts a previous commit
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `test`: Adding missing tests or correcting existing tests

### Building

Build the component for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Publishing

Before publishing, make sure to update the following fields in `package.json`:

1. `name`: Replace `@your-scope/date-time-picker` with your actual npm scope or username
2. `author`: Add your name, email, and website
3. `repository.url`: Update with your actual GitHub repository URL

This package uses GitHub Actions for automated publishing to npm. There are two ways to trigger a new release:

#### Option 1: Create a GitHub Release

1. Go to the GitHub repository's "Releases" section
2. Click "Draft a new release"
3. Create a new tag version (e.g., v1.0.0)
4. Set a release title and description
5. Click "Publish release"

The GitHub Actions workflow will automatically build and publish the package to npm.

#### Option 2: Manual Workflow Dispatch

1. Go to the GitHub repository's "Actions" tab
2. Select the "Publish to NPM" workflow
3. Click "Run workflow"
4. Choose the version bump type (patch, minor, major, or specific version)
5. Click "Run workflow"

The GitHub Actions workflow will:
- Bump the version in package.json
- Create a git tag
- Push the changes to GitHub
- Build and publish the package to npm

#### Setup Requirements

Before you can publish, make sure:

1. You have an npm account and are logged in
2. You have added an NPM_TOKEN secret to your GitHub repository:
   - Generate a token from your npm account settings
   - Go to your GitHub repository settings → Secrets → Actions
   - Add a new secret named NPM_TOKEN with your npm token value

## License

MIT
