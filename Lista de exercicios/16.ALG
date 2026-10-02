Algoritmo "triangulo"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 25/02/2026
Var
// Seção de Declarações das variáveis
      lado1: real
      lado2: real
      lado3: real

Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
     escreva("Digite o primeiro lado: ")
      leia(lado1)
     
     escreva("Digite o segundo lado: ")
      leia(lado2)
     
     escreva("Digite o terceiro lado: ")
      leia(lado3)
     
     se (lado1 + lado2 > lado3) e (lado1 + lado3 > lado2) entao
          escreva(" Os valores formam um TRIANGULO. ")
          
     se (lado1 = lado2) e (lado2 = lado3) entao
           escreva (" Tipo: EQUILATERO. ")
     
     senao
          se (lado1 = lado2) ou (lado1 = lado3) ou (lado3 = lado2)entao
           escreva("Tipo: ISOCELES. ")
     senao
        escreva("Tipo: ESCALENO. ")
     fimse
    fimse


     senao
        escreva(" Os valores NÃO formam um TRIANGULO. ")

        FIMSE


     


Fimalgoritmo