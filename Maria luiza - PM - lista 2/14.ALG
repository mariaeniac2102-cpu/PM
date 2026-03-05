Algoritmo "eleicao_simples"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 05/03/2026
var
   voto, cand1, cand2, cand3, total_votos : inteiro
   p1, p2, p3 : real

inicio
   cand1 <- 0
   cand2 <- 0
   cand3 <- 0
   total_votos <- 0
   voto <- 1

   enquanto voto <> 0 faca
      escreval("VOTE: 1-João | 2-Maria | 3-José | 0-Fim")
      leia(voto)

      se voto <> 0 entao
         total_votos <- total_votos + 1
         se voto = 1 entao
            cand1 <- cand1 + 1
         senao
            se voto = 2 entao
               cand2 <- cand2 + 1
            senao
               se voto = 3 entao
                  cand3 <- cand3 + 1
               senao
                  escreval("Voto Inválido!")
                  total_votos <- total_votos - 1
               fimse
            fimse
         fimse
      fimse
   fimenquanto

   se total_votos > 0 entao
      p1 <- (cand1 / total_votos) * 100
      p2 <- (cand2 / total_votos) * 100
      p3 <- (cand3 / total_votos) * 100

      escreval("Candidato 1: ", cand1, " votos (", p1:2:1, "%)")
      escreval("Candidato 2: ", cand2, " votos (", p2:2:1, "%)")
      escreval("Candidato 3: ", cand3, " votos (", p3:2:1, "%)")

      se (cand1 > cand2) e (cand1 > cand3) entao
         escreval("Vencedor: Candidato 1")
      senao
         se (cand2 > cand1) e (cand2 > cand3) entao
            escreval("Vencedor: Candidato 2")
         senao
            se (cand3 > cand1) e (cand3 > cand2) entao
               escreval("Vencedor: Candidato 3")
            senao
               escreval("Houve um empate!")
            fimse
         fimse
      fimse
   fimse
fimalgoritmo