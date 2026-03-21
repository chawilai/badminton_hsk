<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameSetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'game_id' => $this->game_id,
            'set_number' => $this->set_number,
            'team1_score' => $this->team1_score,
            'team2_score' => $this->team2_score,
            'winning_team' => $this->winning_team,
        ];
    }
}
