<?php

namespace Database\Seeders;

use App\Models\Court;
use App\Models\Party;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1)->create();
        $this->call(ThaiAddressSeeder::class);
        $this->call(BadmintonRanksTableSeeder::class);

        // User::factory(10)->create();
        Court::factory(20)->create();
        Party::factory(1)->create();
        $this->call(PartyMembersSeeder::class);
    }
}
