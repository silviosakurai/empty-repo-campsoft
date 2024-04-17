export enum ClientStatus {
  ACTIVE = "ativo",
  INACTIVE = "inativo",
  DELETED = "deletado",
}

export enum ClientGender {
  MALE = "M",
  FEMALE = "F",
}

export enum ClientType {
  CLIENT = 1,
  MANIA_ADMIN = 2,
  FRANCHISEE_ADMIN = 3,
  FRANCHISEE_MANAGER = 4,
  FRANCHISEE_SUPERVISOR = 5,
  FRANCHISEE_SELLER = 6,
  MANIA_OPERATOR = 7,
}

export enum ClientMagicTokenStatus {
  YES = "Y",
  NO = "N",
}

export enum ClientAddress {
  BILLING = "Cobranca",
  SHIPPING = "Envio",
}

export enum ClientShippingAddress {
  YES = "Y",
  NO = "N",
}

export enum ClientFields {
  user_id = "user_id",
  name = "name"
}
