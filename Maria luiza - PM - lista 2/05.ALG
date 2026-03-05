Algoritmo "fatorial_validaçao"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
n, i: inteiro
   fatorial: real


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
  repita
      escreva("Digite um numero inteiro positivo: ")
      leia(n)

      se (n < 0) entao
         escreval("Erro: O numero deve ser positivo.")
      fimse
   ate (n >= 0)

   fatorial <- 1

   se (n > 0) entao
      para i de 1 ate n faca
         fatorial <- fatorial * i
      fimpara
   fimse

      escreval("O fatorial de ", n, " e: ", fatorial)

fimalgoritmo
