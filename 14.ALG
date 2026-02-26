Algoritmo "desconto_compra"
// 
//  
// Descrição   : Aqui você descreve o que o programa faz! (função)
// Autor(a)    : Nome do(a) aluno(a)
// Data atual  : 23/02/2026
Var
// Seção de Declarações das variáveis
    valor, resultado, valor_desc, desconto: real


Inicio
// Seção de Comandos, procedimento, funções, operadores, etc...
      escreva("Digite o valor da compra: ")
      leia(valor)
      se valor < 100 entao
      escreva("O antecessor é: ", valor, " , e nao tera desconto)
      escreval()
      senao
      desconto <-0.10
      valor_desc <- valor * desconto
      resultado <- valor - valor_desc
      escreva("O valor da sua compra com o desconto é:" , resultado)
      
      
      fimse


Fimalgoritmo