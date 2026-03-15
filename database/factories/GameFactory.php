<?php

namespace Database\Factories;

use App\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;

class GameFactory extends Factory
{
    public function definition(): array
    {
        return [
            'party_id' => Party::factory(),
            'game_type' => 'double',
            'status' => 'setting',
            'game_create_date' => now(),
        ];
    }

    public function listing(): static
    {
        return $this->state(fn () => [
            'status' => 'listing',
            'game_list_date' => now(),
        ]);
    }

    public function playing(): static
    {
        return $this->state(fn () => [
            'status' => 'playing',
            'game_list_date' => now(),
            'game_start_date' => now(),
        ]);
    }

    public function finished(): static
    {
        return $this->state(fn () => [
            'status' => 'finished',
            'game_list_date' => now(),
            'game_start_date' => now(),
            'game_end_date' => now(),
        ]);
    }

    public function quadruple(): static
    {
        return $this->state(fn () => ['game_type' => 'quadruple']);
    }
}
