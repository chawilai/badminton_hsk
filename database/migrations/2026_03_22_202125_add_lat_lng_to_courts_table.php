<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('geolocation');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        // Migrate existing geolocation string data to lat/lng columns
        DB::table('courts')
            ->whereNotNull('geolocation')
            ->where('geolocation', '!=', '')
            ->orderBy('id')
            ->each(function ($court) {
                $parts = array_map('trim', explode(',', $court->geolocation));
                if (count($parts) === 2 && is_numeric($parts[0]) && is_numeric($parts[1])) {
                    DB::table('courts')->where('id', $court->id)->update([
                        'latitude' => (float) $parts[0],
                        'longitude' => (float) $parts[1],
                    ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
