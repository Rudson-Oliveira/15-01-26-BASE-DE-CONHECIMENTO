<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_configs', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 50)->unique();
            $table->text('api_key')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_tested')->nullable();
            $table->string('last_test_status', 20)->nullable();
            $table->timestamps();
            
            $table->index('provider');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_configs');
    }
};
