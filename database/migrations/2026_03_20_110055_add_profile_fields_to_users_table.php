<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('phone');
            $table->string('subdistrict')->nullable()->after('date_of_birth');
            $table->string('district')->nullable()->after('subdistrict');
            $table->string('province')->nullable()->after('district');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'phone_verified_at', 'subdistrict', 'district', 'province']);
        });
    }
};
