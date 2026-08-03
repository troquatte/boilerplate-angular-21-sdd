import { IClientes } from './clientes.interface';

export interface IClientesResponse {
  items: IClientes[];
  totalItems: number;
}
