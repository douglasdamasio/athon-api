# Athon Tech API Node.js

## Instruções iniciais:
Importe o dump do banco de dados (self-contained file) no mysql e suba o
servidor local para realizar os testes. Use a biblioteca “mysql” no node.

**OBS: Não use ORM.**

## Projeto:
Dado o modelo acima, suba uma API REST em Node.JS contendo rotas com as
funcionalidades a seguir. Caso sinta necessidade de alguma rota que não está
presente nos requisitos abaixo, sinta-se livre para fazê-la.
1. Trazer todas as armas que já foram utilizadas em algum crime.
2. Trazer todas as informações acerca de um determinado crime (vítimas, armas,
criminosos, país e data).
3. Inserir um novo crime com todas as suas informações agregadas (armas,
vítimas, criminosos);
4. Remover um crime do sistema.
-----------------------------------------------------------
## Resolução

### 1. Trazer todas as armas que já foram utilizadas em algum crime.
Utilize a rota abaixo com o método `GET` para receber em formato *JSON* todas as armas que já foram utilizadas em algum crime:

`/weapon`

Ou utilize a rota abaixo caso queria saber a arma de um crime especifico.

`/weapon/[id]`

Onde *[ id ]* é passado o ID do Crime

**Obs.** Remova os colchetes

### 2. Trazer todas as informações acerca de um determinado crime (vítimas, armas, criminosos, país e data).

Utiltiza a rota abaixo com o método `GET` para receber em formato *JSON* todos os crimes cadastrados

`/crimes`

Ou utilize a rota abaixo para saber todas informações acerca de um determinado crime

`/crimes/[id]`

Onde *[ id ]* é passado o ID do Crime

### 3. Inserir um novo crime com todas as suas informações agregadas (armas, vítimas, criminosos)

Para a inserção de um novo crime siga o padrão do arquivo *JSON* abaixo

{

    "pais": "[PAÍS]",
    "data": "[yyyy-mm-dd HH:MM:SS]",
    "vitima": "[NOME_VITIMA]",
    "criminoso": "[NOME_CRIMINOSO]",
    "tipoCrime": "[TIPO_DO_CRIME]",
    "arma": "[ARMA]",	
    "tipoArma": "[TIPO_ARMA]"
}

Onde as variaveis entre colchetes devem ser substituidas pelos dados a serem inseridos sobre o crime.

Utilize a rota abaixo com o método `POST`:

`/crime/insert`

### 4. Remover um crime do sistema

No caso da remoção utilize o método `DELETE` passando o id do crime no parametro da rota, da seguinte forma:

`/crime/delete/[id]`

Onde *[ id ]* é passado o ID do Crime ao qual deseja deletar.

_________________________________________________

#### NOTA

Todas as rotas partem da origem `/api` (rota raiz) e caso queira fazer um teste de comunicação utilize a rota raiz para obeter a mensagem no formato *JSON*:

*A ATHON_API está pronta!*

*Douglas Damasio*