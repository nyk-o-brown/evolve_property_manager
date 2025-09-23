<?php

declare(strict_types=1);

require dirname(__DIR__, 1) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Utils\Response;

$root = dirname(__DIR__, 1);

if (file_exists($root . '/.env')) {
    $dotenv = Dotenv::createImmutable($root);
    $dotenv->safeLoad();
}

// Simple CORS
header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include routes and dispatch
require $root . '/src/routes/api.php';


