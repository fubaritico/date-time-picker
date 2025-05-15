# DateTimePicker Component

A React 19 date and time picker component with Tailwind CSS styling.

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
| size | 'sm' \| 'md' \| 'lg' | 'md' | The size of the component |
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

1. `name`: Replace `@<fubaratico or your scope>/date-time-picker` with your actual npm scope or username
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

1. You have a npm account and are logged in
2. You have added an NPM_TOKEN secret to your GitHub repository:
   - Generate a token from your npm account settings
   - Go to your GitHub repository settings → Secrets → Actions
   - Add a new secret named NPM_TOKEN with your npm token value

- ### Local Development with Yalc

To test the package locally before publishing to npm, you can use `yalc`. This allows you to simulate installing and using the package in other local projects.

#### Setup Yalc

1. Install yalc globally:
   ```bash
   pnpm add -g yalc
   ```
   Note: If you encounter any global installation issues, run `pnpm setup` first.

#### Publishing Locally

In the date-time-picker directory:

1. Build and publish to a local 'yalc' store:
   ```bash
   pnpm build
   yalc publish
   ```

#### Using in Another Project

In your test project directory:

1. Add the package from yalc:
   ```bash
   yalc add @<fubaratico or your scope>/date-time-picker
   pnpm install
   ```

2. Import and use the component as if it were installed from npm:
   ```typescript
   import { DateTimePicker } from '@<fubaratico or your scope>/date-time-picker';
   ```

#### Development Workflow

For active development:

1. In the date-time-picker directory, use watch mode to automatically update changes:
   ```bash
   pnpm build --watch
   ```

2. In another terminal, push changes to linked projects:
   ```bash
   yalc push
   ```

   Or use `yalc push --watch` to automatically push changes.

#### Cleanup

When you're done testing:

1. In your test project:
   ```bash
   yalc remove @<fubaratico or your scope>/date-time-picker
   pnpm install
   ```

2. Optional - remove all yalc links globally:
   ```bash
   yalc installations clean
   ```

### NPM Token Configuration

When working with private packages or publishing, you might encounter issues with the NPM_TOKEN. Here's how to handle it:

#### For Local Development

If you see warnings about NPM_TOKEN not being set, you have two options:

1. **Simple Solution (Recommended for Local Development)**
   - Delete the `.npmrc` file locally (it's gitignored anyway)
   - Or create a basic `.npmrc` with just:
     ```
     registry=https://registry.npmjs.org/
     ```

2. **For Publishing and CI/CD**
   - Create a `.npmrc` file with:
     ```
     //registry.npmjs.org/:_authToken=${NPM_TOKEN}
     registry=https://registry.npmjs.org/
     ```
   - Set the NPM_TOKEN in your environment:
     ```bash
     export NPM_TOKEN=your_token_value
     ```

Note: The `.npmrc` file is git-ignored for security reasons. For local development, you typically don't need the NPM_TOKEN unless you're publishing or accessing private packages.

## License

MIT
