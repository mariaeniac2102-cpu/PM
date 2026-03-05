Algoritmo "sequencia_fibonacci"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 05/03/2026
Var
// Seção de Declarações das variáveis 
   n, cont, a, b, c, pares : inteiro

inicio
   escreval("Quantos termos você quer ver? ")
   leia(n)

   a <- 0
   b <- 1
   pares <- 0

   escreval("Sequência: ")

   para cont de 0 ate n faca
      escreval(a, " ")

      se a % 2 = 0 entao
         pares <- pares + 1
      fimse

      c <- a + b
      a <- b
      b <- c
   fimpara

   escreval("----------------")
   escreval("Quantidade de números pares: ", pares)
fimalgoritmo
