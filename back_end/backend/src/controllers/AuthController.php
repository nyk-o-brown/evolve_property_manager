<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class AuthController
{
    public function register(array $params, array $data): void
    {
        Response::json(['message' => 'registered'], 201);
    }

    public function login(array $params, array $data): void
    {
        Response::json(['message' => 'logged_in']);
    }

    public function logout(array $params, array $data): void
    {
        Response::json(['message' => 'logged_out']);
    }
}


