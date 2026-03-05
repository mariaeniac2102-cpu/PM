Algoritmo "maior_menor"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
     cont, num, maior, menor: inteiro

Inicio
// Seção de Comandos, procedimento, funções, operadores, etc... 

   para cont de 1 ate 15 faca
      escreva("Digite o ", cont, "º número(negativo e positivo): ")
      leia(num)

      // Se for o primeiro número, ele inicia as variáveis
      se (cont = 1) entao
         maior <- num
         menor <- num
      senao
         // Comparações para os números seguintes
         se (num > maior) entao
            maior <- num
         fimse
         se (num < menor) entao
            menor <- num
         fimse
      fimse
   fimpara

   escreval("O maior número é: ", maior)
   escreval("O menor número é: ", menor)
fimalgoritmo



Fimalgoritmo