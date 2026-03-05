Algoritmo "maior_menor_valor"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 25/02/2026
Var
// Seção de Declarações das variáveis 
     numero, i: inteiro
     menor, maior: inteiro
Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
     escreva("Digite o 1° numero: ")
      leia(numero)
      maior <- numero
      menor <- numero
     
     para i de 2 ate 10 faca
       escreva("Digite o", i, "° numero: ")
         leia(numero)
     
     se numero > maior entao
        maior <- numero
        
     fimse
     
     se numero < menor entao
        menor <- numero
        
     fimse
  fimpara
     
     escreva("O maior numero digitado foi: ", maior)
     escreva("O menor numero digitado foi: ", menor)


Fimalgoritmo