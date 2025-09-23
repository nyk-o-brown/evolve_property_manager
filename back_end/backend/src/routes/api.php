<?php

declare(strict_types=1);

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;
use App\Controllers\AuthController;
use App\Controllers\PropertyController;
use App\Controllers\TenantController;
use App\Controllers\PaymentController;
use App\Controllers\MaintenanceController;
use App\Controllers\ReportController;
use App\Utils\Response;

$dispatcher = simpleDispatcher(function (RouteCollector $r) {
    // Auth
    $r->addRoute('POST', '/api/register', [AuthController::class, 'register']);
    $r->addRoute('POST', '/api/login', [AuthController::class, 'login']);
    $r->addRoute('POST', '/api/logout', [AuthController::class, 'logout']);

    // Properties
    $r->addRoute('GET', '/api/properties', [PropertyController::class, 'index']);
    $r->addRoute('POST', '/api/properties', [PropertyController::class, 'store']);
    $r->addRoute('GET', '/api/properties/{id:\\d+}', [PropertyController::class, 'show']);
    $r->addRoute('PUT', '/api/properties/{id:\\d+}', [PropertyController::class, 'update']);
    $r->addRoute('DELETE', '/api/properties/{id:\\d+}', [PropertyController::class, 'destroy']);

    // Tenants
    $r->addRoute('GET', '/api/tenants', [TenantController::class, 'index']);
    $r->addRoute('GET', '/api/tenants/{id:\\d+}', [TenantController::class, 'show']);

    // Payments
    $r->addRoute('POST', '/api/payments/collect', [PaymentController::class, 'collect']);
    $r->addRoute('GET', '/api/payments/history', [PaymentController::class, 'history']);
    $r->addRoute('GET', '/api/payments/invoices/{id:\\d+}', [PaymentController::class, 'invoice']);

    // Maintenance
    $r->addRoute('GET', '/api/maintenance', [MaintenanceController::class, 'index']);
    $r->addRoute('POST', '/api/maintenance/request', [MaintenanceController::class, 'store']);

    // Reports
    $r->addRoute('GET', '/api/reports/overview', [ReportController::class, 'overview']);
});

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case \FastRoute\Dispatcher::NOT_FOUND:
        Response::json(['message' => 'Not Found'], 404);
        break;
    case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        Response::json(['message' => 'Method Not Allowed'], 405);
        break;
    case \FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        [$class, $method] = $handler;
        $controller = new $class();
        $body = file_get_contents('php://input');
        $data = json_decode($body, true) ?? [];
        $controller->$method($vars, $data);
        break;
}


