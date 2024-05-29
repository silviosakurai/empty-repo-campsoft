import { TemplateMessageParams } from "@core/common/enums/TemplateMessageParams";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";

export function replaceTemplate(
  template: string,
  values: IReplaceTemplate
): string {
  if (values.code) {
    const regexPattern = new RegExp(TemplateMessageParams.CODE, "g");
    template = template.replace(regexPattern, values.code);
  }

  if (values.name) {
    const regexPattern = new RegExp(TemplateMessageParams.NAME, "g");
    template = template.replace(regexPattern, values.name);
  }

  return template;
}
