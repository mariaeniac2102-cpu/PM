Algoritmo "maior_menor"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 


   valor: inteiro

Inicio

   repita
      escreva("Digite o valor do saque: ")
      leia(valor)
   ate valor > 0

   escreval("Notas de 100: ", valor div 100)
   valor <- valor mod 100

   escreval("Notas de 50: ", valor div 50)
   valor <- valor mod 50

   escreval("Notas de 20: ", valor div 20)
   valor <- valor mod 20

   escreval("Notas de 10: ", valor div 10)
   valor <- valor mod 10

   escreval("Notas de 5: ", valor div 5)
   valor <- valor mod 5

   escreval("Notas de 2: ", valor div 2)
   valor <- valor mod 2

   escreval("Notas de 1: ", valor)

fimalgoritmo