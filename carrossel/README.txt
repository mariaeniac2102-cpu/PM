PHP - APP CARROSSEL - MÓDULO ALUNOS

1. COPIAR OS ARQUIVOS

Copie estes arquivos para:

C:\xampp\htdocs\carrossel

Arquivos:
- config.php
- alunos.php
- cadastrar_aluno.php
- editar_aluno.php
- excluir_aluno.php


2. BANCO DE DADOS

Este PHP foi feito com base na estrutura real do banco:

bd_escola_atualizado

A tabela alunos possui:
- id_aluno
- id_endereco
- id_dados
- data_nascimento

O cadastro também utiliza:
- dados_pessoais
- enderecos
- telefones

Não execute nenhum banco novo criado por este pacote.


3. XAMPP

Deixe:
- Apache ligado
- MySQL ligado


4. TESTE NO NAVEGADOR

Consulta:

http://localhost/carrossel/alunos.php

Se estiver funcionando, deve aparecer um JSON com os alunos.


5. ENDPOINTS

GET:
http://localhost/carrossel/alunos.php

POST:
http://localhost/carrossel/cadastrar_aluno.php

PUT ou POST:
http://localhost/carrossel/editar_aluno.php

DELETE ou POST:
http://localhost/carrossel/excluir_aluno.php


6. DADOS DO CADASTRO

A tela atual do Snack possui:
- nome
- cpf
- data de nascimento
- email
- telefone

O banco, porém, também possui endereço relacionado ao aluno.

Por isso, o cadastro PHP aceita:
- id_bairro
- rua
- cep

Quando esses campos não são enviados pelo Snack, o PHP usa temporariamente:
- id_bairro = 1
- rua = "Não informado"
- cep = "00000000"

Depois podemos acrescentar os campos de endereço na tela do Snack.


7. IMPORTANTE SOBRE EXCLUSÃO

O banco possui relacionamentos entre alunos e outras tabelas.

Se o aluno possuir matrícula ou responsável vinculado, o PHP não deixa excluir para não quebrar os relacionamentos do banco.


8. PRÓXIMO PASSO

Depois de colocar os arquivos no XAMPP e testar alunos.php no navegador, podemos conectar o Snack a esses arquivos usando fetch().
