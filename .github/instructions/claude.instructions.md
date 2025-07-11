---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

# Coding Standards and Preferences for Vector2Godot
- Follow the DRY (Don't Repeat Yourself) principle.
- Use meaningful variable and function names.
- Write modular and reusable code.
- Include comments and documentation for complex logic.
- Prioritize readability and maintainability.
- Adhere to the project's coding style and conventions.
- Use consistent indentation (2 spaces).

# Domain Knowledge
- The project is a desktop application built with Electron and Vite.
- It uses TypeScript for the main application logic.
- The application is designed to convert vector graphics to Godot-compatible formats.

# Preferences
- Use TypeScript for all new code.
- Use modern JavaScript features (ES6+).
- Use async/await for asynchronous operations.
- Use Promises for handling asynchronous tasks.
- Use template literals for string interpolation.
- Use arrow functions for concise function expressions.
- Use destructuring for objects and arrays where appropriate.
- Use `const` and `let` instead of `var` for variable declarations.
- Use `import` and `export` for module management.
- Use `async` functions for asynchronous operations.
- Use `try/catch` for error handling in asynchronous code.
- Use `console.log` for debugging, but remove or replace with proper logging before production.
- Use `eslint` and `prettier` for code formatting and linting.
- Use `npm` for package management.
- Use `git` for version control.
- Use `electron-builder` for building the application.
- Use `vite` for development and production builds.
- Close terminal windows when you finish with them.

# Versioning
- The version number should be updated after each chat.
- The version number should follow semantic versioning (MAJOR.MINOR.PATCH).
- The version number should be in the format `x.y.z`, where:
  - `x` is the major version (incremented for breaking changes)
  - `y` is the minor version (incremented for new features)
  - `z` is the patch version (incremented for bug fixes)
- Single source of truth for the version number is the `package.json` file.
- The version number should be included in the following files:
  - `README.md`
  - `index.html`
  - `style.css`
  - `electron-main.cjs`
  - `vite.config.ts`
  - `CHANGELOG.md`
  - `LICENSE`
- The version number should be included in the commit message.

# Changelog
- The changelog should be updated after each chat.
- The changelog should follow the format:
  ```
  ## [VERSION] - YYYY-MM-DD

  - Description of changes made
  - Any relevant notes or information
  ```
- The changelog should be included in the `CHANGELOG.md` file.
- The changelog should be included in the `README.md` file.