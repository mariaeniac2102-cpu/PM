
<?php

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: POST, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");

// Trata requisição OPTIONS do navegador
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Só permite POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use POST para cadastrar."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

require_once "config.php";

try {

    // Recebe os dados enviados pelo aplicativo
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!$dados) {
        throw new Exception("Não foram recebidos dados válidos.");
    }

    // Recebe e organiza os campos
    $curso = trim($dados["curso"] ?? "");
    $cargaHoraria = $dados["carga_horaria"] ?? "";
    $duracao = trim($dados["duracao"] ?? "");
    $descricao = trim($dados["descricao"] ?? "");
    $idCoordenador = $dados["id_coordenador"] ?? "";

    // Valida os campos obrigatórios
    if (
        $curso === "" ||
        $cargaHoraria === "" ||
        $duracao === "" ||
        $idCoordenador === ""
    ) {
        throw new Exception("Preencha todos os campos obrigatórios.");
    }

    // Valida os tamanhos dos campos
    if (mb_strlen($curso) > 30) {
        throw new Exception("O nome do curso deve ter até 30 caracteres.");
    }

    if (mb_strlen($duracao) > 20) {
        throw new Exception("A duração deve ter até 20 caracteres.");
    }

    if (mb_strlen($descricao) > 200) {
        throw new Exception("A descrição deve ter até 200 caracteres.");
    }

    // Valida os valores numéricos
    if (
        !filter_var($cargaHoraria, FILTER_VALIDATE_INT) ||
        (int)$cargaHoraria <= 0
    ) {
        throw new Exception("Informe uma carga horária válida.");
    }

    if (
        !filter_var($idCoordenador, FILTER_VALIDATE_INT) ||
        (int)$idCoordenador <= 0
    ) {
        throw new Exception("Selecione um coordenador válido.");
    }

    // Verifica se o coordenador existe e está ativo
    $sqlCoordenador = "
        SELECT co.id_coordenador

        FROM coordenadores co

        INNER JOIN professores p
            ON co.id_professor = p.id_professor

        WHERE co.id_coordenador = :id_coordenador
        AND co.status = 'A'
        AND p.status = 'A'
    ";

    $stmtCoordenador = $pdo->prepare($sqlCoordenador);

    $stmtCoordenador->execute([
        ":id_coordenador" => $idCoordenador
    ]);

    if (!$stmtCoordenador->fetch(PDO::FETCH_ASSOC)) {
        throw new Exception("O coordenador selecionado não está ativo ou não existe.");
    }

    // Insere o novo curso
    // O id_curso será gerado automaticamente pelo banco
    $sql = "
        INSERT INTO cursos (
            id_coordenador,
            curso,
            carga_horaria,
            duracao,
            descricao,
            status
        ) VALUES (
            :id_coordenador,
            :curso,
            :carga_horaria,
            :duracao,
            :descricao,
            'A'
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id_coordenador" => $idCoordenador,
        ":curso" => $curso,
        ":carga_horaria" => $cargaHoraria,
        ":duracao" => $duracao,
        ":descricao" => $descricao !== "" ? $descricao : null
    ]);

    // Retorna a confirmação do cadastro
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Curso cadastrado com sucesso!",
        "id_curso" => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    error_log("Erro ao cadastrar curso: " . $e->getMessage());

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar curso."
    ], JSON_UNESCAPED_UNICODE);
}

?>
