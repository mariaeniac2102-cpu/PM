Algoritmo "tabuada_personalizada"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
    num, limite, i, resultado: inteiro


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
  escreva("Digite o numero para a tabuada: ")
    leia(num)
  escreva("Digite o limite final da tabuada: ")
    leia(limite)

   escreval("--- Tabuada do ", num, " ate ", limite, " ---")

   para i de 1 ate limite faca
      resultado <- num * i
      escreval(num, " x ", i, " = ", resultado)
   fimpara

fimalgoritmo
