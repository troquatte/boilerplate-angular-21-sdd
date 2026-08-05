export interface IEndereco {
  id: string;
  createdAt: string;
  updatedAt: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
  clienteId: string;
}
