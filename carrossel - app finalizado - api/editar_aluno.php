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
        "mensagem" => "Método não permitido. Use PUT para editar."
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


// Recebe os dados
$idAluno = intval(
    $dados["id_aluno"]
    ?? $dados["id"]
    ?? 0
);

$nome = trim(
    $dados["nome"] ?? ""
);

$cpf = preg_replace(
    "/\D/",
    "",
    $dados["cpf"] ?? ""
);

$email = trim(
    $dados["email"] ?? ""
);

$telefone = trim(
    $dados["telefone"] ?? ""
);

$dataNascimento = trim(
    $dados["data_nascimento"]
    ?? $dados["dataNascimento"]
    ?? ""
);


// Valida ID
if ($idAluno <= 0) {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "ID do aluno inválido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Valida nome
if ($nome === "") {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Informe o nome do aluno."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// Valida CPF
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


try {

    $pdo->beginTransaction();


    // Busca os dados relacionados ao aluno
    $sqlBusca = "
        SELECT
            id_dados,
            id_endereco,
            data_nascimento,
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

        $pdo->rollBack();

        http_response_code(404);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Aluno não encontrado."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    $idDados = $aluno["id_dados"];

    $idEndereco = $aluno["id_endereco"];


    // Verifica CPF em outro cadastro
    $sqlCpf = "
        SELECT id_dados
        FROM dados_pessoais
        WHERE cpf = ?
        AND id_dados <> ?
        LIMIT 1
    ";

    $stmtCpf = $pdo->prepare($sqlCpf);

    $stmtCpf->execute([
        $cpf,
        $idDados
    ]);


    if ($stmtCpf->fetch()) {

        $pdo->rollBack();

        http_response_code(409);

        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Este CPF já pertence a outro cadastro."
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    // Atualiza dados pessoais
    $sqlDados = "
        UPDATE dados_pessoais

        SET
            nome = ?,
            cpf = ?,
            email = ?

        WHERE id_dados = ?
    ";

    $stmtDados = $pdo->prepare($sqlDados);

    $stmtDados->execute([
        $nome,
        $cpf,
        $email,
        $idDados
    ]);


    // Data
    if ($dataNascimento !== "") {

        $dataFormatada = null;


        // DD/MM/YYYY
        $data = DateTime::createFromFormat(
            "d/m/Y",
            $dataNascimento
        );


        if (
            $data
            &&
            $data->format("d/m/Y") === $dataNascimento
        ) {

            $dataFormatada =
                $data->format("Y-m-d");
        }


        // YYYY-MM-DD
        if ($dataFormatada === null) {

            $data = DateTime::createFromFormat(
                "Y-m-d",
                $dataNascimento
            );

            if (
                $data
                &&
                $data->format("Y-m-d") === $dataNascimento
            ) {

                $dataFormatada =
                    $dataNascimento;
            }
        }


        if ($dataFormatada === null) {

            $pdo->rollBack();

            http_response_code(400);

            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Data de nascimento inválida."
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }


        // Atualiza data de nascimento
        $sqlAluno = "
            UPDATE alunos

            SET
                data_nascimento = ?

            WHERE id_aluno = ?
        ";

        $stmtAluno = $pdo->prepare($sqlAluno);

        $stmtAluno->execute([
            $dataFormatada,
            $idAluno
        ]);
    }


    // Busca telefone existente
    $sqlTelefone = "
        SELECT id_telefone
        FROM telefones
        WHERE id_dados = ?
        LIMIT 1
    ";

    $stmtTelefone = $pdo->prepare($sqlTelefone);

    $stmtTelefone->execute([
        $idDados
    ]);

    $telefoneExistente =
        $stmtTelefone->fetch();


    if ($telefoneExistente) {

        if ($telefone !== "") {

            // Atualiza telefone
            $sqlUpdateTelefone = "
                UPDATE telefones

                SET
                    numero_telefone = ?

                WHERE id_telefone = ?
            ";

            $stmtUpdateTelefone =
                $pdo->prepare($sqlUpdateTelefone);

            $stmtUpdateTelefone->execute([
                $telefone,
                $telefoneExistente["id_telefone"]
            ]);

        } else {

            // Remove somente o telefone vazio
            $sqlDeleteTelefone = "
                DELETE FROM telefones
                WHERE id_telefone = ?
            ";

            $stmtDeleteTelefone =
                $pdo->prepare($sqlDeleteTelefone);

            $stmtDeleteTelefone->execute([
                $telefoneExistente["id_telefone"]
            ]);
        }

    } else {

        // Se não existe telefone, cria um
        if ($telefone !== "") {

            $sqlNovoTelefone = "
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

            $stmtNovoTelefone =
                $pdo->prepare($sqlNovoTelefone);

            $stmtNovoTelefone->execute([
                $telefone,
                $idDados
            ]);
        }
    }


    $pdo->commit();


    echo json_encode([

        "sucesso" => true,

        "mensagem" => "Aluno atualizado com sucesso.",

        "id_aluno" => $idAluno,

        // Retorna o status atual sem modificá-lo
        "status" => $aluno["status"]

    ], JSON_UNESCAPED_UNICODE);


} catch (PDOException $e) {

    if ($pdo->inTransaction()) {

        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([

        "sucesso" => false,

        "mensagem" => "Erro ao editar aluno.",

        "erro" => $e->getMessage()

    ], JSON_UNESCAPED_UNICODE);
}

?>