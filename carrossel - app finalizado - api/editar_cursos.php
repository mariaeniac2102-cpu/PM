
<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function responder($statusHttp, $dados) {
    http_response_code($statusHttp);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

if (
    $_SERVER["REQUEST_METHOD"] !== "PUT" &&
    $_SERVER["REQUEST_METHOD"] !== "POST"
) {
    responder(405, [
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use PUT para editar."
    ]);
}

require_once "config.php";

$dados = json_decode(file_get_contents("php://input"), true);

if (!is_array($dados)) {
    $dados = $_POST;
}

$idCurso = intval(
    $dados["id_curso"] ?? $dados["id"] ?? 0
);

$curso = trim($dados["curso"] ?? "");

$cargaHoraria = filter_var(
    $dados["carga_horaria"] ?? null,
    FILTER_VALIDATE_INT
);

$duracao = trim($dados["duracao"] ?? "");
$descricao = trim($dados["descricao"] ?? "");

$idCoordenador = intval(
    $dados["id_coordenador"] ?? 0
);

// Valida o ID do curso
if ($idCurso <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "ID do curso inválido."
    ]);
}

// Valida o nome do curso
if ($curso === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe o nome do curso."
    ]);
}

if (strlen($curso) > 30) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O nome do curso deve possuir no máximo 30 caracteres."
    ]);
}

// Valida a carga horária
if ($cargaHoraria === false || $cargaHoraria <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe uma carga horária válida."
    ]);
}

// Valida a duração
if ($duracao === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe a duração do curso."
    ]);
}

if (strlen($duracao) > 20) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "A duração deve possuir no máximo 20 caracteres."
    ]);
}

// Valida a descrição
if (strlen($descricao) > 200) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "A descrição deve possuir no máximo 200 caracteres."
    ]);
}

// Valida o coordenador
if ($idCoordenador <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Selecione um coordenador válido."
    ]);
}

try {

    $pdo->beginTransaction();

    // Busca o curso e seu status atual
    $stmtBusca = $pdo->prepare("
        SELECT id_curso, status
        FROM cursos
        WHERE id_curso = ?
        LIMIT 1
    ");

    $stmtBusca->execute([$idCurso]);

    $cursoExistente = $stmtBusca->fetch(PDO::FETCH_ASSOC);

    if (!$cursoExistente) {
        $pdo->rollBack();

        responder(404, [
            "sucesso" => false,
            "mensagem" => "Curso não encontrado."
        ]);
    }

    // Verifica se o coordenador existe e está ativo
    $stmtCoordenador = $pdo->prepare("
        SELECT id_coordenador
        FROM coordenadores
        WHERE id_coordenador = ?
          AND status = 'A'
        LIMIT 1
    ");

    $stmtCoordenador->execute([$idCoordenador]);

    $coordenadorExistente = $stmtCoordenador->fetch(PDO::FETCH_ASSOC);

    if (!$coordenadorExistente) {
        $pdo->rollBack();

        responder(400, [
            "sucesso" => false,
            "mensagem" => "O coordenador selecionado não existe ou está inativo."
        ]);
    }

    // Atualiza somente o curso selecionado
    // O status original é preservado
    $stmtAtualiza = $pdo->prepare("
        UPDATE cursos
        SET curso = ?,
            carga_horaria = ?,
            duracao = ?,
            descricao = ?,
            id_coordenador = ?
        WHERE id_curso = ?
    ");

    $stmtAtualiza->execute([
        $curso,
        $cargaHoraria,
        $duracao,
        $descricao !== "" ? $descricao : null,
        $idCoordenador,
        $idCurso
    ]);

    $pdo->commit();

    responder(200, [
        "sucesso" => true,
        "mensagem" => "Curso atualizado com sucesso.",
        "id_curso" => $idCurso,
        "status" => $cursoExistente["status"]
    ]);

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Erro ao editar curso: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao editar curso. Verifique os dados enviados e a estrutura do banco."
    ]);
}

?>
