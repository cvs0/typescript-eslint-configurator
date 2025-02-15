# Typescript ESLint Configurator

An interactive CLI tool to configure ESLint rules quickly and efficiently.

## Installation

Install globally using npm:

```bash
npm install -g typescript-eslint-configurator
```

Or run directly with npx:

```bash
npx typescript-eslint-configurator
```

## Usage

1. Select rules to enable from the interactive menu.
2. Set the severity for each selected rule.
3. The tool generates a `.eslintrc.json` file in your project directory.

## Development

* Clone the repository.
* Run locally:
    ```bash
    npm run start
    ```


### **Build and Publish**

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Test Locally**:
   ```bash
   npx ./dist/index.js
   ```

3. **Login to NPM**:
   ```bash
   npm login
   ```

4. **Publish to NPM**:
   ```bash
   npm publish
   ```