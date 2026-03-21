<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'party_id' => $this->party_id,
            'game_type' => $this->game_type,
            'status' => $this->status,
            'court_number' => $this->court_number,
            'game_number' => $this->game_number,
            'game_create_date' => $this->game_create_date,
            'game_start_date' => $this->game_start_date,
            'game_end_date' => $this->game_end_date,
            'initial_shuttlecocks' => $this->initial_shuttlecocks,
            'game_players' => $this->when(
                $this->relationLoaded('gamePlayers'),
                fn() => GamePlayerResource::collection($this->gamePlayers)
            ),
            'game_sets' => $this->when(
                $this->relationLoaded('gameSets'),
                fn() => GameSetResource::collection($this->gameSets)
            ),
            'shuttlecocks' => $this->when(
                $this->relationLoaded('shuttlecocks'),
                fn() => $this->shuttlecocks
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
