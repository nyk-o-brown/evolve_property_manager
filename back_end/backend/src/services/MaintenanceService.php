<?php

declare(strict_types=1);

namespace App\Services;

final class MaintenanceService
{
    public function list(): array { return []; }
    public function create(array $data): array { return ['id' => 1]; }
}


