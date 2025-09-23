<?php

declare(strict_types=1);

namespace App\Services;

final class PaymentService
{
    public function collect(array $data): array { return ['status' => 'ok']; }
    public function history(): array { return []; }
    public function invoice(int $id): ?array { return ['id' => $id]; }
}


