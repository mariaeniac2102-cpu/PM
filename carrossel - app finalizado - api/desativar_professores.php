
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

$idProfessor = intval(
    $dados["id_professor"] ?? $dados["id"] ?? 0
);

if ($idProfessor <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "ID do professor inválido."
    ]);
}

try {
    $pdo->beginTransaction();

    // Busca o professor e seus dados pessoais
    $stmt = $pdo->prepare("
        SELECT id_professor, id_dados, status
        FROM professores
        WHERE id_professor = ?
        LIMIT 1
    ");

    $stmt->execute([$idProfessor]);
    $professor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$professor) {
        $pdo->rollBack();

        responder(404, [
            "sucesso" => false,
            "mensagem" => "Professor não encontrado."
        ]);
    }

    $idDados = (int) $professor["id_dados"];

    // Desativa o professor
    $stmt = $pdo->prepare("
        UPDATE professores
        SET status = 'I'
        WHERE id_professor = ?
    ");
    $stmt->execute([$idProfessor]);

    // Desativa os dados pessoais somente se não estiverem
    // vinculados a outro professor ou aluno ativo.
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM professores
        WHERE id_dados = ?
          AND status = 'A'
    ");
    $stmt->execute([$idDados]);
    $outrosProfessoresAtivos = (int) $stmt->fetchColumn();

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM alunos
        WHERE id_dados = ?
          AND status = 'A'
    ");
    $stmt->execute([$idDados]);
    $alunosAtivos = (int) $stmt->fetchColumn();

    if ($outrosProfessoresAtivos === 0 && $alunosAtivos === 0) {
        $stmt = $pdo->prepare("
            UPDATE dados_pessoais
            SET status = 'I'
            WHERE id_dados = ?
        ");
        $stmt->execute([$idDados]);

        // Desativa os telefones ligados aos dados pessoais
        $stmt = $pdo->prepare("
            UPDATE telefones
            SET status = 'I'
            WHERE id_dados = ?
        ");
        $stmt->execute([$idDados]);
    }

    // Desativa os vínculos com disciplinas
    $stmt = $pdo->prepare("
        UPDATE Professores_disciplinas
        SET status = 'I'
        WHERE id_professor = ?
    ");
    $stmt->execute([$idProfessor]);

    // Desativa o vínculo de coordenador, se existir
    $stmt = $pdo->prepare("
        UPDATE coordenadores
        SET status = 'I'
        WHERE id_professor = ?
    ");
    $stmt->execute([$idProfessor]);

    // O endereço é mantido como está.

    $pdo->commit();

    responder(200, [
        "sucesso" => true,
        "mensagem" => "Professor e vínculos relacionados desativados com sucesso.",
        "id_professor" => $idProfessor,
        "status" => "I"
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Erro ao desativar professor: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao desativar professor.",
        "erro" => $e->getMessage()
    ]);
}
?>
