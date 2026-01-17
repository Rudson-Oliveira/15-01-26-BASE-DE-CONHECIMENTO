
// === ROTAS DE CONFIGURACAO DE APIs ===
Route::prefix('config/apis')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\ApiConfigController::class, 'index']);
    Route::put('/{provider}', [App\Http\Controllers\Api\ApiConfigController::class, 'update']);
    Route::post('/{provider}/test', [App\Http\Controllers\Api\ApiConfigController::class, 'test']);
    Route::patch('/{provider}/toggle', [App\Http\Controllers\Api\ApiConfigController::class, 'toggleActive']);
});
