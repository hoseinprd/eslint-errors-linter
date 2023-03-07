import { TSESLint } from "@typescript-eslint/utils";
import { RULE_NAME } from "../src/constants";
import rule from "../src/rules/constant-error-argument-case";

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  settings: {
    RULE_NAME: ["warn", "PascalCase"],
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: 'throw new Error("ERROR_CONSTANT")',
    },
  ],
  invalid: [
    {
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
