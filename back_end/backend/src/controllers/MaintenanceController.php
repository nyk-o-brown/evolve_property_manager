<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class MaintenanceController
{
    public function index(array $params, array $data): void
    {
        Response::json(['data' => []]);
    }

    public function store(array $params, array $data): void
    {
        Response::json(['message' => 'request_created'], 201);
    }
}


