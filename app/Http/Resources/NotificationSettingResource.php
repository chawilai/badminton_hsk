<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'enabled' => $this->enabled,
            'party_invite' => $this->party_invite,
            'party_reminder' => $this->party_reminder,
            'game_start' => $this->game_start,
            'game_result' => $this->game_result,
            'friend_request' => $this->friend_request,
            'party_member_joined' => $this->party_member_joined,
            'feedback' => $this->feedback,
        ];
    }
}
