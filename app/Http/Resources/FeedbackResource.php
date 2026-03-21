<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'subject' => $this->subject,
            'description' => $this->description,
            'screenshot_path' => $this->screenshot_path,
            'status' => $this->status,
            'user' => $this->when(
                $this->relationLoaded('user'),
                fn() => new UserCompactResource($this->user)
            ),
            'replies' => $this->when(
                $this->relationLoaded('replies'),
                fn() => $this->replies->map(fn($r) => [
                    'id' => $r->id,
                    'message' => $r->message,
                    'admin' => $r->admin ? new UserCompactResource($r->admin) : null,
                    'created_at' => $r->created_at,
                ])
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
