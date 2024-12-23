<?php

namespace Database\Factories;

use App\Models\BadmintonRank;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $mean = 12; // Center the distribution around the midpoint of range IDs
        $stdDeviation = 5; // Increase to spread values across a broader range

        $rangeId = round($this->normalDistribution($mean, $stdDeviation));
        $rangeId = max(1, min(BadmintonRank::count(), $rangeId)); // Ensure the ID is within valid range


        // date_of_birth
        $currentYear = 2024;
        $minAge = 10; // Minimum age in 2024
        $maxAge = 70; // Maximum age in 2024

        $latestDob = new \DateTime(($currentYear - $minAge) . '-12-31');
        $earliestDob = new \DateTime(($currentYear - $maxAge) . '-01-01');

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'provider' => fake()->randomElement(['facebook', 'google', 'line']),
            'provider_id' => fake()->uuid(),
            'avatar' => fake()->imageUrl(100, 100),
            'profile_picture' => fake()->imageUrl(200, 200),
            'gender' => fake()->randomElement(['male', 'female', 'other', null]),  // Randomly assign a gender or no gender
            'date_of_birth' => fake()->dateTimeBetween($earliestDob, $latestDob)->format('Y-m-d'),
            'player_motto' => '',
            'badminton_rank_id' => $rangeId
        ];
    }

    protected function normalDistribution($mean, $stdDeviation): float
    {
        $u1 = mt_rand() / mt_getrandmax();
        $u2 = mt_rand() / mt_getrandmax();
        $normalStd = sqrt(-2 * log($u1)) * cos(2 * pi() * $u2);
        return $normalStd * $stdDeviation + $mean;
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
