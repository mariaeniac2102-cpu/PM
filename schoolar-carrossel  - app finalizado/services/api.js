
// services/api.js
// Ponto único de configuração da API.
// Atualize a URL quando reiniciar o ngrok.

const API_URL = 'https://getting-accustom-carbon.ngrok-free.dev/carrossel';

async function requisicao(endpoint, options = {}) {
  const resposta = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(options.headers || {}),
    },
  });

  const texto = await resposta.text();

  let dados;

  try {
    dados = texto ? JSON.parse(texto) : {};
  } catch (erro) {
    console.log(`Resposta inválida de ${endpoint}:`, texto);

    throw new Error(
      `O servidor não retornou JSON válido. ` +
      `Resposta recebida: ${texto.slice(0, 500)}`
    );
  }

  if (!resposta.ok || dados.sucesso === false) {
    const mensagemBase =
      dados.mensagem || `Erro HTTP ${resposta.status}`;

    const mensagemCompleta = dados.erro
      ? `${mensagemBase}\n\nDetalhe: ${dados.erro}`
      : mensagemBase;

    throw new Error(mensagemCompleta);
  }

  return dados;
}

// ALUNOS

export async function listarAlunos() {
  return requisicao('alunos.php', {
    method: 'GET',
  });
}

export async function cadastrarAluno(aluno) {
  return requisicao('cadastrar_aluno.php', {
    method: 'POST',
    body: JSON.stringify(aluno),
  });
}

export async function editarAluno(idAluno, aluno) {
  return requisicao('editar_aluno.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_aluno: idAluno,
      ...aluno,
    }),
  });
}

export async function desativarAluno(idAluno) {
  return requisicao('desativar_aluno.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_aluno: idAluno,
    }),
  });
}

// PROFESSORES

export async function listarProfessores() {
  return requisicao('professores.php', {
    method: 'GET',
  });
}

export async function cadastrarProfessor(professor) {
  return requisicao('cadastrar_professores.php', {
    method: 'POST',
    body: JSON.stringify(professor),
  });
}

export async function editarProfessor(idProfessor, professor) {
  return requisicao('editar_professores.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_professor: idProfessor,
      ...professor,
    }),
  });
}

export async function desativarProfessor(idProfessor) {
  return requisicao('desativar_professores.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_professor: idProfessor,
    }),
  });
}
// CURSOS

export async function listarCursos() {
  return requisicao('cursos.php', {
    method: 'GET',
  });
}

export async function cadastrarCurso(curso) {
  return requisicao('cadastrar_cursos.php', {
    method: 'POST',
    body: JSON.stringify(curso),
  });
}

export async function editarCurso(idCurso, curso) {
  return requisicao('editar_cursos.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_curso: idCurso,
      ...curso,
    }),
  });
}

export async function desativarCurso(idCurso) {
  return requisicao('desativar_cursos.php', {
    method: 'PUT',
    body: JSON.stringify({
      id_curso: idCurso,
    }),
  });
}