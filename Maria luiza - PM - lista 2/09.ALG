Algoritmo "verificaçao_numero_primo"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
   numero, i, divisores: inteiro


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
  escreva("Digite um número inteiro maior que 1: ")
   leia(numero)

   se (numero <= 1) entao
      escreval("O número deve ser maior que 1.")
   senao
      divisores <- 0

      para i de 1 ate numero faca
         se (numero % i = 0) entao
            divisores <- divisores + 1
         fimse
      fimpara

      se (divisores = 2) entao
         escreval("O número", numero, " é primo.")
      senao
         escreval("O número", numero, " não é primo.")
      fimse
   fimse

fimalgoritmo
