<?php
 
header("Content-Type: application/json; charset=utf-8");
 
header("Access-Control-Allow-Origin: *");
 
header(
    "Access-Control-Allow-Methods: PUT, POST, OPTIONS"
);
 
header(
    "Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"
);
 
 
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
 
    http_response_code(204);
 
    exit;
}
 
 
if (
    $_SERVER["REQUEST_METHOD"] !== "PUT"
    &&
    $_SERVER["REQUEST_METHOD"] !== "POST"
) {
 
    http_response_code(405);
 
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use PUT para desativar."
    ], JSON_UNESCAPED_UNICODE);
 
    exit;
}
 
 
require_once "config.php";
 
 
$dados = json_decode(
    file_get_contents("php://input"),
    true
);
 
 
if (!is_array($dados)) {
 
    $dados = $_POST;
}
 
 
$idAluno = intval(
    $dados["id_aluno"]
    ?? $dados["id"]
    ?? 0
);
 
 
if ($idAluno <= 0) {
 
    http_response_code(400);
 
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "ID do aluno inválido."
    ], JSON_UNESCAPED_UNICODE);
 
    exit;
}
 
 
try {
 
    $sqlBusca = "
        SELECT
            id_aluno,
            id_dados,
            status
        FROM alunos
        WHERE id_aluno = ?
        LIMIT 1
    ";
 
    $stmtBusca = $pdo->prepare($sqlBusca);
 
    $stmtBusca->execute([
        $idAluno
    ]);
 
    $aluno = $stmtBusca->fetch();
 
 
    if (!$aluno) {
 
        http_response_code(404);
 
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Aluno não encontrado."
        ], JSON_UNESCAPED_UNICODE);
 
        exit;
    }
 
 
 
    $pdo->beginTransaction();
 
    $stmt = $pdo->prepare("
        UPDATE alunos
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    $stmt = $pdo->prepare("
        UPDATE dados_pessoais
        SET status = 'I'
        WHERE id_dados = ?
    ");
    $stmt->execute([$aluno["id_dados"]]);
 
 
    $stmt = $pdo->prepare("
        UPDATE telefones
        SET status = 'I'
        WHERE id_dados = ?
    ");
    $stmt->execute([$aluno["id_dados"]]);
 
     $stmt = $pdo->prepare("
        UPDATE alunos_responsavel
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    $stmt = $pdo->prepare("
        UPDATE matriculas
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    $stmt = $pdo->prepare("
        UPDATE boletins b
        INNER JOIN matriculas m ON b.id_matricula = m.id_matricula
        SET b.status = 'I'
        WHERE m.id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    $stmt = $pdo->prepare("
        UPDATE boletins_disciplinas bd
        INNER JOIN boletins b ON bd.id_boletim = b.id_boletim
        INNER JOIN matriculas m ON b.id_matricula = m.id_matricula
        SET bd.status = 'I'
        WHERE m.id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    $pdo->commit();
 
 
    echo json_encode([
 
        "sucesso" => true,
 
        "mensagem" => "Aluno e todos os dados relacionados foram desativados com sucesso.",
 
        "id_aluno" => $idAluno,
 
        "status" => "I"
 
    ], JSON_UNESCAPED_UNICODE);
 
 
} catch (PDOException $e) {
 
    if ($pdo->inTransaction()) {
 
        $pdo->rollBack();
    }
 
    http_response_code(500);
 
    echo json_encode([
 
        "sucesso" => false,
 
        "mensagem" => "Erro ao desativar aluno.",
 
        "erro" => $e->getMessage()
 
    ], JSON_UNESCAPED_UNICODE);
}
?>