<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Utils\Response;

final class ReportController
{
    public function overview(array $params, array $data): void
    {
        Response::json(['data' => ['summary' => []]]);
    }
}


