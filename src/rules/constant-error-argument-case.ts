import { ESLintUtils } from "@typescript-eslint/utils";

import { checkArgsCase } from "../utils";
import { RULE_NAME } from "../constants";

export type CaseType =
  | "kebab-case"
  | "MACRO_CASE"
  | "no case"
  | "snake_case"
  | "Train-Case";

export type Options = [{ type: CaseType; pattern?: string }];

const createRule = ESLintUtils.RuleCreator(() => RULE_NAME);

const rule = createRule<Options, "constantCase">({
  name: RULE_NAME,
  meta: {
    docs: {
      description: "Enforce constant case for error arguments",
      recommended: "error",
    },
    messages: {
      constantCase:
        'Error argument "{{ argName }}" should be in {{ case }} case',
    },
    schema: [
      {
        type: "object",
        properties: {
          caseType: {
            enum: ["kebab-case", "MACRO_CASE", "no case", "snake_case"],
          },
          regex: {
            type: "object",
          },
        },
      },
    ],
    type: "suggestion",
  },
  defaultOptions: [
    {
      type: "MACRO_CASE",
      pattern: "Error$",
    },
  ],

  create: (context, [{ type, pattern }]) => {
    return {
      NewExpression: (node) => checkArgsCase(node, context, type, pattern),
    };
  },
});

export default rule;
