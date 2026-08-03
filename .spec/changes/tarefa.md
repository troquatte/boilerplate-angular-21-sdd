Correção de bug
Quando estou logado e entro em http://localhost:4200/admin/clientes ele buga deixando a tela em branco

Mas quando acesso http://localhost:4200/admin/dashboard funciona normal.

A solução é entrar armazenar a rota em algum lugar "localstorage" ou outro melhor, assim que a aplicação carregar envia para rota do acesso /admin/clientes

O erro pode aparecer se eu recarrego a pagina ou se eu abro outra aba com a url especifica
