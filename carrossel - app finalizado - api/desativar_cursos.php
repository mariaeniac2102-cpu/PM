
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
        "mensagem" => "Método não permitido. Use PUT para desativar."
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

if ($idCurso <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "ID do curso inválido."
    ]);
}

try {

    // Verifica se o curso existe
    $stmtBusca = $pdo->prepare("
        SELECT id_curso, status
        FROM cursos
        WHERE id_curso = ?
        LIMIT 1
    ");

    $stmtBusca->execute([$idCurso]);

    $curso = $stmtBusca->fetch(PDO::FETCH_ASSOC);

    if (!$curso) {
        responder(404, [
            "sucesso" => false,
            "mensagem" => "Curso não encontrado."
        ]);
    }

    // Verifica se o curso já está inativo
    if ($curso["status"] === "I") {
        responder(200, [
            "sucesso" => true,
            "mensagem" => "Este curso já está desativado.",
            "id_curso" => $idCurso,
            "status" => "I"
        ]);
    }

    // Desativa somente o curso selecionado
    // Não exclui nem altera seus vínculos
    $stmtDesativar = $pdo->prepare("
        UPDATE cursos
        SET status = 'I'
        WHERE id_curso = ?
    ");

    $stmtDesativar->execute([$idCurso]);

    responder(200, [
        "sucesso" => true,
        "mensagem" => "Curso desativado com sucesso.",
        "id_curso" => $idCurso,
        "status" => "I"
    ]);

} catch (Throwable $e) {

    error_log("Erro ao desativar curso: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao desativar curso. Tente novamente."
    ]);
}

?>
