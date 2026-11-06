
<?php

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");

// Trata requisição OPTIONS do navegador
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Só permite GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use GET para consultar."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

require_once "config.php";

try {

    // Consulta os cursos cadastrados
    $sqlCursos = "
        SELECT
            c.id_curso,
            c.id_coordenador,
            c.curso,
            c.carga_horaria,
            c.duracao,
            c.descricao,
            c.status,
            dp.nome AS nome_coordenador

        FROM cursos c

        LEFT JOIN coordenadores co
            ON c.id_coordenador = co.id_coordenador

        LEFT JOIN professores p
            ON co.id_professor = p.id_professor

        LEFT JOIN dados_pessoais dp
            ON p.id_dados = dp.id_dados

        WHERE c.status = 'A'

        ORDER BY c.curso ASC
    ";

    $stmtCursos = $pdo->query($sqlCursos);

    $cursos = $stmtCursos->fetchAll(PDO::FETCH_ASSOC);


    // Consulta os coordenadores ativos para a lista de seleção
    $sqlCoordenadores = "
        SELECT
            co.id_coordenador,
            dp.nome

        FROM coordenadores co

        INNER JOIN professores p
            ON co.id_professor = p.id_professor

        INNER JOIN dados_pessoais dp
            ON p.id_dados = dp.id_dados

        WHERE co.status = 'A'
        AND p.status = 'A'

        ORDER BY dp.nome ASC
    ";

    $stmtCoordenadores = $pdo->query($sqlCoordenadores);

    $coordenadores = $stmtCoordenadores->fetchAll(PDO::FETCH_ASSOC);


    // Retorna cursos e coordenadores
    echo json_encode([
        "sucesso" => true,
        "quantidade" => count($cursos),
        "cursos" => $cursos,
        "coordenadores" => $coordenadores
    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    http_response_code(500);

    error_log("Erro ao consultar cursos: " . $e->getMessage());

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao consultar cursos."
    ], JSON_UNESCAPED_UNICODE);
}

?>
