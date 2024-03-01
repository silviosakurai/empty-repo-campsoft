export type ISmsService = {
  send: (input: ISmsServiceSendInput) => void;
};

export type ISmsServiceSendInput = {
  phone: string;
  name: string;
  message: string;
};

export type ISmsServiceGatewayResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  userId: number;
  name: string;
  razaoSocial: string;
  clientId: number;
  email: string;
  grupos: { id: number; name: string; permissoes: [] }[];
  revendas: [];
  clientes: { id: number; name: string; ativo: boolean; revendaId: number }[];
  senha_temporaria: boolean;
  doisFatores: boolean;
};

export type ISmsSentMessageResponse = {
  id: number;
  nome: string;
  centroCusto: { id: number; nome: string; codigo: number };
  produto: { id: number; nome: string };
  blackList: number;
  invalidos: number;
  repetidos: number;
  validos: number;
  custo: number;
  resumoHigienizacao: { invalidos: []; repetidos: []; blacklist: [] };
  smsEnvios: [
    {
      smsId: string;
      numero: string;
      smsClienteId: null;
    },
  ];
};
