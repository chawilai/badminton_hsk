<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Court;
use App\Models\BadmintonRank;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $openTime = 8;  // Court opens at 8 AM
        $closeTime = 22;  // Court closes at 10 PM
        $maxPlayHours = 6; // Maximum hours allowed for play

        // Ensure play hours fit within operational hours and do not exceed 4 hours
        $playHours = $this->faker->numberBetween(1, $maxPlayHours);

        // Calculate a start time that allows the game to finish before the closing time
        $latestStartHour = $closeTime - $playHours;
        $startTimeHour = $this->faker->numberBetween($openTime, $latestStartHour);
        $startTimeMinute = $this->faker->randomElement([0]); // Start at the hour or half-hour
        $startTime = sprintf('%02d:%02d:00', $startTimeHour, $startTimeMinute);

        // Calculate the end time
        $endTime = \DateTime::createFromFormat('H:i:s', $startTime)
                    ->add(new \DateInterval('PT' . ($playHours * 60) . 'M'))
                    ->format('H:i:s');

        // Generating age range if needed
        if ($this->faker->boolean(70)) {  // 70% chance to set age range
            $ageStart = $this->faker->numberBetween(10, 30);
            $ageEnd = $this->faker->numberBetween($ageStart, 60);
            $ageRange = json_encode(['start' => $ageStart, 'end' => $ageEnd]);
        } else {
            $ageRange = null;
        }

        // Generating badminton level range if needed
        if ($this->faker->boolean(90)) {  // 70% chance to set level range
            $levelStart = BadmintonRank::inRandomOrder()->first()->id;
            $levelEnd = BadmintonRank::where('id', '>=', $levelStart)->inRandomOrder()->first()->id;
            $badmintonLevel = json_encode(['start' => $levelStart, 'end' => $levelEnd]);
        } else {
            $badmintonLevel = null;
        }

        $currentDate = now();
        $maxDate = now()->addMonth();

        return [
            'creator_id' => User::inRandomOrder()->first()->id,
            'play_date' => $this->faker->dateTimeBetween($currentDate, $maxDate)->format('Y-m-d'),
            'court_id' => Court::inRandomOrder()->first()->id,
            'play_hours' => $playHours,
            'max_players' => $this->faker->numberBetween(2, 50),  // Range changed as requested
            'start_time' => $startTime,
            'end_time' => $endTime,
            'age_range' => $ageRange,
            'status' => 'Open', // Default status as "Open" -> "Open", "Full", "Over"
            'is_private' => $this->faker->boolean(20), // 20% chance the party is private
            'is_inc_playing' => false, // 20% true
            'is_break_aftergame' => $this->faker->boolean(50), // 50% chance the game_status is break after game
            'default_initial_shuttlecocks' => 0,
            'gender' => $this->faker->randomElement(['male', 'female', 'lgbt', null]),
            'badminton_level' => $badmintonLevel,
            'party_start_date' => $currentDate,
            'court_booking_details' => $this->faker->sentence,
        ];
    }
}
