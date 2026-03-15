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

        $rankCount = BadmintonRank::count();
        $rangeId = null;

        if ($rankCount > 0) {
            $mean = 12;
            $stdDeviation = 5;
            $rangeId = round($this->normalDistribution($mean, $stdDeviation));
            $rangeId = max(1, min($rankCount, $rangeId));
        }

        $currentYear = (int) date('Y');
        $minAge = 10;
        $maxAge = 70;

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
            'gender' => fake()->randomElement(['male', 'female', 'other', null]),
            'date_of_birth' => fake()->dateTimeBetween($earliestDob, $latestDob)->format('Y-m-d'),
            'player_motto' => '',
            'badminton_rank_id' => $rangeId,
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
