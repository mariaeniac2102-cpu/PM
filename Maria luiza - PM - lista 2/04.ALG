Algoritmo "contagem_intervalo"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 27/02/2026
Var
// Seção de Declarações das variáveis 
   cont, num: inteiro
   faixa1, faixa2, faixa3: inteiro
Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
   faixa1 <- 0 // 0 a 25
   faixa2 <- 0 // 26 a 50
   faixa3 <- 0 // Acima de 50

   para cont de 1 ate 30 faca
      escreva("Digite o ", cont, "º número: ")
      leia(num)


      se (num >= 0) e (num <= 25) entao
         faixa1 <- faixa1 + 1
      senao
         se (num >= 26) e (num <= 50) entao
            faixa2 <- faixa2 + 1
         senao
            se (num > 50) entao
               faixa3 <- faixa3 + 1
            fimse
         fimse
      fimse
   fimpara

   escreva("Entre 0 e 25: ", faixa1)
   escreva("   Entre 26 e 50: ", faixa2)
   escreva("   Acima de 50: ", faixa3)
fimalgoritmo
