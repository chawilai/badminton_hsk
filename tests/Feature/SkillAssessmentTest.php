<?php

use App\Models\User;
use App\Models\SkillAssessment;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('skill assessment page loads', function () {
    $this->actingAs($this->user)
        ->get('/skill-assessment')
        ->assertOk();
});

test('user can submit skill assessment', function () {
    $skills = [
        'serve' => 7, 'smash' => 8, 'clear' => 6, 'net_play' => 5, 'defense' => 7,
        'backhand' => 4, 'deception' => 3, 'footwork' => 6, 'speed' => 8, 'stamina' => 9,
    ];

    $this->actingAs($this->user)
        ->post('/skill-assessment', ['skills' => $skills])
        ->assertRedirect('/profile');

    $this->assertDatabaseHas('skill_assessments', ['user_id' => $this->user->id]);

    $saved = SkillAssessment::where('user_id', $this->user->id)->latest()->first();
    expect($saved->skills['serve'])->toBe(7);
    expect($saved->skills['stamina'])->toBe(9);
});

test('skill assessment requires all 10 skills', function () {
    $this->actingAs($this->user)
        ->post('/skill-assessment', ['skills' => ['serve' => 5]])
        ->assertSessionHasErrors();
});

test('skill values must be between 1 and 10', function () {
    $skills = [
        'serve' => 11, 'smash' => 0, 'clear' => 6, 'net_play' => 5, 'defense' => 7,
        'backhand' => 4, 'deception' => 3, 'footwork' => 6, 'speed' => 8, 'stamina' => 9,
    ];

    $this->actingAs($this->user)
        ->post('/skill-assessment', ['skills' => $skills])
        ->assertSessionHasErrors();
});

test('user can re-assess and old assessment is kept', function () {
    SkillAssessment::create([
        'user_id' => $this->user->id,
        'skills' => ['serve' => 5, 'smash' => 5, 'clear' => 5, 'net_play' => 5, 'defense' => 5, 'backhand' => 5, 'deception' => 5, 'footwork' => 5, 'speed' => 5, 'stamina' => 5],
    ]);

    $newSkills = [
        'serve' => 8, 'smash' => 9, 'clear' => 7, 'net_play' => 6, 'defense' => 8,
        'backhand' => 5, 'deception' => 4, 'footwork' => 7, 'speed' => 9, 'stamina' => 10,
    ];

    $this->actingAs($this->user)
        ->post('/skill-assessment', ['skills' => $newSkills])
        ->assertRedirect('/profile');

    expect(SkillAssessment::where('user_id', $this->user->id)->count())->toBe(2);
    $latest = SkillAssessment::where('user_id', $this->user->id)->latest('id')->first();
    expect($latest->skills['serve'])->toBe(8);
});

test('profile shows skill assessment data', function () {
    SkillAssessment::create([
        'user_id' => $this->user->id,
        'skills' => ['serve' => 8, 'smash' => 9, 'clear' => 7, 'net_play' => 6, 'defense' => 8, 'backhand' => 5, 'deception' => 4, 'footwork' => 7, 'speed' => 9, 'stamina' => 10],
    ]);

    $response = $this->actingAs($this->user)->get('/profile');
    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->has('skillAssessment')
            ->where('skillAssessment.serve', 8)
            ->where('skillAssessment.smash', 9)
    );
});
