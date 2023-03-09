import { TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/dist/ts-eslint";
import {
  isKebabCase,
  isMacroCase,
  isNoCase,
  isSnakeCase,
  isTrainCase,
} from "naming-conventions-modeler";
import { CaseType, Options } from "../rules";

export const checkArgsCase = (
  node: TSESTree.Node,
  ctx: Readonly<RuleContext<"constantCase", Options>>,
  type: CaseType,
  pattern: string
) => {
  if (node.type !== "NewExpression" || node.callee.type !== "Identifier")
    return;

  if (!new RegExp(pattern, "u").test(node.callee.name)) return;

  const errorArg = node.arguments[0];

  if (errorArg?.type !== "Literal" || typeof errorArg.value !== "string")
    return;

  const argName = ctx.getSourceCode().getText(errorArg);

  let isCaseMatched: boolean;
  switch (type) {
    case "MACRO_CASE":
      isCaseMatched = isMacroCase(errorArg.value);
      break;
    case "Train-Case":
      isCaseMatched = isTrainCase(errorArg.value);
      break;
    case "kebab-case":
      console.log(type);
      isCaseMatched = isKebabCase(errorArg.value);
      break;
    case "no case":
      isCaseMatched = isNoCase(errorArg.value);
      break;
    case "snake_case":
      isCaseMatched = isSnakeCase(errorArg.value);
      break;
    default:
      isCaseMatched = false;
  }

  if (!isCaseMatched) {
    ctx.report({
      node: errorArg,
      messageId: "constantCase",
      data: {
        argName,
        case: type,
      },
    });
  }
};
