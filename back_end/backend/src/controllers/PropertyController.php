<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class PropertyController
{
    public function index(array $params, array $data): void
    {
        Response::json(['data' => []]);
    }

    public function store(array $params, array $data): void
    {
        Response::json(['message' => 'created'], 201);
    }

    public function show(array $params, array $data): void
    {
        Response::json(['data' => ['id' => (int)($params['id'] ?? 0)]]);
    }

    public function update(array $params, array $data): void
    {
        Response::json(['message' => 'updated']);
    }

    public function destroy(array $params, array $data): void
    {
        Response::json(['message' => 'deleted']);
    }
}


