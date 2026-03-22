<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('line_oa_settings', function (Blueprint $table) {
            $table->id();
            $table->string('channel_access_token', 500)->nullable();
            $table->string('channel_secret')->nullable();
            $table->string('liff_id')->nullable();
            $table->string('line_oa_id')->nullable();
            $table->json('rich_menu_config')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('line_oa_settings');
    }
};
