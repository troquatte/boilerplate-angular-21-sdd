Cadastro de clientes

Objetivo: centralizar todas as informações comerciais e operacionais do cliente.

Inclui:

Criar cliente.
Editar cliente.
Buscar cliente.
Listar clientes.
Desativar cliente.

Entidades:
Customer
CustomerAddress

Customer: dados mínimos do cliente
Nome completo
Telefone
CPF

CustomerAddress: Cadastrar múltiplos endereços.
"cep"
"logradouro"
"complemento"
"unidade"
"bairro"
"localidade": "São José dos Campos",
"uf"
"estado"

- Tem que ser relacionado com User no prisma,
- Eu deixaria CPF opcionais inicialmente.
