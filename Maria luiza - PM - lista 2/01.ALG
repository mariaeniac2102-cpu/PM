Algoritmo "soma_pares"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 

    i, num, spares, conimpar: inteiro

Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
  spares <- 0
   conimpar <- 0

   para i de 1 ate 20 faca
      escreva("Digite o ", i, "º número: ")
      leia(num)

      se (num mod 2 = 0) entao
         spares <- spares + num
      senao
         conimpar <- conimpar + 1
      fimse
   fimpara

   escreval("A soma dos números pares é: ", spares)
   escreval("A quantidade de números ímpares é: ", conimpar)



Fimalgoritmo