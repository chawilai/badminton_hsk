<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('operation_days')->nullable()->after('court_type'); // e.g. "Every Day", "Mon - Fri"
            $table->string('operation_hours')->nullable()->after('operation_days'); // e.g. "09:00 - 24:00"
            $table->decimal('shoe_rental', 8, 2)->nullable()->after('play_price');
            $table->decimal('racket_rental', 8, 2)->nullable()->after('shoe_rental');
            $table->string('facebook_url')->nullable()->after('phone');
            $table->string('google_map_url')->nullable()->after('facebook_url');
            $table->string('line_oa')->nullable()->after('google_map_url');
            // Walk-in session (บุฟเฟ่ต์)
            $table->boolean('has_buffet_session')->default(false)->after('available_for_booking');
            $table->string('buffet_days')->nullable()->after('has_buffet_session'); // e.g. "Tue Thu Sat Sun"
            $table->string('buffet_start_time')->nullable()->after('buffet_days'); // e.g. "18:00"
            $table->decimal('buffet_entry_fee', 8, 2)->nullable()->after('buffet_start_time'); // ค่าแรกเข้า
            $table->decimal('buffet_shuttle_fee', 8, 2)->nullable()->after('buffet_entry_fee'); // ค่าลูกแบด/ลูก
            $table->string('booking_system')->nullable()->after('buffet_shuttle_fee'); // e.g. "Smart Court"
            $table->text('details')->nullable()->after('booking_system');
        });
    }

    public function down(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->dropColumn([
                'name_en', 'operation_days', 'operation_hours',
                'shoe_rental', 'racket_rental',
                'facebook_url', 'google_map_url', 'line_oa',
                'has_buffet_session', 'buffet_days', 'buffet_start_time',
                'buffet_entry_fee', 'buffet_shuttle_fee',
                'booking_system', 'details',
            ]);
        });
    }
};
