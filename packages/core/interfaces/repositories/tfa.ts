export interface ITemplateWhatsapp {
  template: string;
  templateId: number;
}

export interface ITemplateSMS {
  template: string;
  templateId: number;
}

export interface IValidateCodeTFA {
  id: number;
  token: string;
}
