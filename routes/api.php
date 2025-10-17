<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\MaintenanceRequestController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\TenantManagementController;

Route::prefix('auth')->group(function(){
    Route::post('register', [AuthController::class,'register']);
    Route::post('login', [AuthController::class,'login']);
    Route::post('password-reset', [AuthController::class,'passwordReset']); // basic stub
    Route::middleware('auth:sanctum')->group(function(){
        Route::post('logout', [AuthController::class,'logout']);
        Route::get('me', [AuthController::class,'me']);
    });
});

Route::middleware('auth:sanctum')->group(function(){
    Route::apiResource('properties', PropertyController::class);
    Route::apiResource('tenants', TenantController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('maintenance', MaintenanceRequestController::class);

    Route::get('reports/overview', [ReportController::class,'overview']);
    Route::get('reports/occupancy', [ReportController::class,'occupancy']);
});

// Added JWT-protected routes (auth:api) for units and tenant management
Route::middleware('auth:api')->group(function(){
    Route::post('units/add', [UnitController::class, 'add']);
    Route::put('units/edit/{unit_ID}', [UnitController::class, 'edit']);

    // Tenant management endpoints (create user + tenant + assign unit)
    Route::post('tenants/add', [TenantManagementController::class, 'add']);
    Route::put('tenants/edit/{user_ID}', [TenantManagementController::class, 'edit']);
});
