Algoritmo "classificacao_turma "
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 05/03/2026
var
   media : real
   i, aprovados, recuperacao, reprovados : inteiro
   p_aprov, p_recup, p_reprov : real

inicio
   aprovados <- 0
   recuperacao <- 0
   reprovados <- 0

   para i de 1 ate 20 faca
      escreval("Digite a média do aluno ", i, ": ")
      leia(media)

      se media >= 7 entao
         aprovados <- aprovados + 1
      senao
         se media >= 5 entao
            recuperacao <- recuperacao + 1
         senao
            reprovados <- reprovados + 1
         fimse
      fimse
   fimpara

   p_aprov <- (aprovados / 20) * 100
   p_recup <- (recuperacao / 20) * 100
   p_reprov <- (reprovados / 20) * 100

   escreval("Aprovados: ", p_aprov:2:1, "%")
   escreval("Recuperação: ", p_recup:2:1, "%")
   escreval("Reprovados: ", p_reprov:2:1, "%")
fimalgoritmo
