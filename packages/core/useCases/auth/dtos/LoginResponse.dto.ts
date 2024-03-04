import { Gender, Status } from "@core/common/enums/models/client";

export interface LoginResponse {
  id_cliente: Buffer;
  status: Status;
  id_cliente_tipo: number;
  id_facebook?: bigint;
  nome?: string;
  sobrenome?: string;
  data_nascimento?: Date;
  email?: string;
  telefone: string;
  cpf?: string;
  sexo?: Gender;
}
