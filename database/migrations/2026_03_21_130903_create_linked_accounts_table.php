<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('linked_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider'); // line, google, apple
            $table->string('provider_id');
            $table->string('provider_name')->nullable();
            $table->string('provider_avatar')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'provider_id']);
            $table->index('user_id');
        });

        // Migrate existing user provider data
        $users = \DB::table('users')
            ->whereNotNull('provider')
            ->whereNotNull('provider_id')
            ->get(['id', 'provider', 'provider_id', 'provider_name', 'avatar']);

        foreach ($users as $user) {
            \DB::table('linked_accounts')->insertOrIgnore([
                'user_id' => $user->id,
                'provider' => $user->provider,
                'provider_id' => $user->provider_id,
                'provider_name' => $user->provider_name,
                'provider_avatar' => $user->avatar,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linked_accounts');
    }
};
