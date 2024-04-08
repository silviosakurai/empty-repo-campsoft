import { TemplateEmailViewer } from "@core/repositories/template/TemplateEmailViewer.repository";
import { injectable } from "tsyringe";

@injectable()
export class TemplateService {
  constructor(private readonly templateEmailViewer: TemplateEmailViewer) {}

  async viewTemplateEmail(templateModuleId: number, companyId?: number) {
    return this.templateEmailViewer.view(templateModuleId, companyId);
  }
}
