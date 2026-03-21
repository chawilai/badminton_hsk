<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GamePlayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'game_id' => $this->game_id,
            'user_id' => $this->user_id,
            'team' => $this->team,
            'display_name' => $this->display_name,
            'user' => $this->when(
                $this->relationLoaded('user'),
                fn() => new UserCompactResource($this->user)
            ),
        ];
    }
}
