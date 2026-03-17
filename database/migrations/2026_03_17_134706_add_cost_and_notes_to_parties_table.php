<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->string('cost_type')->nullable()->after('is_private'); // per_person, split_equal, free
            $table->decimal('cost_amount', 8, 2)->nullable()->after('cost_type');
            $table->decimal('shuttlecock_cost', 8, 2)->nullable()->after('cost_amount');
            $table->text('notes')->nullable()->after('shuttlecock_cost');
        });
    }

    public function down(): void
    {
        Schema::table('parties', function (Blueprint $table) {
            $table->dropColumn(['cost_type', 'cost_amount', 'shuttlecock_cost', 'notes']);
        });
    }
};
