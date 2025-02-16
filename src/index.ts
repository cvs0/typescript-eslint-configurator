#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const eslintRules = [
  {
    name: "no-console",
    category: "Best Practices",
    description: "Disallow console statements",
  },
  {
    name: "eqeqeq",
    category: "Best Practices",
    description: "Require strict equality operators",
  },
  {
    name: "no-unused-vars",
    category: "Variables",
    description: "Disallow unused variables",
  },
  {
    name: "indent",
    category: "Stylistic Issues",
    description: "Enforce consistent indentation",
  },
  {
    name: "@typescript-eslint/no-explicit-any",
    category: "TypeScript",
    description: "Disallow usage of the `any` type",
  },
  {
    name: "no-debugger",
    category: "Best Practices",
    description: "Disallow the use of debugger",
  },
  {
    name: "no-empty",
    category: "Stylistic Issues",
    description: "Disallow empty block statements",
  },
  {
    name: "no-eval",
    category: "Best Practices",
    description: "Disallow the use of eval()",
  },
  {
    name: "prefer-const",
    category: "Best Practices",
    description:
      "Require `const` declarations for variables that are never reassigned",
  },
  {
    name: "no-var",
    category: "Best Practices",
    description: "Disallow the use of `var` to declare variables",
  },
  {
    name: "object-shorthand",
    category: "Stylistic Issues",
    description: "Enforce the use of object shorthand notation",
  },
  {
    name: "arrow-body-style",
    category: "Stylistic Issues",
    description: "Enforce the use of arrow functions with a concise body",
  },
  {
    name: "no-undef",
    category: "Variables",
    description: "Disallow the use of undeclared variables",
  },
  {
    name: "prefer-template",
    category: "Best Practices",
    description:
      "Enforce the use of template literals over string concatenation",
  },
  {
    name: "no-magic-numbers",
    category: "Best Practices",
    description:
      "Disallow magic numbers (i.e., literal numbers with no explanation)",
  },
  {
    name: "react/react-in-jsx-scope",
    category: "React",
    description: "Forces the React import in the current scope.",
  },
];

function readExistingConfig() {
  const eslintConfigPath = path.resolve(process.cwd(), ".eslintrc.json");
  if (fs.existsSync(eslintConfigPath)) {
    const config = JSON.parse(fs.readFileSync(eslintConfigPath, "utf-8"));
    return config;
  }
  return null;
}

function detectFrameworks() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) return [];

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const dependencies = packageJson.dependencies || {};

  const frameworks: string[] = [];

  if (dependencies.next) frameworks.push("next");
  if (dependencies.react && dependencies["react-dom"]) frameworks.push("react");
  if (dependencies.vue) frameworks.push("vue");
  if (dependencies["@angular/core"]) frameworks.push("angular");

  return frameworks;
}

export async function main() {
  console.log("Welcome to the ESLint Configurator!");

  const selectedRules = await inquirer.prompt([
    {
      type: "checkbox",
      name: "enabledRules",
      message: "Select the rules you want to enable:",
      choices: eslintRules.map((rule) => ({
        name: `${rule.name} - ${rule.description} [${rule.category}]`,
        value: rule.name,
      })),
    },
  ]);

  if (
    !selectedRules ||
    !selectedRules.enabledRules ||
    selectedRules.enabledRules.length === 0
  ) {
    console.log("No rules selected.");
    return;
  }

  const severityChoices = ["off", "warn", "error"];
  const ruleSettings: Record<string, string> = {};

  for (const ruleName of selectedRules.enabledRules) {
    const { severity } = await inquirer.prompt([
      {
        type: "list",
        name: "severity",
        message: `Set severity for rule: ${ruleName}`,
        choices: severityChoices,
        default: "error",
      },
    ]);
    ruleSettings[ruleName] = severity;
  }

  let eslintConfig = readExistingConfig();

  if (!eslintConfig) {
    eslintConfig = {
      env: {
        browser: true,
        node: true,
        es2021: true,
      },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      rules: {},
    };
  }

  eslintConfig.rules = {
    ...eslintConfig.rules,
    ...ruleSettings,
  };

  const frameworks = detectFrameworks();
  const frameworksToAdd: string[] = [];

  frameworks.forEach((framework) => {
    if (framework === "next" && !eslintConfig.extends.includes("next")) {
      frameworksToAdd.push("next", "next/core-web-vitals");
    }
    if (
      framework === "react" &&
      !eslintConfig.extends.includes("plugin:react/recommended")
    ) {
      frameworksToAdd.push("plugin:react/recommended");
      eslintConfig.plugins = eslintConfig.plugins || [];
      eslintConfig.plugins.push("react");
    }
    if (
      framework === "vue" &&
      !eslintConfig.extends.includes("plugin:vue/vue3-recommended")
    ) {
      frameworksToAdd.push("plugin:vue/vue3-recommended");
      eslintConfig.plugins = eslintConfig.plugins || [];
      eslintConfig.plugins.push("vue");
    }
    if (
      framework === "angular" &&
      !eslintConfig.extends.includes("plugin:@angular-eslint/recommended")
    ) {
      frameworksToAdd.push("plugin:@angular-eslint/recommended");
      eslintConfig.plugins = eslintConfig.plugins || [];
      eslintConfig.plugins.push("@angular-eslint");
    }
  });

  eslintConfig.extends.push(...frameworksToAdd);

  const outputPath = path.resolve(process.cwd(), ".eslintrc.json");
  fs.writeFileSync(outputPath, JSON.stringify(eslintConfig, null, 2));
  console.log(`ESLint configuration saved to ${outputPath}`);
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
