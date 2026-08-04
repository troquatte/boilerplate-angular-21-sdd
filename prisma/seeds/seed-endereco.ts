import { PrismaClient } from '@prisma/client';

const enderecosPorCliente = [
  {
    cep: '01001-000',
    logradouro: 'Praça da Sé',
    numero: '100',
    complemento: 'Apto 12',
    bairro: 'Sé',
    cidade: 'São Paulo',
    estado: 'SP',
    principal: true,
  },
  {
    cep: '20040-010',
    logradouro: 'Av. Rio Branco',
    numero: '156',
    complemento: 'Sala 301',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    principal: true,
  },
  {
    cep: '30140-130',
    logradouro: 'Av. Afonso Pena',
    numero: '2020',
    complemento: null,
    bairro: 'Centro',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    principal: true,
  },
  {
    cep: '80010-000',
    logradouro: 'R. XV de Novembro',
    numero: '50',
    complemento: 'Cj 45',
    bairro: 'Centro',
    cidade: 'Curitiba',
    estado: 'PR',
    principal: true,
  },
  {
    cep: '50010-000',
    logradouro: 'R. da Aurora',
    numero: '500',
    complemento: null,
    bairro: 'Boa Vista',
    cidade: 'Recife',
    estado: 'PE',
    principal: true,
  },
  {
    cep: '40010-000',
    logradouro: 'Av. Sete de Setembro',
    numero: '1000',
    complemento: 'Bloco B',
    bairro: 'Comércio',
    cidade: 'Salvador',
    estado: 'BA',
    principal: true,
  },
  {
    cep: '74010-010',
    logradouro: 'Av. Goiás',
    numero: '750',
    complemento: null,
    bairro: 'Centro',
    cidade: 'Goiânia',
    estado: 'GO',
    principal: true,
  },
  {
    cep: '69010-000',
    logradouro: 'Av. Eduardo Ribeiro',
    numero: '88',
    complemento: 'Apto 401',
    bairro: 'Centro',
    cidade: 'Manaus',
    estado: 'AM',
    principal: true,
  },
  {
    cep: '59010-000',
    logradouro: 'Av. Hermes da Fonseca',
    numero: '1234',
    complemento: null,
    bairro: 'Tirol',
    cidade: 'Natal',
    estado: 'RN',
    principal: true,
  },
  {
    cep: '88010-000',
    logradouro: 'R. Felipe Schmidt',
    numero: '99',
    complemento: 'Sala 7',
    bairro: 'Centro',
    cidade: 'Florianópolis',
    estado: 'SC',
    principal: true,
  },
];

export async function seedEndereco(
  prisma: PrismaClient,
  clientes: { id: string; fullName: string }[],
): Promise<void> {
  let count = 0;

  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const endereco = enderecosPorCliente[i % enderecosPorCliente.length];

    await prisma.enderecos.create({
      data: {
        ...endereco,
        clienteId: cliente.id,
      },
    });
    count++;

    // Adicionar endereço secundário para metade dos clientes
    if (i % 2 === 0) {
      const enderecoSecundario = enderecosPorCliente[(i + 1) % enderecosPorCliente.length];
      await prisma.enderecos.create({
        data: {
          ...enderecoSecundario,
          principal: false,
          clienteId: cliente.id,
        },
      });
      count++;
    }
  }

  console.log(`- ${count} addresses created for ${clientes.length} clients`);
}
