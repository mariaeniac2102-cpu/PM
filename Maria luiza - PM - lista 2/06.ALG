Algoritmo "sequencia_condiçao"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
   num, soma, contador: inteiro
   media: real


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
  soma <- 0
   contador <- 0

   escreva("Digite um numero (negativo para sair): ")
   leia(num)

   enquanto (num >= 0) faca
      soma <- soma + num
      contador <- contador + 1

      escreva("Digite o proximo numero: ")
      leia(num)
   fimenquanto

   se (contador > 0) entao
      media <- soma / contador
      escreval("Soma dos positivos: ", soma)
      escreval("Media dos numeros: ", media:2:2)
   senao
      escreval("Nenhum numero positivo foi digitado.")

   fimse

fimalgoritmo
