
<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(405, [
        "sucesso" => false,
        "mensagem" => "Método não permitido. Use POST."
    ]);
}

require_once "config.php";

$dados = json_decode(file_get_contents("php://input"), true);

if (!is_array($dados)) {
    $dados = $_POST;
}

$nome = trim($dados["nome"] ?? "");
$cpf = preg_replace("/\D/", "", $dados["cpf"] ?? "");
$formacao = trim($dados["formacao"] ?? "");
$email = trim($dados["email"] ?? "");
$telefone = trim($dados["telefone"] ?? "");

$rua = trim($dados["rua"] ?? "");
$numero = trim($dados["numero"] ?? "");
$cep = preg_replace("/\D/", "", $dados["cep"] ?? "");
$bairro = trim($dados["bairro"] ?? "");

$ehCoordenador = filter_var(
    $dados["eh_coordenador"] ?? false,
    FILTER_VALIDATE_BOOLEAN
);

$idCidadePadrao = 1;

// Validações básicas
if ($nome === "" || $cpf === "" || $formacao === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Preencha nome, CPF e formação acadêmica."
    ]);
}

if (strlen($cpf) !== 11) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O CPF deve possuir 11 números."
    ]);
}

if ($rua === "" || $bairro === "" || $cep === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Preencha rua, bairro e CEP."
    ]);
}

if (strlen($cep) !== 8) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O CEP deve possuir 8 números."
    ]);
}

if (strlen($rua . ($numero !== "" ? ", " . $numero : "")) > 50) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Rua e número devem ter no máximo 50 caracteres."
    ]);
}

if (strlen($bairro) > 30) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "O nome do bairro deve ter no máximo 30 caracteres."
    ]);
}

try {
    $pdo->beginTransaction();

    // Confere se a cidade padrão existe
    $stmt = $pdo->prepare(
        "SELECT id_cidade
         FROM cidades
         WHERE id_cidade = ? AND id_estado = 1"
    );
    $stmt->execute([$idCidadePadrao]);

    if (!$stmt->fetch()) {
        throw new Exception(
            "A cidade padrão São José dos Campos não foi encontrada."
        );
    }

    // Impede CPF duplicado
    $stmt = $pdo->prepare(
        "SELECT id_dados
         FROM dados_pessoais
         WHERE cpf = ?
         LIMIT 1"
    );
    $stmt->execute([$cpf]);

    if ($stmt->fetch()) {
        throw new DomainException(
            "Já existe um cadastro com este CPF."
        );
    }

    // Procura o bairro na cidade padrão
    $stmt = $pdo->prepare(
        "SELECT id_bairro
         FROM bairros
         WHERE LOWER(TRIM(bairro)) = LOWER(TRIM(?))
           AND id_cidade = ?
         LIMIT 1"
    );
    $stmt->execute([$bairro, $idCidadePadrao]);
    $registroBairro = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($registroBairro) {
        $idBairro = (int) $registroBairro["id_bairro"];
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO bairros (id_cidade, bairro, status)
             VALUES (?, ?, 'A')"
        );
        $stmt->execute([$idCidadePadrao, $bairro]);
        $idBairro = (int) $pdo->lastInsertId();
    }

    // Cadastra os dados pessoais
    $stmt = $pdo->prepare(
        "INSERT INTO dados_pessoais
         (nome, cpf, email, formacao, status)
         VALUES (?, ?, ?, ?, 'A')"
    );
    $stmt->execute([
        $nome,
        $cpf,
        $email,
        $formacao
    ]);

    $idDados = (int) $pdo->lastInsertId();

    // Cadastra o endereço
    $ruaCompleta = $rua . ($numero !== "" ? ", " . $numero : "");

    $stmt = $pdo->prepare(
        "INSERT INTO enderecos
         (id_bairro, rua, cep, status)
         VALUES (?, ?, ?, 'A')"
    );
    $stmt->execute([
        $idBairro,
        $ruaCompleta,
        $cep
    ]);

    $idEndereco = (int) $pdo->lastInsertId();

    // Cadastra o professor
    $stmt = $pdo->prepare(
        "INSERT INTO professores
         (id_endereco, id_dados, status)
         VALUES (?, ?, 'A')"
    );
    $stmt->execute([
        $idEndereco,
        $idDados
    ]);

    $idProfessor = (int) $pdo->lastInsertId();

    // Cadastra o telefone quando informado
    if ($telefone !== "") {
        $stmt = $pdo->prepare(
            "INSERT INTO telefones
             (id_dados, numero_telefone, tipo, status)
             VALUES (?, ?, ?, 'A')"
        );
        $stmt->execute([
            $idDados,
            $telefone,
            "Celular"
        ]);
    }

    // Cadastra o vínculo de coordenador quando solicitado
    if ($ehCoordenador) {
        $stmt = $pdo->prepare(
            "INSERT INTO coordenadores
             (id_professor, status)
             VALUES (?, 'A')"
        );
        $stmt->execute([$idProfessor]);
    }

    $pdo->commit();

    responder(200, [
        "sucesso" => true,
        "mensagem" => $ehCoordenador
            ? "Professor cadastrado como coordenador com sucesso."
            : "Professor cadastrado com sucesso.",
        "id_professor" => $idProfessor,
        "eh_coordenador" => $ehCoordenador,
        "status" => "A"
    ]);

} catch (DomainException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    responder(409, [
        "sucesso" => false,
        "mensagem" => $e->getMessage()
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Erro ao cadastrar professor: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar professor.",
        "erro" => $e->getMessage()
    ]);
}
?>
