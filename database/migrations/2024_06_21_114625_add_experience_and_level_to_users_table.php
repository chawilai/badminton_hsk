<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('experience')->default(0)->after('profile_picture');
            $table->integer('level')->default(1)->after('experience');
            $table->foreignId('rank_id')->nullable()->after('experience')->constrained('ranks')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['rank_id']);
            $table->dropColumn(['experience', 'level', 'rank_id']);
        });
    }
};
