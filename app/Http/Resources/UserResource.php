<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'profile_picture' => $this->profile_picture,
            'provider' => $this->provider,
            'provider_name' => $this->provider_name,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'age' => $this->age,
            'phone' => $this->phone,
            'phone_verified_at' => $this->phone_verified_at,
            'subdistrict' => $this->subdistrict,
            'district' => $this->district,
            'province' => $this->province,
            'badminton_rank_id' => $this->badminton_rank_id,
            'mmr' => $this->mmr,
            'mmr_games_played' => $this->mmr_games_played,
            'mmr_calibrated' => $this->mmr_calibrated,
            'mmr_quiz_completed' => $this->mmr_quiz_completed,
            'mmr_level' => $this->when($this->mmr, function () {
                $level = $this->mmrLevel();
                return $level ? new MmrLevelResource($level) : null;
            }),
            'skill_assessment' => $this->when(
                $this->relationLoaded('latestSkillAssessment'),
                fn() => $this->latestSkillAssessment ? new SkillAssessmentResource($this->latestSkillAssessment) : null
            ),
            'email_verified_at' => $this->email_verified_at,
            'pdpa_consented_at' => $this->pdpa_consented_at,
            'created_at' => $this->created_at,
        ];
    }
}
