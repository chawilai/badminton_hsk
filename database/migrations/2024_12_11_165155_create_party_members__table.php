<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartyMembersTable extends Migration
{
    public function up()
    {
        Schema::create('party_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('party_id');
            $table->foreignId('user_id');
            $table->string('role')->nullable();  // Role can be 'owner', 'admin', 'member', etc., and can be null
            $table->string('status')->nullable();  // Status can be 'Host', 'Pending Confirmation', 'Cancelled', 'Waitlisted', 'Checked-in', 'No Show', 'Inviting', 'Requesting', 'Rejected', 'Accepted', 'Confirmed', etc., and can be null
            $table->string('game_status')->nullable()->default('ready');
            $table->timestamp('invite_date')->nullable();
            $table->timestamp('request_date')->nullable();
            $table->timestamp('accept_date')->nullable();
            $table->timestamp('confirm_date')->nullable();
            $table->string('play_state')->nullable(); // null, ready, break, done/finished
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('party_members');
    }
}
