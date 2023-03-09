import { TSESLint } from "@typescript-eslint/utils";
import { RULE_NAME } from "../src/constants";
import rule from "../src/rules/constant-error-argument-case";

describe("MACRO_CASE", () => {
  const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: [
      {
        options: [{ type: "MACRO_CASE" }],
        code: 'throw new Error("ERROR_CONSTANT")',
      },
    ],
    invalid: [
      {
        options: [{ type: "MACRO_CASE" }],
        code: 'throw new Error("errorVariable");',
        errors: [
          {
            messageId: "constantCase",
            line: 1,
            column: 17,
          },
        ],
      },
    ],
  });
});

describe("snake_case", () => {
  const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: [
      {
        options: [{ type: "snake_case", pattern: "Error" }],
        code: 'new Error("hello_world")',
      },
      {
        options: [{ type: "snake_case", pattern: "Exception" }],
        code: 'new Error("hello_world")',
      },
    ],
    invalid: [
      {
        options: [{ type: "snake_case", pattern: "Exception|Error" }],
        code: 'new Error("hello-world")',
        errors: [{ messageId: "constantCase" }],
      },
    ],
  });
});
