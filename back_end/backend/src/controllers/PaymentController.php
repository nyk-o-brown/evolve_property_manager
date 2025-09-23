<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class PaymentController
{
    public function collect(array $params, array $data): void
    {
        Response::json(['message' => 'payment_collected']);
    }

    public function history(array $params, array $data): void
    {
        Response::json(['data' => []]);
    }

    public function invoice(array $params, array $data): void
    {
        Response::json(['data' => ['id' => (int)($params['id'] ?? 0)]]);
    }
}


