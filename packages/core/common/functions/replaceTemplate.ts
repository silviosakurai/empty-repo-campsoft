import { TemplateMessageParams } from "@core/common/enums/TemplateMessageParams";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";

export function replaceTemplate(
  template: string,
  values: IReplaceTemplate
): string {
  if (values.code) {
    template = template.replace(TemplateMessageParams.CODE, values.code);
  }

  if (values.name) {
    template = template.replace(TemplateMessageParams.NAME, values.name);
  }

  return template;
}
