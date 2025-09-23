<?php

declare(strict_types=1);

namespace App\Services;

final class TenantService
{
    public function list(): array { return []; }
    public function get(int $id): ?array { return ['id' => $id]; }
}


