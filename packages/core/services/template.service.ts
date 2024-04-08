import { TemplateEmailViewer } from "@core/repositories/template/TemplateEmailViewer.repository";
import { TemplateModuleViewerByNameRepository } from "@core/repositories/template/TemplateModuleViewerByName.repository";
import { injectable } from "tsyringe";

@injectable()
export class TemplateService {
  constructor(
    private readonly templateEmailViewer: TemplateEmailViewer,
    private readonly templateModuleViewerByNameRepository: TemplateModuleViewerByNameRepository
  ) {}

  viewTemplateEmail = async (templateModuleId: number, companyId?: number) => {
    return this.templateEmailViewer.view(templateModuleId, companyId);
  };

  viewModuleByName = async (name: string) => {
    return this.templateModuleViewerByNameRepository.view(name);
  };
}
