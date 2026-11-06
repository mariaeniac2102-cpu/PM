
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
$email = trim($dados["email"] ?? "");
$telefone = trim($dados["telefone"] ?? "");
$dataNascimento = trim(
    $dados["data_nascimento"] ?? $dados["dataNascimento"] ?? ""
);

// Novos campos do endereço
$rua = trim($dados["rua"] ?? "");
$numero = trim($dados["numero"] ?? "");
$cep = preg_replace("/\D/", "", $dados["cep"] ?? "");
$bairro = trim($dados["bairro"] ?? "");

// Cidade e estado padrão cadastrados no banco
$idCidadePadrao = 1;

// Validações básicas
if ($nome === "" || $cpf === "" || $dataNascimento === "") {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Preencha nome, CPF e data de nascimento."
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

// Aceita DD/MM/AAAA ou AAAA-MM-DD
$dataFormatada = null;

$data = DateTime::createFromFormat("!d/m/Y", $dataNascimento);
if ($data && $data->format("d/m/Y") === $dataNascimento) {
    $dataFormatada = $data->format("Y-m-d");
}

if ($dataFormatada === null) {
    $data = DateTime::createFromFormat("!Y-m-d", $dataNascimento);
    if ($data && $data->format("Y-m-d") === $dataNascimento) {
        $dataFormatada = $dataNascimento;
    }
}

if ($dataFormatada === null) {
    responder(400, [
        "sucesso" => false,
        "mensagem" => "Data inválida. Use DD/MM/AAAA."
    ]);
}

try {
    $pdo->beginTransaction();

    // Confere se a cidade padrão existe
    $stmt = $pdo->prepare(
        "SELECT id_cidade FROM cidades WHERE id_cidade = ? AND id_estado = 1"
    );
    $stmt->execute([$idCidadePadrao]);

    if (!$stmt->fetch()) {
        throw new Exception(
            "A cidade padrão São José dos Campos não foi encontrada."
        );
    }

    // Impede CPF duplicado
    $stmt = $pdo->prepare(
        "SELECT id_dados FROM dados_pessoais WHERE cpf = ? LIMIT 1"
    );
    $stmt->execute([$cpf]);

    if ($stmt->fetch()) {
        throw new DomainException(
            "Já existe um cadastro com este CPF."
        );
    }

    // Procura o bairro dentro da cidade padrão
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
        $idBairro = (int)$registroBairro["id_bairro"];
    } else {
        // Cadastra o bairro se ainda não existir
        $stmt = $pdo->prepare(
            "INSERT INTO bairros (id_cidade, bairro, status)
             VALUES (?, ?, 'A')"
        );
        $stmt->execute([$idCidadePadrao, $bairro]);
        $idBairro = (int)$pdo->lastInsertId();
    }

    // Cadastra os dados pessoais
    $stmt = $pdo->prepare(
        "INSERT INTO dados_pessoais
         (nome, cpf, email, formacao, status)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $nome,
        $cpf,
        $email,
        "Estudante",
        "A"
    ]);

    $idDados = (int)$pdo->lastInsertId();

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

    $idEndereco = (int)$pdo->lastInsertId();

    // Cadastra o aluno como ativo
    $stmt = $pdo->prepare(
        "INSERT INTO alunos
         (id_endereco, id_dados, data_nascimento, status)
         VALUES (?, ?, ?, 'A')"
    );
    $stmt->execute([
        $idEndereco,
        $idDados,
        $dataFormatada
    ]);

    $idAluno = (int)$pdo->lastInsertId();

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

    $pdo->commit();

    responder(200, [
        "sucesso" => true,
        "mensagem" => "Aluno cadastrado com sucesso.",
        "id_aluno" => $idAluno,
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

    error_log("Erro ao cadastrar aluno: " . $e->getMessage());

    responder(500, [
        "sucesso" => false,
        "mensagem" => "Erro ao cadastrar aluno.",
        "erro" => $e->getMessage()
    ]);
}
?>