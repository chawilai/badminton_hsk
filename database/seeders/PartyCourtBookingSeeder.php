<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Party;
use App\Models\PartyCourtBooking;

class PartyCourtBookingSeeder extends Seeder
{
    public function run()
    {
        // Example Party
        $party = Party::create([
            'creator_id' => 1,
            'play_date' => '2025-01-22',
            'court_id' => 3,
            'play_hours' => 3,
            'max_players' => 12,
            'start_time' => '18:00:00',
            'end_time' => '21:00:00',
            'status' => 'Open',
        ]);

        // Add Court Bookings for the Party
        PartyCourtBooking::create([
            'party_id' => $party->id,
            'court_id' => 3,
            'court_field_number' => 1,
            'start_time' => '18:00:00',
            'end_time' => '19:00:00',
        ]);

        PartyCourtBooking::create([
            'party_id' => $party->id,
            'court_id' => 3,
            'court_field_number' => 2,
            'start_time' => '19:00:00',
            'end_time' => '21:00:00',
        ]);

        PartyCourtBooking::create([
            'party_id' => $party->id,
            'court_id' => 3,
            'court_field_number' => 6,
            'start_time' => '18:00:00',
            'end_time' => '21:00:00',
        ]);
    }
}
