<?php

use App\Models\User;

test('setup page can be rendered', function () {
    $this->get('/setup')->assertOk();
});

test('user can update setup', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/setup', [
        'badminton_rank_id' => 1,
        'gender' => 'male',
        'date_of_birth' => '1990-05-15',
    ])->assertRedirect(route('party'));

    $user->refresh();
    $this->assertEquals(1, $user->badminton_rank_id);
    $this->assertEquals('male', $user->gender);
    $this->assertEquals('1990-05-15', $user->date_of_birth);
});
