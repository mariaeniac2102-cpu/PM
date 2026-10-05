# Schoolar Carrossel

## Sobre o projeto
O Schoolar Carrossel é um aplicativo para celular feito para ajudar no dia a dia da gestão escolar. 
Eu desenvolvi o app usando React Native com Expo na parte visual, e criei uma API em PHP para cuidar da comunicação com o banco de dados MySQL. 
Para conseguir testar tudo no celular enquanto o código rodava no meu computador, usei o XAMPP como servidor local e o ngrok para criar o link que conecta o aplicativo ao banco de dados.

## Funcionalidades
- Cadastro de novos estudantes no sistema
- Consulta de alunos cadastrados
- Alteração de dados dos alunos
- Opção para desativar o cadastro de um aluno
- Transição suave entre as telas do app
- Integração direta com o backend em PHP

## Tecnologias utilizadas
- React Native
- Expo
- JavaScript
- React Navigation
- PHP
- MySQL
- XAMPP
- ngrok

## Estrutura do projeto
- `screens/` → Onde ficam as telas do aplicativo.
- `services/` → Arquivos que fazem as requisições para a API.
- `backend/` → Os scripts em PHP que rodam no servidor.
- `assets/` → Imagens, ícones e arquivos visuais.
- `App.js` → Arquivo principal que inicia o app e configura a navegação.

## Como executar
Para rodar o projeto na sua máquina, primeiro instale as dependências com o comando:
```bash
npm install
```

Depois, para abrir o servidor do Expo, rode:
```bash
npx expo start
```

### Configurando a API:
1. Abra o painel do XAMPP e inicialize os serviços do Apache e do MySQL.
2. Com o servidor local ativo, abra o ngrok para criar o túnel de acesso externo.
3. Copie o endereço gerado pelo ngrok e cole dentro do arquivo `services/api.js` para o app conseguir se conectar.

## Autor
Maria Luiza Barbosa Maciel — 3º DS (Desenvolvimento de Sistemas)
