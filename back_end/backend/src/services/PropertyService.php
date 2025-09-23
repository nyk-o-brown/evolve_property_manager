<?php

declare(strict_types=1);

namespace App\Services;

final class PropertyService
{
    public function list(): array { return []; }
    public function create(array $data): array { return ['id' => 1]; }
    public function get(int $id): ?array { return ['id' => $id]; }
    public function update(int $id, array $data): bool { return true; }
    public function delete(int $id): bool { return true; }
}


