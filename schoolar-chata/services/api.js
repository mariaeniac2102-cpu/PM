// services/api.js
//
// Ponto único de configuração da API.
// IMPORTANTE: toda vez que você reiniciar o túnel do ngrok (plano gratuito),
// a URL muda. Atualize apenas a constante abaixo — todas as telas usam ela.
const API_URL = 'https://getting-accustom-carbon.ngrok-free.dev/carrossel';
 
async function requisicao(endpoint, options = {}) {
  const resposta = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(options.headers || {}),
    },
    ...options,
  });
 
  const texto = await resposta.text();
 
  let dados;
 
  try {
    dados = texto ? JSON.parse(texto) : {};
  } catch (erro) {
    throw new Error('O servidor não retornou um JSON válido.');
  }
 
  if (!resposta.ok || dados.sucesso === false) {
 
    const mensagemBase = dados.mensagem || `Erro HTTP ${resposta.status}`;
 
    // Em desenvolvimento, o PHP retorna também o campo "erro" (detalhe do PDO).
    // Mostrar isso facilita muito achar a causa real do problema.
    const mensagemCompleta = dados.erro
      ? `${mensagemBase}\n\nDetalhe: ${dados.erro}`
      : mensagemBase;
 
    throw new Error(mensagemCompleta);
  }
 
  return dados;
}
 
// GET /alunos.php -> lista alunos ativos
export async function listarAlunos() {
  return requisicao('alunos.php', {
    method: 'GET',
  });
}
 
// POST /cadastrar_aluno.php
export async function cadastrarAluno(aluno) {
  return requisicao('cadastrar_aluno.php', {
    method: 'POST',
    body: JSON.stringify(aluno),
  });
}
 
// PUT /editar_aluno.php
export async function editarAluno(idAluno, aluno) {
  return requisicao('editar_aluno.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_aluno: idAluno,
      ...aluno,
    }),
  });
}
 
// PUT /desativar_aluno.php  (exclusão fictícia)
export async function desativarAluno(idAluno) {
  return requisicao('desativar_aluno.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_aluno: idAluno,
    }),
  });
}
 