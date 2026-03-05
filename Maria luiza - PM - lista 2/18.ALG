Algoritmo "validacao_senha"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 05/03/2026
var
   senha : caracter
   tentativas : inteiro

inicio
   tentativas <- 0
   senha <- ""

   enquanto senha <> "1234" faca
      escreval("Digite a senha: ")
      leia(senha)
      tentativas <- tentativas + 1

      se senha <> "1234" entao
         escreval("Senha incorreta!")
      fimse
   fimenquanto

   escreval("Acesso concedido!")
   escreval("Total de tentativas: ", tentativas)
fimalgoritmo