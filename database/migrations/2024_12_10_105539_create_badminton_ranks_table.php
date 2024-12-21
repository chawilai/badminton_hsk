<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBadmintonRanksTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('badminton_ranks', function (Blueprint $table) {
            $table->id();
            $table->string('education_rank')->unique(); // Store ranges like "อนุบาล 1" to "ปริญญาเอก 4"
            $table->string('education_group_rank');
            $table->string('general_rank');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('badminton_ranks');
    }
}
