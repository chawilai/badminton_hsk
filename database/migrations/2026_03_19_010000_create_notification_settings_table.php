<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('enabled')->default(true);
            $table->boolean('party_invite')->default(true);
            $table->boolean('party_reminder')->default(true);
            $table->boolean('game_start')->default(true);
            $table->boolean('game_result')->default(true);
            $table->boolean('friend_request')->default(true);
            $table->boolean('party_member_joined')->default(true);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
