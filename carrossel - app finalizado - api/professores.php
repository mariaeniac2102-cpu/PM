
<?php

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");

header(
    "Access-Control-Allow-Methods: GET, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"
);


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

    $sql = "
        SELECT
            p.id_professor,
            p.id_endereco,
            p.id_dados,
            p.status,

            dp.nome,
            dp.cpf,
            dp.email,
            dp.formacao,

            t.numero_telefone AS telefone,

            e.rua,
            e.cep,
            e.id_bairro,
            b.bairro AS bairro,

            CASE
                WHEN c.id_coordenador IS NOT NULL
                     AND c.status = 'A'
                THEN 1
                ELSE 0
            END AS eh_coordenador

        FROM professores p

        INNER JOIN dados_pessoais dp
            ON p.id_dados = dp.id_dados

        LEFT JOIN telefones t
            ON dp.id_dados = t.id_dados
            AND t.status = 'A'

        INNER JOIN enderecos e
            ON p.id_endereco = e.id_endereco

        LEFT JOIN bairros b
            ON e.id_bairro = b.id_bairro

        LEFT JOIN coordenadores c
            ON c.id_professor = p.id_professor
            AND c.status = 'A'

        WHERE p.status = 'A'

        ORDER BY dp.nome ASC
    ";


    $stmt = $pdo->query($sql);

    $professores = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // Retorna os dados dos professores e informa
    // se cada um possui um vínculo ativo de coordenador.

    echo json_encode([

        "sucesso" => true,

        "quantidade" => count($professores),

        "professores" => $professores

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    http_response_code(500);

    error_log("Erro ao consultar professores: " . $e->getMessage());

    echo json_encode([

        "sucesso" => false,

        "mensagem" => "Erro ao consultar professores."

    ], JSON_UNESCAPED_UNICODE);
}

?>
