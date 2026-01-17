<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiConfigController;

// Rotas de Configuracao de APIs de IA
Route::prefix('config/apis')->group(function () {
    Route::get('/', [ApiConfigController::class, 'index']);
    Route::put('/{provider}', [ApiConfigController::class, 'update']);
    Route::post('/{provider}/test', [ApiConfigController::class, 'test']);
    Route::patch('/{provider}/toggle', [ApiConfigController::class, 'toggleActive']);
});
