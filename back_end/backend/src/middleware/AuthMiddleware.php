<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Utils\Response;

final class AuthMiddleware
{
    public static function ensureAuthenticated(): void
    {
        // Placeholder: Normally verify JWT or session
        // For now, allow all
    }
}


