<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'name_en', 'address', 'phone',
        'field_total', 'court_type', 'play_price', 'geolocation',
        'operation_days', 'operation_hours',
        'shoe_rental', 'racket_rental',
        'facebook_url', 'google_map_url', 'line_oa',
        'available_for_booking',
        'has_buffet_session', 'buffet_days', 'buffet_start_time',
        'buffet_entry_fee', 'buffet_shuttle_fee',
        'booking_system', 'details',
        'additional_facilities',
    ];

    protected $casts = [
        'field_total' => 'integer',
        'play_price' => 'decimal:2',
        'shoe_rental' => 'decimal:2',
        'racket_rental' => 'decimal:2',
        'buffet_entry_fee' => 'decimal:2',
        'buffet_shuttle_fee' => 'decimal:2',
        'available_for_booking' => 'boolean',
        'has_buffet_session' => 'boolean',
    ];
}
