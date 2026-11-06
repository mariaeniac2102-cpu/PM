
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
        "mensagem" => "Método não permitido. Use PUT para editar."
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

$nome = trim($dados["nome"] ?? "");
$cpf = preg_replace("/\D/", "", $dados["cpf"] ?? "");
$email = trim($dados["email"] ?? "");
$formacao = trim($dados["formacao"] ?? "");
$telefone = trim($dados["telefone"] ?? "");
$rua = trim($dados["rua"] ?? "");
$cep = preg_replace("/\D/", "", $dados["cep"] ?? "");
$bairro = trim($dados["bairro"] ?? "");

// Só altera o vínculo se a informação foi enviada
$alterarCoordenador = array_key_exists("eh_coordenador", $dados);

$ehCoordenador = filter_var(
    $dados["eh_coordenador"] ?? false,
    FILTER_VALIDATE_BOOLEAN
);

if ($idProfessor <= 0) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "ID do professor inválido."
    ]);
}

if ($nome === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe o nome do professor."
    ]);
}

if (strlen($cpf) !== 11) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O CPF deve possuir 11 números."
    ]);
}

if ($formacao === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe a formação do professor."
    ]);
}

if ($rua === "" || $bairro === "" || $cep === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Informe a rua, o bairro e o CEP."
    ]);
}

if (strlen($cep) !== 8) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O CEP deve possuir 8 números."
    ]);
}

try {
    $pdo->beginTransaction();

    // Busca o professor e seus registros relacionados
    $stmtBusca = $pdo->prepare("
        SELECT id_professor, id_dados, id_endereco, status
        FROM professores
        WHERE id_professor = ?
        LIMIT 1
    ");

    $stmtBusca->execute([$idProfessor]);
    $professor = $stmtBusca->fetch(PDO::FETCH_ASSOC);

    if (!$professor) {
        $pdo->rollBack();

        responder(404, [
            "sucesso" => false,
            "mensagem" => "Professor não encontrado."
        ]);
    }

    $idDados = (int) $professor["id_dados"];
    $idEndereco = (int) $professor["id_endereco"];

    // Impede que o CPF seja usado em outro cadastro
    $stmtCpf = $pdo->prepare("
        SELECT id_dados
        FROM dados_pessoais
        WHERE cpf = ?
          AND id_dados <> ?
        LIMIT 1
    ");

    $stmtCpf->execute([$cpf, $idDados]);

    if ($stmtCpf->fetch()) {
        $pdo->rollBack();

        responder(409, [
            "sucesso" => false,
            "mensagem" => "Este CPF já pertence a outro cadastro."
        ]);
    }

    // Atualiza os dados pessoais
    $stmtDados = $pdo->prepare("
        UPDATE dados_pessoais
        SET nome = ?, cpf = ?, email = ?, formacao = ?
        WHERE id_dados = ?
    ");

    $stmtDados->execute([
        $nome,
        $cpf,
        $email,
        $formacao,
        $idDados
    ]);

    // Procura o bairro na cidade padrão
    $stmtBairro = $pdo->prepare("
        SELECT id_bairro
        FROM bairros
        WHERE LOWER(TRIM(bairro)) = LOWER(TRIM(?))
          AND id_cidade = 1
        LIMIT 1
    ");

    $stmtBairro->execute([$bairro]);
    $bairroEncontrado = $stmtBairro->fetch(PDO::FETCH_ASSOC);

    if ($bairroEncontrado) {
        $idBairro = (int) $bairroEncontrado["id_bairro"];
    } else {
        $stmtNovoBairro = $pdo->prepare("
            INSERT INTO bairros (id_cidade, bairro, status)
            VALUES (1, ?, 'A')
        ");

        $stmtNovoBairro->execute([$bairro]);
        $idBairro = (int) $pdo->lastInsertId();
    }

    // Atualiza o endereço sem alterar seu status
    $stmtEndereco = $pdo->prepare("
        UPDATE enderecos
        SET id_bairro = ?, rua = ?, cep = ?
        WHERE id_endereco = ?
    ");

    $stmtEndereco->execute([
        $idBairro,
        $rua,
        $cep,
        $idEndereco
    ]);

    // Busca um telefone ativo do professor
    $stmtTelefone = $pdo->prepare("
        SELECT id_telefone
        FROM telefones
        WHERE id_dados = ?
          AND status = 'A'
        LIMIT 1
    ");

    $stmtTelefone->execute([$idDados]);
    $telefoneExistente = $stmtTelefone->fetch(PDO::FETCH_ASSOC);

    if ($telefoneExistente) {
        if ($telefone !== "") {
            // Atualiza o telefone existente
            $stmtAtualizaTelefone = $pdo->prepare("
                UPDATE telefones
                SET numero_telefone = ?
                WHERE id_telefone = ?
            ");

            $stmtAtualizaTelefone->execute([
                $telefone,
                $telefoneExistente["id_telefone"]
            ]);
        } else {
            // Desativa o telefone se o campo ficar vazio
            $stmtRemoveTelefone = $pdo->prepare("
                UPDATE telefones
                SET status = 'I'
                WHERE id_telefone = ?
            ");

            $stmtRemoveTelefone->execute([
                $telefoneExistente["id_telefone"]
            ]);
        }
    } elseif ($telefone !== "") {
        // Cadastra um telefone caso não exista um ativo
        $stmtNovoTelefone = $pdo->prepare("
            INSERT INTO telefones
                (id_dados, numero_telefone, tipo, status)
            VALUES (?, ?, 'Celular', 'A')
        ");

        $stmtNovoTelefone->execute([
            $idDados,
            $telefone
        ]);
    }

    // Atualiza o vínculo de coordenador somente se
    // o aplicativo enviou essa informação
    if ($alterarCoordenador) {
        $stmtCoordenador = $pdo->prepare("
            SELECT id_coordenador
            FROM coordenadores
            WHERE id_professor = ?
            ORDER BY id_coordenador DESC
            LIMIT 1
        ");

        $stmtCoordenador->execute([$idProfessor]);
        $coordenadorExistente = $stmtCoordenador->fetch(PDO::FETCH_ASSOC);

        if ($ehCoordenador) {
            if ($coordenadorExistente) {
                $stmt = $pdo->prepare("
                    UPDATE coordenadores
                    SET status = 'A'
                    WHERE id_coordenador = ?
                ");

                $stmt->execute([
                    $coordenadorExistente["id_coordenador"]
                ]);
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO coordenadores (id_professor, status)
                    VALUES (?, 'A')
                ");

                $stmt->execute([$idProfessor]);
            }
        } else {
            $stmt = $pdo->prepare("
                UPDATE coordenadores
                SET status = 'I'
                WHERE id_professor = ?
            ");

            $stmt->execute([$idProfessor]);
        }
    }

    $pdo->commit();

    responder(200, [
        "sucesso" => true,
        "mensagem" => "Professor atualizado com sucesso.",
        "id_professor" => $idProfessor,
        "status" => $professor["status"]
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Erro ao editar professor: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao editar professor. Verifique os dados enviados e a estrutura do banco."
    ]);
}
?>
