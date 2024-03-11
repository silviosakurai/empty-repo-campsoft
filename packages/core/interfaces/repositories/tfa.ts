export interface ITemplateWhatsapp {
  template: string;
  templateId: number;
}

export interface ITemplateSMS {
  template: string;
  templateId: number;
}

export interface ITemplateEmail {
  templateId: number;
  sender: string;
  replyTo: string;
  subject: string;
  template: string;
  templateTxt: string;
}

export interface IValidateCodeTFA {
  id: number;
  token: string;
}
