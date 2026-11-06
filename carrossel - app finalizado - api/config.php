<?php

$host = "localhost";
$banco = "bd_escola_atualizado";
$usuario = "root";
$senha = "";

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $e) {

    http_response_code(500);

    header("Content-Type: application/json; charset=utf-8");

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro na conexão com o banco de dados.",
        "erro" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}
?>