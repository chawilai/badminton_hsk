<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Court>
 */
class CourtFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $facilities = [
            'Showers', 'Locker', 'Equipment Rental', 'Pro Shop',
            'Snack Bar', 'Cafe', 'Seating Areas', 'Coaching Services',
            'Parking', 'Air Conditioning', 'Membership Lounge',
            'Wi-Fi Access', 'Fitness Center', 'Child Care', 'First Aid',
            'Tournament Hosting'
        ];

        return [
            'name' => $this->faker->company,
            'address' => $this->faker->address,
            'geolocation' => $this->faker->latitude($min = -90, $max = 90) . ', ' . $this->faker->longitude($min = -180, $max = 180),
            'phone' => $this->faker->phoneNumber,
            'contact_url' => $this->faker->url,
            'field_total' => $this->faker->numberBetween($min = 1, $max = 30),  // Maximum of 30 fields
            'court_type' => $this->faker->randomElement(['rubber', 'wood', 'synthetic']),
            'play_price' => $this->faker->numberBetween(0, 500),  // Whole number between 0 and 500
            'additional_facilities' => json_encode($this->faker->randomElements($facilities, rand(1, count($facilities)))),
            'available_for_booking' => $this->faker->boolean(80) // 80% chance to be true
        ];
    }
}
