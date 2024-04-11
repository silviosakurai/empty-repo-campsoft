export interface ITokenJwtAccess {
  companyId: number;
  accessTypeId: number;
}

export interface ITokenJwtData {
  clientId: string;
  access: ITokenJwtAccess[];
}
