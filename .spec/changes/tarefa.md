Criação da paginação front e back

No front precisamos criar uma paginação:
1 - Precisamos criar um componente e uma service que sirva para todos os outros modulos que vão páginar
2 - Comunicação via service + api

No back precisamos que CLIENTE seja paginado e o campo de busca funcione para cpf ou telefone

contrato:
// Contrato para todas outras que tenham paginação
page=1 ( default 1 )
pageSize=10 ( default 10 )

// Esse search telefone ou cpf apenas para CLIENT
search= ( telefone ou cpf )
