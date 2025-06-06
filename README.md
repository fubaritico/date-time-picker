# DateTimePicker Component

A React 19.x date-time picker component, using TypeScript 5.x, styled with Tailwind 3.x CSS styling.

### Work in progress

Creation of `DatePicker`, `DateTimePicker`, `TimePicker` and `DateRangePicker` as separated components.

Tests have to be written for `DateRangePicker`.

A migration to Tailwind 4.x is planned.

Theme coloring has to be implemented. It will be based on Tailwind CSS colors. A color property will be added to the components. It will work with `cva` under the hood.

## Props

| Prop | Type                           | Default             | Description                                                                                                               |
|------|--------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------|
| date | number                         | undefined                | When using `DatePicker`, `DateTimePicker` or `TimePicker`, date as an UTC timestamp. It will default to now if not provided     |
| dateRange | [number, number]                     | [undefined, undefined] | When using `DateRangePicker`, range date as a tuple of two Unix timestamps                                                  |
| enablePortal | boolean                        | false               | Whether to render the panel in a portal                                                                                   |
| errors | string[]                       | []                  | Error messages to display                                                                                                 |
| loading | boolean                        | false               | If true, the input text is disabled and a loading animation is displayed on the right                                     |
| locale | string                         | 'en'                | Locale language in international ISO-8601                                                                                 |
| maxDate | Date                           | undefined                | When defining a valid/enabled range of dates, it will be the max/end date                                                 |
| minDate | Date                           | undefined                | When defining a valid/enabled range of dates, it will be the min/start date                                               |
| pickerMode | 'DATE' \| 'TIME' \| 'DATETIME' \| 'DATERANGE' | 'DATE'          | (dev and integration tests only) The mode of the picker                                                                   |
| noDefault | boolean                        | false               | If true, no default date (today) will be displayed                                                                        |
| onDateChange | (value?: number) => void                       | undefined                | When using `DatePicker`, `DateTimePicker` or `TimePicker`, this function is called on date click if the component is controlled |
| onDateRangeChange | (date: [number, number]) => void                       | undefined                | When using `DateRangePicker`, this function is called on date range change                                                  |
| placement | 'bottom-start' \| 'bottom-end'                         | 'bottom-start'      | The placement of the panel                                                                                                |
| size | 'sm' \| 'md' \| 'lg'           | 'md'                | The size of the component                                                                                                 |
| timezone | string                         | undefined                | Timezone list member based on moment.js                                                                                   |

## Development

Components in this project are visible in a storybook instance and a vite dev server.

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

### Storybook

Run the storybook instance to preview the components:

```bash
npm run storybook
# or
yarn storybook
# or
pnpm storybook
```

### Development Server

Run the development server to preview the components:

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

The project uses ESLint 9.x for linting and Prettier 3.x for code formatting.

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

Recommended examples:
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
