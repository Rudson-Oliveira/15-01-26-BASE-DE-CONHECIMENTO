<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('api_configs', function (Blueprint $table) {
            if (!Schema::hasColumn('api_configs', 'last_tested')) {
                $table->timestamp('last_tested')->nullable();
            }
            if (!Schema::hasColumn('api_configs', 'last_test_status')) {
                $table->string('last_test_status', 20)->nullable();
            }
            if (!Schema::hasColumn('api_configs', 'retry_count')) {
                $table->integer('retry_count')->default(0);
            }
            if (!Schema::hasColumn('api_configs', 'next_retry')) {
                $table->timestamp('next_retry')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('api_configs', function (Blueprint $table) {
            $table->dropColumn(['last_tested', 'last_test_status', 'retry_count', 'next_retry']);
        });
    }
};
