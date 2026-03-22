<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('line_oa_settings', function (Blueprint $table) {
            $table->json('welcome_message_config')->nullable()->after('rich_menu_config');
        });
    }

    public function down(): void
    {
        Schema::table('line_oa_settings', function (Blueprint $table) {
            $table->dropColumn('welcome_message_config');
        });
    }
};
