<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class TenantController
{
    public function index(array $params, array $data): void
    {
        Response::json(['data' => []]);
    }

    public function show(array $params, array $data): void
    {
        Response::json(['data' => ['id' => (int)($params['id'] ?? 0)]]);
    }
}


