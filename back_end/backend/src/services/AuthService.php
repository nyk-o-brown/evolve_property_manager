<?php

declare(strict_types=1);

namespace App\Services;

final class AuthService
{
    public function register(array $data): array { return ['id' => 1]; }
    public function login(string $email, string $password): array { return ['token' => 'stub']; }
    public function logout(): void {}
}


