Algoritmo "crescimento_populacional"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
   populacaoA, populacaoB: real
   anos: inteiro


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
   escreva("Qual a população da cidade A: ")
    leia(populacaoA)
   escreva("Qual a população da cidade B: ")
    leia(populacaoB)
   anos <- 0

   enquanto (populacaoA <= populacaoB) faca
      populacaoA <- populacaoA * 1.03
      populacaoB <- populacaoB * 1.015
      anos <- anos + 1
   fimenquanto

   escreval("Serão necessários", anos, " anos para a Cidade A ultrapassar a Cidade B.")
   escreval("População A: ", populacaoA:1:0)
   escreval("População B: ", populacaoB:1:0)


fimalgoritmo
