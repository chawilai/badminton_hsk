<?php

namespace Database\Seeders;

use App\Models\BadmintonRank;
use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Court;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameScore;
use App\Models\GameSet;
use App\Models\GameShuttlecock;
use App\Models\Message;
use App\Models\Party;
use App\Models\PartyCourtBooking;
use App\Models\PartyMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding badminton ranks...');
        $this->seedRanks();

        $this->command->info('Seeding demo user + 49 users...');
        $demoUser = $this->seedUsers();

        $this->command->info('Seeding MMR levels...');
        $this->call(MmrLevelSeeder::class);

        $this->command->info('Seeding courts (Chiang Mai)...');
        $this->call(CourtSeeder::class);
        $courts = Court::all();

        $this->command->info('Seeding parties with members...');
        $parties = $this->seedParties($demoUser, $courts);

        $this->command->info('Seeding games with scores...');
        $this->seedGames($parties);

        $this->command->info('Seeding chats...');
        $this->seedChats($demoUser);

        $this->command->info('Demo seeding complete!');
        $this->command->info('Login: demo@badminton.com / password');
    }

    private function seedRanks(): void
    {
        if (BadmintonRank::count() > 0) return;

        $data = [
            ["education_rank" => "อนุบาล 1", "education_group_rank" => "อนุบาล", "general_rank" => "Beginner"],
            ["education_rank" => "อนุบาล 2", "education_group_rank" => "อนุบาล", "general_rank" => "Beginner"],
            ["education_rank" => "ประถม 1", "education_group_rank" => "ประถมต้น", "general_rank" => "Early Intermediate"],
            ["education_rank" => "ประถม 2", "education_group_rank" => "ประถมต้น", "general_rank" => "Early Intermediate"],
            ["education_rank" => "ประถม 3", "education_group_rank" => "ประถมต้น", "general_rank" => "Early Intermediate"],
            ["education_rank" => "ประถม 4", "education_group_rank" => "ประถมปลาย", "general_rank" => "Late Intermediate"],
            ["education_rank" => "ประถม 5", "education_group_rank" => "ประถมปลาย", "general_rank" => "Late Intermediate"],
            ["education_rank" => "ประถม 6", "education_group_rank" => "ประถมปลาย", "general_rank" => "Late Intermediate"],
            ["education_rank" => "มัธยม 1", "education_group_rank" => "มัธยมต้น", "general_rank" => "Advanced"],
            ["education_rank" => "มัธยม 2", "education_group_rank" => "มัธยมต้น", "general_rank" => "Advanced"],
            ["education_rank" => "มัธยม 3", "education_group_rank" => "มัธยมต้น", "general_rank" => "Advanced"],
            ["education_rank" => "มัธยม 4", "education_group_rank" => "มัธยมปลาย", "general_rank" => "Advanced"],
            ["education_rank" => "มัธยม 5", "education_group_rank" => "มัธยมปลาย", "general_rank" => "Advanced"],
            ["education_rank" => "มัธยม 6", "education_group_rank" => "มัธยมปลาย", "general_rank" => "Advanced"],
            ["education_rank" => "ปริญญาตรี 1", "education_group_rank" => "ปริญญาตรี", "general_rank" => "Expert"],
            ["education_rank" => "ปริญญาตรี 2", "education_group_rank" => "ปริญญาตรี", "general_rank" => "Expert"],
            ["education_rank" => "ปริญญาตรี 3", "education_group_rank" => "ปริญญาตรี", "general_rank" => "Expert"],
            ["education_rank" => "ปริญญาตรี 4", "education_group_rank" => "ปริญญาตรี", "general_rank" => "Expert"],
            ["education_rank" => "ปริญญาโท 1", "education_group_rank" => "ปริญญาโท", "general_rank" => "Master"],
            ["education_rank" => "ปริญญาโท 2", "education_group_rank" => "ปริญญาโท", "general_rank" => "Master"],
            ["education_rank" => "ปริญญาเอก 1", "education_group_rank" => "ปริญญาเอก", "general_rank" => "Elite"],
            ["education_rank" => "ปริญญาเอก 2", "education_group_rank" => "ปริญญาเอก", "general_rank" => "Elite"],
            ["education_rank" => "ปริญญาเอก 3", "education_group_rank" => "ปริญญาเอก", "general_rank" => "Elite"],
            ["education_rank" => "ปริญญาเอก 4", "education_group_rank" => "ปริญญาเอก", "general_rank" => "Elite"],
        ];

        foreach ($data as $item) {
            BadmintonRank::create($item);
        }
    }

    private function seedUsers(): User
    {
        // Demo user that can login with email/password
        $demoUser = User::create([
            'name' => 'Demo Player',
            'email' => 'demo@badminton.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'badminton_rank_id' => 10,
            'gender' => 'male',
            'date_of_birth' => '1995-06-15',
            'player_motto' => 'Never give up!',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        ]);

        // Create 49 more users via factory
        User::factory(49)->create();

        return $demoUser;
    }

    private function seedCourts(): \Illuminate\Support\Collection
    {
        $courtNames = [
            'สนามแบดมินตัน สุขุมวิท',
            'Ratchada Badminton Club',
            'สนามแบดมินตัน พระราม 9',
            'BKK Smash Arena',
            'สนามลาดพร้าว แบดมินตัน',
            'Bangna Badminton Center',
            'สนามแบดมินตัน รังสิต',
            'Shuttle King Court',
            'Victory Badminton Hall',
            'สนามแบดมินตัน อ่อนนุช',
        ];

        $courts = collect();
        foreach ($courtNames as $i => $name) {
            $courts->push(Court::create([
                'name' => $name,
                'address' => fake()->address(),
                'geolocation' => '13.' . rand(6000, 9000) . ', 100.' . rand(4000, 6000),
                'phone' => '0' . rand(80, 99) . '-' . rand(100, 999) . '-' . rand(1000, 9999),
                'field_total' => rand(4, 12),
                'court_type' => ['rubber', 'wood', 'synthetic'][rand(0, 2)],
                'play_price' => [80, 100, 120, 150, 200][rand(0, 4)],
                'additional_facilities' => json_encode(fake()->randomElements(
                    ['Showers', 'Locker', 'Parking', 'Air Conditioning', 'Cafe', 'Pro Shop', 'Wi-Fi Access'],
                    rand(2, 5)
                )),
                'available_for_booking' => true,
            ]));
        }

        return $courts;
    }

    private function seedParties(User $demoUser, $courts): \Illuminate\Support\Collection
    {
        $allUsers = User::all();
        $parties = collect();

        // --- Party 1: Demo user's party (TODAY, Open, actively playing) ---
        $parties->push($this->createParty(
            creator: $demoUser,
            court: $courts[0],
            playDate: now()->format('Y-m-d'),
            startTime: '18:00:00',
            playHours: 3,
            maxPlayers: 16,
            status: 'Open',
            members: $allUsers->where('id', '!=', $demoUser->id)->random(12),
        ));

        // --- Party 2: Demo user joined, yesterday (Over) ---
        $creator2 = $allUsers->where('id', '!=', $demoUser->id)->random();
        $parties->push($this->createParty(
            creator: $creator2,
            court: $courts[1],
            playDate: now()->subDay()->format('Y-m-d'),
            startTime: '19:00:00',
            playHours: 2,
            maxPlayers: 12,
            status: 'Over',
            members: $allUsers->where('id', '!=', $creator2->id)->random(10),
            extraMember: $demoUser,
        ));

        // --- Party 3: Demo user joined, tomorrow (Open) ---
        $creator3 = $allUsers->where('id', '!=', $demoUser->id)->random();
        $parties->push($this->createParty(
            creator: $creator3,
            court: $courts[2],
            playDate: now()->addDay()->format('Y-m-d'),
            startTime: '17:00:00',
            playHours: 3,
            maxPlayers: 18,
            status: 'Open',
            members: $allUsers->where('id', '!=', $creator3->id)->random(14),
            extraMember: $demoUser,
        ));

        // --- Party 4: Full party, 2 days ago (Over) ---
        $creator4 = $allUsers->random();
        $parties->push($this->createParty(
            creator: $creator4,
            court: $courts[3],
            playDate: now()->subDays(2)->format('Y-m-d'),
            startTime: '20:00:00',
            playHours: 2,
            maxPlayers: 8,
            status: 'Over',
            members: $allUsers->where('id', '!=', $creator4->id)->random(7),
        ));

        // --- Party 5: Full party, today ---
        $creator5 = $allUsers->random();
        $parties->push($this->createParty(
            creator: $creator5,
            court: $courts[4],
            playDate: now()->format('Y-m-d'),
            startTime: '16:00:00',
            playHours: 4,
            maxPlayers: 10,
            status: 'Full',
            members: $allUsers->where('id', '!=', $creator5->id)->random(9),
        ));

        // --- Parties 6-10: Various upcoming parties ---
        for ($i = 0; $i < 5; $i++) {
            $creator = $allUsers->random();
            $memberCount = rand(4, 14);
            $maxPlayers = $memberCount + rand(2, 6);
            $parties->push($this->createParty(
                creator: $creator,
                court: $courts[5 + $i],
                playDate: now()->addDays(rand(1, 14))->format('Y-m-d'),
                startTime: sprintf('%02d:00:00', rand(8, 20)),
                playHours: rand(2, 4),
                maxPlayers: $maxPlayers,
                status: 'Open',
                members: $allUsers->where('id', '!=', $creator->id)->random(min($memberCount, $allUsers->count() - 1)),
            ));
        }

        // --- Parties 11-15: Past parties (Over) ---
        for ($i = 0; $i < 5; $i++) {
            $creator = $allUsers->random();
            $parties->push($this->createParty(
                creator: $creator,
                court: $courts->random(),
                playDate: now()->subDays(rand(3, 30))->format('Y-m-d'),
                startTime: sprintf('%02d:00:00', rand(8, 20)),
                playHours: rand(2, 4),
                maxPlayers: rand(8, 20),
                status: 'Over',
                members: $allUsers->where('id', '!=', $creator->id)->random(rand(6, 16)),
            ));
        }

        return $parties;
    }

    private function createParty(
        User $creator,
        Court $court,
        string $playDate,
        string $startTime,
        int $playHours,
        int $maxPlayers,
        string $status,
        $members,
        ?User $extraMember = null,
    ): Party {
        $endTime = \DateTime::createFromFormat('H:i:s', $startTime)
            ->add(new \DateInterval('PT' . $playHours . 'H'))
            ->format('H:i:s');

        // Create party (auto-creates Host member via Party::booted)
        $party = Party::create([
            'creator_id' => $creator->id,
            'play_date' => $playDate,
            'court_id' => $court->id,
            'play_hours' => $playHours,
            'max_players' => $maxPlayers,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => $status,
            'is_private' => fake()->boolean(15),
            'default_initial_shuttlecocks' => rand(0, 3),
            'party_start_date' => $status === 'Over' ? $playDate . ' ' . $startTime : null,
            'party_end_date' => $status === 'Over' ? $playDate . ' ' . $endTime : null,
        ]);

        // Court booking
        PartyCourtBooking::create([
            'party_id' => $party->id,
            'court_id' => $court->id,
            'court_field_number' => rand(1, $court->field_total),
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        // Add members
        $confirmedStatuses = ['Confirmed', 'Confirmed', 'Confirmed', 'Accepted', 'Checked-in'];
        $addedUserIds = [$creator->id];

        foreach ($members as $user) {
            if (in_array($user->id, $addedUserIds)) continue;
            $addedUserIds[] = $user->id;

            PartyMember::create([
                'party_id' => $party->id,
                'user_id' => $user->id,
                'role' => 'Member',
                'status' => $confirmedStatuses[array_rand($confirmedStatuses)],
                'game_status' => ['ready', 'ready', 'ready', 'break'][rand(0, 3)],
                'confirm_date' => now()->subHours(rand(1, 48)),
            ]);
        }

        // Add extra member (e.g., demo user) if specified
        if ($extraMember && !in_array($extraMember->id, $addedUserIds)) {
            PartyMember::create([
                'party_id' => $party->id,
                'user_id' => $extraMember->id,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => 'ready',
                'confirm_date' => now()->subHours(rand(1, 12)),
            ]);
        }

        return $party;
    }

    private function seedGames($parties): void
    {
        foreach ($parties as $party) {
            $confirmedMembers = PartyMember::where('party_id', $party->id)
                ->whereIn('status', ['Confirmed', 'Accepted', 'Checked-in'])
                ->with('user')
                ->get();

            if ($confirmedMembers->count() < 4) continue;

            $isOverParty = $party->status === 'Over';
            $gameCount = $isOverParty ? rand(4, 8) : rand(1, 3);

            for ($g = 0; $g < $gameCount; $g++) {
                // Pick 4 players for doubles
                $players = $confirmedMembers->random(min(4, $confirmedMembers->count()));
                if ($players->count() < 4) continue;

                $team1 = $players->take(2);
                $team2 = $players->skip(2)->take(2);

                if ($isOverParty) {
                    $status = 'finished';
                } else {
                    $statuses = ['setting', 'listing', 'playing', 'finished'];
                    $status = $statuses[$g] ?? 'finished';
                }

                $gameCreateDate = now()->subMinutes(rand(10, 180));

                $game = Game::create([
                    'party_id' => $party->id,
                    'game_type' => 'quadruple',
                    'status' => $status,
                    'game_create_date' => $gameCreateDate,
                    'game_list_date' => in_array($status, ['listing', 'playing', 'finished']) ? $gameCreateDate->copy()->addMinutes(1) : null,
                    'game_start_date' => in_array($status, ['playing', 'finished']) ? $gameCreateDate->copy()->addMinutes(2) : null,
                    'game_end_date' => $status === 'finished' ? $gameCreateDate->copy()->addMinutes(rand(15, 40)) : null,
                ]);

                // Shuttlecocks
                GameShuttlecock::create([
                    'game_id' => $game->id,
                    'type' => 'initial',
                    'quantity' => rand(1, 3),
                ]);

                // Assign players to teams (skip for 'setting' status — team is required enum)
                if ($status !== 'setting') {
                    foreach ($team1 as $member) {
                        GamePlayer::create([
                            'game_id' => $game->id,
                            'user_id' => $member->user_id,
                            'team' => 'team1',
                        ]);
                    }
                    foreach ($team2 as $member) {
                        GamePlayer::create([
                            'game_id' => $game->id,
                            'user_id' => $member->user_id,
                            'team' => 'team2',
                        ]);
                    }
                }

                // Game sets & scores for playing/finished games
                if (in_array($status, ['playing', 'finished'])) {
                    $setCount = $status === 'finished' ? rand(2, 3) : 1;
                    $team1Wins = 0;
                    $team2Wins = 0;

                    for ($s = 1; $s <= $setCount; $s++) {
                        $t1Score = rand(10, 21);
                        $t2Score = rand(10, 21);

                        // Ensure winner has 21 (or 2 point lead)
                        if ($status === 'finished') {
                            if ($s <= $setCount) {
                                $winner = ($team1Wins < 2 && $team2Wins < 2)
                                    ? (rand(0, 1) ? 'team1' : 'team2')
                                    : ($team1Wins >= 2 ? 'team1' : 'team2');

                                if ($winner === 'team1') {
                                    $t1Score = 21;
                                    $t2Score = rand(8, 19);
                                    $team1Wins++;
                                } else {
                                    $t2Score = 21;
                                    $t1Score = rand(8, 19);
                                    $team2Wins++;
                                }
                            }
                        }

                        $winningTeam = null;
                        if ($t1Score >= 21 && $t1Score > $t2Score) $winningTeam = 'team1';
                        if ($t2Score >= 21 && $t2Score > $t1Score) $winningTeam = 'team2';

                        $gameSet = GameSet::create([
                            'game_id' => $game->id,
                            'set_number' => $s,
                            'team1_score' => $t1Score,
                            'team2_score' => $t2Score,
                            'winning_team' => $winningTeam,
                        ]);

                        // Player scores
                        $allPlayers = $team1->merge($team2);
                        foreach ($allPlayers as $member) {
                            $team = $team1->contains($member) ? 'team1' : 'team2';
                            $teamScore = $team === 'team1' ? $t1Score : $t2Score;
                            $playerScore = intval($teamScore / 2) + rand(-2, 2);

                            GameScore::create([
                                'game_id' => $game->id,
                                'set_id' => $gameSet->id,
                                'player_id' => $member->user_id,
                                'score' => max(0, $playerScore),
                                'is_winner' => $winningTeam === $team,
                            ]);
                        }
                    }

                    // Additional shuttlecocks for longer games
                    if ($setCount >= 3) {
                        GameShuttlecock::create([
                            'game_id' => $game->id,
                            'type' => 'additional',
                            'quantity' => rand(1, 2),
                        ]);
                    }
                }
            }
        }
    }

    private function seedChats(User $demoUser): void
    {
        $otherUsers = User::where('id', '!=', $demoUser->id)->inRandomOrder()->take(8)->get();

        $chatMessages = [
            ['ว่างเล่นวันนี้ไหมครับ?', 'ว่างครับ กี่โมงดี?', 'สัก 6 โมงได้ไหม?', 'ได้เลยครับ เจอกัน!'],
            ['ลูกหมดแล้วครับ ต้องซื้อเพิ่ม', 'เอาลูก RSL ดีไหม?', 'ได้ครับ กระป๋องละเท่าไหร่?', 'ประมาณ 500 ครับ 12 ลูก'],
            ['เกมส์สุดท้ายสนุกมาก!', 'สแมชเราแรงขึ้นเยอะ', 'ต้องซ้อมอีกเยอะ 555', 'ไว้นัดซ้อมกันอีกนะ'],
            ['สนามรัชดาเปิดใหม่ดีมาก', 'พื้นยางดีมากครับ', 'ค่าสนามเท่าไหร่?', 'ชม.ละ 120 ถูกมาก'],
        ];

        // 1-on-1 chats with demo user
        for ($i = 0; $i < min(3, $otherUsers->count()); $i++) {
            $chat = Chat::create(['is_group' => false]);
            ChatParticipant::create(['chat_id' => $chat->id, 'user_id' => $demoUser->id]);
            ChatParticipant::create(['chat_id' => $chat->id, 'user_id' => $otherUsers[$i]->id]);

            $msgs = $chatMessages[$i] ?? $chatMessages[0];
            $senders = [$demoUser->id, $otherUsers[$i]->id];
            foreach ($msgs as $j => $content) {
                Message::create([
                    'chat_id' => $chat->id,
                    'sender_id' => $senders[$j % 2],
                    'content' => $content,
                    'created_at' => now()->subMinutes(count($msgs) - $j),
                ]);
            }
        }

        // Group chat: badminton group
        if ($otherUsers->count() >= 5) {
            $groupChat = Chat::create(['is_group' => true, 'name' => 'กลุ่มแบดมินตัน HSK']);
            ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $demoUser->id]);
            for ($i = 0; $i < 5; $i++) {
                ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $otherUsers[$i]->id]);
            }

            $groupMsgs = [
                [$demoUser->id, 'สวัสดีทุกคนครับ!'],
                [$otherUsers[0]->id, 'สวัสดีครับ'],
                [$otherUsers[1]->id, 'วันนี้ใครว่างเล่นบ้าง?'],
                [$demoUser->id, 'ผมว่างครับ หลัง 5 โมง'],
                [$otherUsers[2]->id, 'ผมก็ว่างเหมือนกัน!'],
                [$otherUsers[3]->id, 'ไปสนามไหนดี?'],
                [$otherUsers[0]->id, 'สนามรัชดาดีครับ เพิ่งไปมา'],
                [$demoUser->id, 'โอเคครับ เจอกัน 5 โมงเย็น'],
                [$otherUsers[4]->id, 'ผมตามไปด้วยนะ!'],
                [$otherUsers[1]->id, 'อย่าลืมเอาลูกมาด้วย'],
            ];

            foreach ($groupMsgs as $j => [$senderId, $content]) {
                Message::create([
                    'chat_id' => $groupChat->id,
                    'sender_id' => $senderId,
                    'content' => $content,
                    'created_at' => now()->subMinutes(count($groupMsgs) - $j),
                ]);
            }
        }

        // Group chat: weekend players
        if ($otherUsers->count() >= 8) {
            $weekendChat = Chat::create(['is_group' => true, 'name' => 'นักตบวันหยุด']);
            ChatParticipant::create(['chat_id' => $weekendChat->id, 'user_id' => $demoUser->id]);
            for ($i = 3; $i < 8; $i++) {
                ChatParticipant::create(['chat_id' => $weekendChat->id, 'user_id' => $otherUsers[$i]->id]);
            }

            $weekendMsgs = [
                [$otherUsers[3]->id, 'เสาร์นี้เล่นกันไหม?'],
                [$otherUsers[4]->id, 'เอาเลย กี่คนแล้ว?'],
                [$demoUser->id, 'นับผมด้วย 1 ครับ'],
                [$otherUsers[5]->id, 'ผมก็ไป 2 คนแล้ว'],
                [$otherUsers[6]->id, '+1 ครับ'],
                [$otherUsers[7]->id, 'ผมไปได้ตอนบ่ายนะ'],
                [$otherUsers[3]->id, '6 คนพอเล่นได้แล้ว จองสนามเลย!'],
                [$demoUser->id, 'จองสนามอ่อนนุช 2 คอร์ท ได้ไหมครับ'],
            ];

            foreach ($weekendMsgs as $j => [$senderId, $content]) {
                Message::create([
                    'chat_id' => $weekendChat->id,
                    'sender_id' => $senderId,
                    'content' => $content,
                    'created_at' => now()->subHours(3)->addMinutes($j * 2),
                ]);
            }
        }
    }
}
