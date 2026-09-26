<?php

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");

header(
    "Access-Control-Allow-Methods: GET, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"
);


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(204);

    exit;
}


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
            a.id_aluno,
            a.id_endereco,
            a.id_dados,
            a.data_nascimento,
            a.status,

            dp.nome,
            dp.cpf,
            dp.email,

            t.numero_telefone AS telefone,

            e.rua,
            e.cep,
            e.id_bairro

        FROM alunos a

        INNER JOIN dados_pessoais dp
            ON a.id_dados = dp.id_dados

        LEFT JOIN telefones t
            ON dp.id_dados = t.id_dados

        INNER JOIN enderecos e
            ON a.id_endereco = e.id_endereco

        WHERE a.status = 'A'

        ORDER BY dp.nome ASC
    ";


    $stmt = $pdo->query($sql);

    $alunos = $stmt->fetchAll();


    foreach ($alunos as &$aluno) {

        if (!empty($aluno["data_nascimento"])) {

            $data = DateTime::createFromFormat(
                "Y-m-d",
                $aluno["data_nascimento"]
            );

            if ($data) {

                $aluno["data_nascimento"] =
                    $data->format("d/m/Y");
            }
        }
    }


    echo json_encode([

        "sucesso" => true,

        "quantidade" => count($alunos),

        "alunos" => $alunos

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "sucesso" => false,

        "mensagem" => "Erro ao consultar alunos.",

        "erro" => $e->getMessage()

    ], JSON_UNESCAPED_UNICODE);
}

?>