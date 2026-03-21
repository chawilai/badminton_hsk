<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartyResource extends JsonResource
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
            'court_id' => $this->court_id,
            'court' => $this->when(
                $this->relationLoaded('court'),
                fn() => $this->court ? new CourtResource($this->court) : null
            ),
            'play_date' => $this->play_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'play_hours' => $this->play_hours,
            'max_players' => $this->max_players,
            'status' => $this->status,
            'cost_type' => $this->cost_type,
            'cost_amount' => $this->cost_amount,
            'shuttlecock_cost' => $this->shuttlecock_cost,
            'notes' => $this->notes,
            'is_private' => $this->is_private,
            'passcode' => $this->when($request->user()?->id === $this->creator_id, $this->passcode),
            'invite_token' => $this->invite_token,
            'invite_token_expires_at' => $this->invite_token_expires_at,
            'initial_shuttlecocks' => $this->initial_shuttlecocks,
            'members_count' => $this->when(isset($this->members_count), $this->members_count),
            'members' => $this->when(
                $this->relationLoaded('members'),
                fn() => PartyMemberResource::collection($this->members)
            ),
            'court_bookings' => $this->when(
                $this->relationLoaded('courtBookings'),
                fn() => CourtBookingResource::collection($this->courtBookings)
            ),
            'games' => $this->when(
                $this->relationLoaded('games'),
                fn() => GameResource::collection($this->games)
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
