Algoritmo "analise_idade"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 05/03/2026
var
   idade, soma_idades, cont_total, cont_maiores, cont_menores : inteiro
   media, percentual_menores : real

inicio
   soma_idades <- 0
   cont_total <- 0
   cont_maiores <- 0
   cont_menores <- 0
   idade <- 1

   enquanto idade <> 0 faca
      escreval("Digite a idade (ou 0 para encerrar): ")
      leia(idade)

      se idade <> 0 entao
         soma_idades <- soma_idades + idade
         cont_total <- cont_total + 1

         se idade >= 18 entao
            cont_maiores <- cont_maiores + 1
         senao
            cont_menores <- cont_menores + 1
         fimse
      fimse
   fimenquanto

   se cont_total > 0 entao
      media <- soma_idades / cont_total
      percentual_menores <- (cont_menores / cont_total) * 100

      escreval("Média das idades: ", media:2:1)
      escreval("Quantidade de maiores de 18: ", cont_maiores)
      escreval("Percentual de menores de idade: ", percentual_menores:2:1, "%")
   senao
      escreval("Nenhuma idade foi registrada.")
   fimse

fimalgoritmo

