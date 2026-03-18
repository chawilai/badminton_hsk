<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->string('invite_token', 32)->nullable()->unique()->after('is_private');
            $table->string('invite_passcode', 6)->nullable()->after('invite_token');
        });
    }

    public function down(): void
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->dropColumn(['invite_token', 'invite_passcode']);
        });
    }
};
