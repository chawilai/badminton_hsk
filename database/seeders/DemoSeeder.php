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
use App\Models\NotificationSetting;
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

        $this->command->info('Seeding real user + demo users...');
        $realUser = $this->seedUsers();

        $this->command->info('Seeding MMR levels...');
        $this->call(MmrLevelSeeder::class);

        $this->command->info('Seeding courts (Chiang Mai)...');
        $this->call(CourtSeeder::class);
        $courts = Court::all();

        $this->command->info('Seeding parties with members...');
        [$parties, $partyGameCounts] = $this->seedParties($realUser, $courts);

        $this->command->info('Seeding games with scores...');
        $this->seedGames($parties, $partyGameCounts);

        $this->command->info('Seeding chats...');
        $this->seedChats($realUser);

        $this->command->info('Seeding notification settings...');
        NotificationSetting::create(['user_id' => $realUser->id, 'enabled' => true]);

        $this->command->info('Demo seeding complete!');
        $this->command->info("Real user: {$realUser->name} (ID: {$realUser->id})");
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
        // Real user (ID 1) — LINE account for testing push notifications
        $realUser = User::create([
            'name' => 'Whattttt!!',
            'email' => 'wat.chawilai@gmail.com',
            'password' => Hash::make('password'),
            'provider' => 'line',
            'provider_id' => 'Ub27246e34d17f341e146a358d3baa95e',
            'avatar' => 'https://profile.line-scdn.net/0h269TEiS9bRkELXwoT2QSTjhoY3RzA2tRfBwkeyclMX59GShGaxl2LCN6NS4qSC5MOBx2fCd_Zysg',
            'profile_picture' => 'https://profile.line-scdn.net/0h269TEiS9bRkELXwoT2QSTjhoY3RzA2tRfBwkeyclMX59GShGaxl2LCN6NS4qSC5MOBx2fCd_Zysg',
            'mmr' => 1171,
            'mmr_quiz_completed' => true,
            'gender' => 'male',
        ]);

        // Thai-named demo players
        $thaiNames = [
            'สมชาย ใจดี', 'สมหญิง รักแบด', 'พิชัย ตบแรง', 'นภา เสิร์ฟเทพ',
            'กิตติ ฟุตเวิร์ค', 'อรุณ สแมชเก่ง', 'ปิยะ ดีเฟนส์', 'วิภา เน็ตเพลย์',
            'ธนา ไดรฟ์หนัก', 'สุดา ดร็อปแม่น', 'ชัยวัฒน์ พลังตบ', 'มานี แรลลี่ยาว',
            'ประเสริฐ ลูกหยอด', 'จันทร์ ตบข้ามศีรษะ', 'วีระ บล็อคเทพ',
            'สายฝน เคลื่อนไว', 'ธีระ สแมชดุ', 'ลัดดา ยืดหยุ่น',
            'อนุชา ตีมุม', 'พรทิพย์ หลอกเก่ง',
        ];

        $mmrRanges = [800, 900, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1400];

        foreach ($thaiNames as $i => $name) {
            User::create([
                'name' => $name,
                'email' => 'player' . ($i + 1) . '@badminton.test',
                'password' => Hash::make('password'),
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=player' . ($i + 1),
                'mmr' => $mmrRanges[array_rand($mmrRanges)] + rand(-50, 50),
                'mmr_quiz_completed' => true,
                'gender' => $i < 10 ? 'male' : 'female',
            ]);
        }

        return $realUser;
    }

    private function seedParties(User $realUser, $courts): array
    {
        $allUsers = User::all();
        $parties = collect();
        $partyGameCounts = [];
        $partyDefs = [
            // Party 1: Host = realUser, TODAY, Open — 18 players, 16 finished games (2 courts × 2 hrs)
            [
                'name' => 'ก๊วนกีกี้ วันพฤหัสบดี',
                'creator' => $realUser,
                'court' => $courts[0],
                'playDate' => now()->format('Y-m-d'),
                'startTime' => '19:00:00',
                'playHours' => 2,
                'maxPlayers' => 18,
                'status' => 'Open',
                'memberCount' => 17, // + creator = 18
                'costType' => 'split_equal',
                'costAmount' => 120,
                'shuttlecockCost' => 15,
                'seedGames' => 16,
            ],
            // Party 2: Host = realUser, yesterday, Over
            [
                'name' => 'ตีแบดหลังเลิกงาน',
                'creator' => $realUser,
                'court' => $courts[1] ?? $courts[0],
                'playDate' => now()->subDay()->format('Y-m-d'),
                'startTime' => '18:00:00',
                'playHours' => 3,
                'maxPlayers' => 12,
                'status' => 'Over',
                'memberCount' => 10,
                'costType' => 'split_equal',
                'costAmount' => 150,
                'shuttlecockCost' => 12,
            ],
            // Party 3: someone else hosts, realUser joins, tomorrow
            [
                'name' => 'ก๊วนแบดวันศุกร์',
                'creator' => null,
                'court' => $courts[2] ?? $courts[0],
                'playDate' => now()->addDay()->format('Y-m-d'),
                'startTime' => '17:00:00',
                'playHours' => 3,
                'maxPlayers' => 16,
                'status' => 'Open',
                'memberCount' => 12,
                'costType' => 'per_person',
                'costAmount' => 80,
                'shuttlecockCost' => 15,
                'joinRealUser' => true,
            ],
            // Party 4: Full party, 2 days ago
            [
                'name' => 'แบดมินตัน Saturday',
                'creator' => null,
                'court' => $courts[3] ?? $courts[0],
                'playDate' => now()->subDays(2)->format('Y-m-d'),
                'startTime' => '09:00:00',
                'playHours' => 4,
                'maxPlayers' => 8,
                'status' => 'Over',
                'memberCount' => 8,
                'costType' => 'split_equal',
                'costAmount' => 100,
                'shuttlecockCost' => 10,
            ],
            // Party 5: Free party
            [
                'name' => 'ซ้อมแบดฟรี',
                'creator' => null,
                'court' => $courts[4] ?? $courts[0],
                'playDate' => now()->addDays(3)->format('Y-m-d'),
                'startTime' => '16:00:00',
                'playHours' => 2,
                'maxPlayers' => 10,
                'status' => 'Open',
                'memberCount' => 6,
                'costType' => 'free',
                'costAmount' => 0,
                'shuttlecockCost' => 0,
            ],
        ];

        foreach ($partyDefs as $def) {
            $creator = $def['creator'] ?? $allUsers->where('id', '!=', $realUser->id)->random();
            $members = $allUsers->where('id', '!=', $creator->id)->random(min($def['memberCount'], $allUsers->count() - 1));
            $extraMember = ($def['joinRealUser'] ?? false) ? $realUser : null;

            $party = $this->createParty(
                creator: $creator,
                court: $def['court'],
                name: $def['name'],
                playDate: $def['playDate'],
                startTime: $def['startTime'],
                playHours: $def['playHours'],
                maxPlayers: $def['maxPlayers'],
                status: $def['status'],
                members: $members,
                extraMember: $extraMember,
                costType: $def['costType'],
                costAmount: $def['costAmount'],
                shuttlecockCost: $def['shuttlecockCost'],
            );
            $parties->push($party);
            if (isset($def['seedGames'])) {
                $partyGameCounts[$party->id] = $def['seedGames'];
            }
        }

        return [$parties, $partyGameCounts];
    }

    private function createParty(
        User $creator,
        Court $court,
        string $name,
        string $playDate,
        string $startTime,
        int $playHours,
        int $maxPlayers,
        string $status,
        $members,
        ?User $extraMember = null,
        string $costType = 'free',
        float $costAmount = 0,
        float $shuttlecockCost = 0,
    ): Party {
        $endTime = \DateTime::createFromFormat('H:i:s', $startTime)
            ->add(new \DateInterval('PT' . $playHours . 'H'))
            ->format('H:i:s');

        $party = Party::create([
            'creator_id' => $creator->id,
            'name' => $name,
            'play_date' => $playDate,
            'court_id' => $court->id,
            'play_hours' => $playHours,
            'max_players' => $maxPlayers,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => $status,
            'is_private' => false,
            'default_initial_shuttlecocks' => rand(1, 3),
            'cost_type' => $costType,
            'cost_amount' => $costAmount,
            'shuttlecock_cost' => $shuttlecockCost,
            'party_start_date' => $status === 'Over' ? $playDate . ' ' . $startTime : null,
            'party_end_date' => $status === 'Over' ? $playDate . ' ' . $endTime : null,
        ]);

        // Court booking
        PartyCourtBooking::create([
            'party_id' => $party->id,
            'court_id' => $court->id,
            'court_field_number' => rand(1, max(1, $court->field_total ?? 1)),
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        // Add members
        $addedUserIds = [$creator->id];
        foreach ($members as $user) {
            if (in_array($user->id, $addedUserIds)) continue;
            $addedUserIds[] = $user->id;
            PartyMember::create([
                'party_id' => $party->id,
                'user_id' => $user->id,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => ['ready', 'ready', 'ready', 'break'][rand(0, 3)],
                'confirm_date' => now()->subHours(rand(1, 48)),
            ]);
        }

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

    private function seedGames($parties, array $partyGameCounts = []): void
    {
        foreach ($parties as $party) {
            $confirmedMembers = PartyMember::where('party_id', $party->id)
                ->whereIn('status', ['Confirmed', 'Accepted', 'Checked-in'])
                ->with('user')
                ->get();

            if ($confirmedMembers->count() < 4) continue;

            // Determine game count
            if (isset($partyGameCounts[$party->id])) {
                $gameCount = $partyGameCounts[$party->id];
            } elseif ($party->status === 'Over') {
                $gameCount = rand(5, 10);
            } else {
                continue; // Skip parties without explicit game count
            }

            // Create games with realistic time sequence
            $partyStart = \Carbon\Carbon::parse($party->play_date . ' ' . $party->start_time);
            $usedPairings = [];

            for ($g = 0; $g < $gameCount; $g++) {
                // Shuffle members for variety — avoid repeating same 4 players
                $players = $confirmedMembers->shuffle()->take(4);
                if ($players->count() < 4) continue;

                $team1 = $players->take(2);
                $team2 = $players->skip(2)->take(2);

                $status = 'finished';

                // Realistic time: each game ~15 min with 2 min gap
                $gameCreateDate = $partyStart->copy()->addMinutes($g * 17);

                $gameDuration = rand(12, 20); // realistic 12-20 min per game
                $gameStartDate = $gameCreateDate->copy()->addMinutes(2);
                $gameEndDate = $gameStartDate->copy()->addMinutes($gameDuration);

                $game = Game::create([
                    'party_id' => $party->id,
                    'game_type' => 'quadruple',
                    'status' => $status,
                    'court_number' => ($g % 2) + 1, // alternate court 1 & 2
                    'game_create_date' => $gameCreateDate,
                    'game_list_date' => $gameCreateDate->copy()->addMinutes(1),
                    'game_start_date' => $gameStartDate,
                    'game_end_date' => $gameEndDate,
                ]);

                // Shuttlecocks
                GameShuttlecock::create([
                    'game_id' => $game->id,
                    'type' => 'initial',
                    'quantity' => rand(1, 3),
                ]);

                // Assign players to teams
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

                        if ($status === 'finished') {
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

    private function seedChats(User $realUser): void
    {
        $otherUsers = User::where('id', '!=', $realUser->id)->inRandomOrder()->take(8)->get();

        $chatMessages = [
            ['ว่างเล่นวันนี้ไหมครับ?', 'ว่างครับ กี่โมงดี?', 'สัก 6 โมงได้ไหม?', 'ได้เลยครับ เจอกัน!'],
            ['ลูกหมดแล้วครับ ต้องซื้อเพิ่ม', 'เอาลูก RSL ดีไหม?', 'ได้ครับ กระป๋องละเท่าไหร่?', 'ประมาณ 500 ครับ 12 ลูก'],
            ['เกมส์สุดท้ายสนุกมาก!', 'สแมชเราแรงขึ้นเยอะ', 'ต้องซ้อมอีกเยอะ 555', 'ไว้นัดซ้อมกันอีกนะ'],
        ];

        for ($i = 0; $i < min(3, $otherUsers->count()); $i++) {
            $chat = Chat::create(['is_group' => false]);
            ChatParticipant::create(['chat_id' => $chat->id, 'user_id' => $realUser->id]);
            ChatParticipant::create(['chat_id' => $chat->id, 'user_id' => $otherUsers[$i]->id]);

            $msgs = $chatMessages[$i] ?? $chatMessages[0];
            $senders = [$realUser->id, $otherUsers[$i]->id];
            foreach ($msgs as $j => $content) {
                Message::create([
                    'chat_id' => $chat->id,
                    'sender_id' => $senders[$j % 2],
                    'content' => $content,
                    'created_at' => now()->subMinutes(count($msgs) - $j),
                ]);
            }
        }

        // Group chat
        if ($otherUsers->count() >= 5) {
            $groupChat = Chat::create(['is_group' => true, 'name' => 'กลุ่มแบดมินตัน HSK']);
            ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $realUser->id]);
            for ($i = 0; $i < 5; $i++) {
                ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $otherUsers[$i]->id]);
            }

            $groupMsgs = [
                [$realUser->id, 'สวัสดีทุกคนครับ!'],
                [$otherUsers[0]->id, 'สวัสดีครับ'],
                [$otherUsers[1]->id, 'วันนี้ใครว่างเล่นบ้าง?'],
                [$realUser->id, 'ผมว่างครับ หลัง 5 โมง'],
                [$otherUsers[2]->id, 'ผมก็ว่างเหมือนกัน!'],
                [$otherUsers[3]->id, 'ไปสนามไหนดี?'],
                [$otherUsers[0]->id, 'ตีรดี แบดมินตันดีครับ เพิ่งไปมา'],
                [$realUser->id, 'โอเคครับ เจอกัน 5 โมงเย็น'],
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
    }
}
