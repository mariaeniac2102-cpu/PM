<?php
 
header("Content-Type: application/json; charset=utf-8");
 
header("Access-Control-Allow-Origin: *");
 
header(
    "Access-Control-Allow-Methods: PUT, POST, OPTIONS"
);
 
header(
    "Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"
);
 
 
// OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
 
    http_response_code(204);
 
    exit;
}
 
 
// Aceita PUT ou POST
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
 
 
// Recebe JSON
$dados = json_decode(
    file_get_contents("php://input"),
    true
);
 
 
// Caso não seja JSON
if (!is_array($dados)) {
 
    $dados = $_POST;
}
 
 
// ID do aluno
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
 
    // Primeiro verifica se o aluno existe (e pega o id_dados junto)
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
 
 
    // Segue em frente mesmo se já estiver 'I': a cascata é idempotente
    // e garante que os dados relacionados fiquem consistentes.
 
 
    // DESATIVA O ALUNO E TUDO QUE ESTÁ LIGADO A ELE
    // Não apaga nenhuma informação, só marca status = 'I'
    $pdo->beginTransaction();
 
    // 1. O próprio aluno
    $stmt = $pdo->prepare("
        UPDATE alunos
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    // 2. Dados pessoais (nome, cpf, email...)
    $stmt = $pdo->prepare("
        UPDATE dados_pessoais
        SET status = 'I'
        WHERE id_dados = ?
    ");
    $stmt->execute([$aluno["id_dados"]]);
 
 
    // 3. Telefones ligados a esses dados pessoais
    $stmt = $pdo->prepare("
        UPDATE telefones
        SET status = 'I'
        WHERE id_dados = ?
    ");
    $stmt->execute([$aluno["id_dados"]]);
 
 
    // 4. Vínculo(s) com responsável(is) -- não mexe no cadastro do
    // responsável em si, só na ligação dele com este aluno
    $stmt = $pdo->prepare("
        UPDATE alunos_responsavel
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    // 5. Matrícula(s) do aluno
    $stmt = $pdo->prepare("
        UPDATE matriculas
        SET status = 'I'
        WHERE id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    // 6. Boletins ligados às matrículas do aluno
    $stmt = $pdo->prepare("
        UPDATE boletins b
        INNER JOIN matriculas m ON b.id_matricula = m.id_matricula
        SET b.status = 'I'
        WHERE m.id_aluno = ?
    ");
    $stmt->execute([$idAluno]);
 
 
    // 7. Disciplinas dentro desses boletins
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