Algoritmo "calcula_IMC"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 25/02/2026
Var
// Seção de Declarações das variáveis 
      peso, altura, imc: real
Inicio
// Seção de Comandos, procedimento, funções, operadores, etc... 
     // Seção de Comandos, procedimento, funções, operadores, etc...
    escreva("Informe o peso (kg): ")
   leia(peso)

   escreva("Informe a altura (m): ")
   leia(altura)

   // Cálculo do IMC
   imc <- peso / (altura * altura)

   // Classificação do IMC
   se imc < 18.5 entao
      escreva("IMC = ", imc:5:2, " - Abaixo do peso")
   senao
      se imc < 25 entao
         escreva("IMC = ", imc:5:2, " - Peso normal")
      senao
         se imc < 30 entao
            escreva("IMC = ", imc:5:2, " - Sobrepeso")
         senao
            se imc < 35 entao
               escreva("IMC = ", imc:5:2, " - Obesidade grau I")
            senao
               se imc < 40 entao
                  escreva("IMC = ", imc:5:2, " - Obesidade grau II")
               senao
                  escreva("IMC = ", imc:5:2, " - Obesidade grau III (mórbida)")
               fimse
            fimse
         fimse
      fimse
   fimse


Fimalgoritmo