<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartyListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'creator_id' => $this->creator_id,
            'creator' => $this->when(
                $this->relationLoaded('creator'),
                fn() => new UserCompactResource($this->creator)
            ),
            'court' => $this->when(
                $this->relationLoaded('court'),
                fn() => $this->court ? [
                    'id' => $this->court->id,
                    'name' => $this->court->name,
                ] : null
            ),
            'play_date' => $this->play_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'is_private' => $this->is_private,
            'max_players' => $this->max_players,
            'members_count' => $this->members_count ?? ($this->relationLoaded('members') ? $this->members->count() : null),
            'members' => $this->when(
                $this->relationLoaded('members'),
                fn() => UserCompactResource::collection($this->members->take(5)->pluck('user')->filter())
            ),
        ];
    }
}
