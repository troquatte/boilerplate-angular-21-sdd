import { prisma } from '../../../prisma-conn';
import { EStatusErrors } from '../../../enum/EStatusErros.enum';

class EnderecoService {
  public async list(clienteId: string) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const data = await prisma.enderecos.findMany({
        where: { clienteId },
        orderBy: { createdAt: 'desc' },
      });

      return { data };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async create(
    clienteId: string,
    payload: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento?: string | null;
      bairro: string;
      cidade: string;
      estado: string;
      principal?: boolean;
    },
  ) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const data = await prisma.enderecos.create({
        data: {
          cep: payload.cep,
          logradouro: payload.logradouro,
          numero: payload.numero,
          complemento: payload.complemento || null,
          bairro: payload.bairro,
          cidade: payload.cidade,
          estado: payload.estado,
          principal: payload.principal ?? false,
          clienteId,
        },
      });

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async findById(clienteId: string, id: string) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const endereco = await prisma.enderecos.findUnique({ where: { id } });
      if (!endereco || endereco.clienteId !== clienteId) {
        throw new Error(EStatusErrors.E404);
      }

      return endereco;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async update(
    clienteId: string,
    id: string,
    payload: {
      cep?: string;
      logradouro?: string;
      numero?: string;
      complemento?: string | null;
      bairro?: string;
      cidade?: string;
      estado?: string;
      principal?: boolean;
    },
  ) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const endereco = await prisma.enderecos.findUnique({ where: { id } });
      if (!endereco || endereco.clienteId !== clienteId) {
        throw new Error(EStatusErrors.E404);
      }

      const data = await prisma.enderecos.update({
        where: { id },
        data: {
          cep: payload.cep !== undefined ? payload.cep : endereco.cep,
          logradouro: payload.logradouro !== undefined ? payload.logradouro : endereco.logradouro,
          numero: payload.numero !== undefined ? payload.numero : endereco.numero,
          complemento: payload.complemento !== undefined ? payload.complemento || null : endereco.complemento,
          bairro: payload.bairro !== undefined ? payload.bairro : endereco.bairro,
          cidade: payload.cidade !== undefined ? payload.cidade : endereco.cidade,
          estado: payload.estado !== undefined ? payload.estado : endereco.estado,
          principal: payload.principal !== undefined ? payload.principal : endereco.principal,
        },
      });

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async delete(clienteId: string, id: string) {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) {
        throw new Error(EStatusErrors.E404);
      }

      const endereco = await prisma.enderecos.findUnique({ where: { id } });
      if (!endereco || endereco.clienteId !== clienteId) {
        throw new Error(EStatusErrors.E404);
      }

      return await prisma.enderecos.delete({ where: { id } });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const enderecoService = new EnderecoService();
