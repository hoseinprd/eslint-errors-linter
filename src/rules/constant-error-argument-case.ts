import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { RULE_NAME } from "../constants";

type Options = ["kebab-case" | "PascalCase" | 'space-case'];

const createRule = ESLintUtils.RuleCreator(() => RULE_NAME);

export const rule = createRule({
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
        type: "string",
      },
    ],
    type: "suggestion",
  },
  defaultOptions: ["PascalCase"],

  create: (context, [options]) => {
    const isPascalCase = options === "PascalCase";

    function checkArgumentCase(node: TSESTree.Node) {
      if (
        node.type === "NewExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "Error"
      ) {
        const errorArg = node.arguments[0];
        if (
          errorArg &&
          errorArg.type === "Literal" &&
          typeof errorArg.value === "string"
        ) {
          const argName = context.getSourceCode().getText(errorArg);
          const isConstantCase = isPascalCase
            ? /^[A-Z]+(?:_[A-Z]+)*$/.test(errorArg.value)
            : /^[a-z]+(?:-[a-z]+)*$/.test(errorArg.value);

          if (!isConstantCase) {
            context.report({
              node: errorArg,
              messageId: "constantCase",
              data: {
                argName,
                case: isPascalCase ? "PascalCase" : "kebab-case",
              },
            });
          }
        }
      }
    }

    return {
      NewExpression: checkArgumentCase,
    };
  },
});

export default rule;
