<?php

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");

header(
    "Access-Control-Allow-Methods: POST, OPTIONS"
);

header(
    "Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"
);


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(204);

    exit;
}


if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use POST para cadastrar."
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


$nome = trim($dados["nome"] ?? "");

$cpf = preg_replace(
    "/\D/",
    "",
    $dados["cpf"] ?? ""
);

$email = trim($dados["email"] ?? "");

$telefone = trim($dados["telefone"] ?? "");

$dataNascimento =
    trim(
        $dados["data_nascimento"]
        ?? $dados["dataNascimento"]
        ?? ""
    );


if ($nome === "") {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Informe o nome do aluno."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


if ($cpf === "") {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Informe o CPF do aluno."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


if (strlen($cpf) !== 11) {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "O CPF deve possuir 11 números."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


if ($dataNascimento === "") {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Informe a data de nascimento."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$dataFormatada = null;


$data = DateTime::createFromFormat(
    "d/m/Y",
    $dataNascimento
);

if ($data && $data->format("d/m/Y") === $dataNascimento) {

    $dataFormatada = $data->format("Y-m-d");

}


if ($dataFormatada === null) {

    $data = DateTime::createFromFormat(
        "Y-m-d",
        $dataNascimento
    );

    if ($data && $data->format("Y-m-d") === $dataNascimento) {

        $dataFormatada = $dataNascimento;
    }
}


if ($dataFormatada === null) {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Data de nascimento inválida. Use DD/MM/YYYY."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


try {

    $pdo->beginTransaction();


    $sqlCpf = "
        SELECT id_dados
        FROM dados_pessoais
        WHERE cpf = ?
        LIMIT 1
    ";

    $stmtCpf = $pdo->prepare($sqlCpf);

    $stmtCpf->execute([$cpf]);

    if ($stmtCpf->fetch()) {

        $pdo->rollBack();

        http_response_code(409);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Já existe um aluno cadastrado com este CPF."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $sqlDados = "
        INSERT INTO dados_pessoais
        (
            nome,
            cpf,
            email,
            formacao,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?        )
    ";

    $stmtDados = $pdo->prepare($sqlDados);

    $stmtDados->execute([
        $nome,
        $cpf,
        $email,
        "Estudante",
        "A"
    ]);


    $idDados = $pdo->lastInsertId();


    $idBairro = 1;

    $rua = "Não informado";

    $cep = "00000000";


    $sqlBairro = "
        SELECT id_bairro
        FROM bairros
        WHERE id_bairro = ?
    ";

    $stmtBairro = $pdo->prepare($sqlBairro);

    $stmtBairro->execute([$idBairro]);


    if (!$stmtBairro->fetch()) {

        $pdo->rollBack();

        http_response_code(400);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "O bairro padrão (id_bairro = 1) não existe no banco."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $sqlEndereco = "
        INSERT INTO enderecos
        (
            rua,
            cep,
            id_bairro
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    ";

    $stmtEndereco = $pdo->prepare($sqlEndereco);

    $stmtEndereco->execute([
        $rua,
        $cep,
        $idBairro
    ]);


    $idEndereco = $pdo->lastInsertId();


    $sqlAluno = "
        INSERT INTO alunos
        (
            id_endereco,
            id_dados,
            data_nascimento,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            'A'
        )
    ";

    $stmtAluno = $pdo->prepare($sqlAluno);

    $stmtAluno->execute([
        $idEndereco,
        $idDados,
        $dataFormatada
    ]);


    $idAluno = $pdo->lastInsertId();


    if ($telefone !== "") {

        $sqlTelefone = "
            INSERT INTO telefones
            (
                numero_telefone,
                id_dados
            )
            VALUES
            (
                ?,
                ?
            )
        ";

        $stmtTelefone = $pdo->prepare($sqlTelefone);

        $stmtTelefone->execute([
            $telefone,
            $idDados
        ]);
    }


    $pdo->commit();


    echo json_encode([

        "sucesso" => true,

        "mensagem" => "Aluno cadastrado com sucesso.",

        "id_aluno" => $idAluno,

        "status" => "A"

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    if ($pdo->inTransaction()) {

        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([

        "sucesso" => false,

        "mensagem" => "Erro ao cadastrar aluno.",

        "erro" => $e->getMessage()

    ], JSON_UNESCAPED_UNICODE);
}

?>