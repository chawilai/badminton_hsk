<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MmrLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            ['tier_th' => 'ลูกนกน้อย', 'tier_en' => 'Hatchling', 'color' => '#A0AEC0', 'levels' => [1, 2, 3]],
            ['tier_th' => 'นกกระจอก', 'tier_en' => 'Sparrow', 'color' => '#68D391', 'levels' => [4, 5, 6]],
            ['tier_th' => 'นกนางแอ่น', 'tier_en' => 'Swallow', 'color' => '#4FD1C5', 'levels' => [7, 8, 9]],
            ['tier_th' => 'นกเหยี่ยว', 'tier_en' => 'Hawk', 'color' => '#63B3ED', 'levels' => [10, 11, 12]],
            ['tier_th' => 'นกอินทรี', 'tier_en' => 'Eagle', 'color' => '#B794F4', 'levels' => [13, 14, 15]],
            ['tier_th' => 'เหยี่ยวทอง', 'tier_en' => 'Golden Hawk', 'color' => '#F6AD55', 'levels' => [16, 17, 18]],
            ['tier_th' => 'อินทรีเพลิง', 'tier_en' => 'Fire Eagle', 'color' => '#FC8181', 'levels' => [19, 20, 21]],
            ['tier_th' => 'ครุฑ', 'tier_en' => 'Garuda', 'color' => '#F687B3', 'levels' => [22, 23, 24]],
            ['tier_th' => 'ฟินิกซ์', 'tier_en' => 'Phoenix', 'color' => '#FBD38D', 'levels' => [25, 26, 27]],
            ['tier_th' => 'ตำนาน', 'tier_en' => 'Legend', 'color' => '#FFD700', 'levels' => [28, 29, 30]],
        ];

        $records = [];

        foreach ($tiers as $tier) {
            foreach ($tier['levels'] as $index => $level) {
                $levelInTier = $index + 1; // 1, 2, 3 within each tier
                $minMmr = ($level - 1) * 100;
                $maxMmr = ($level === 30) ? 3000 : ($level * 100 - 1);

                $records[] = [
                    'level' => $level,
                    'min_mmr' => $minMmr,
                    'max_mmr' => $maxMmr,
                    'name_th' => "{$tier['tier_th']} {$levelInTier}",
                    'name_en' => "{$tier['tier_en']} {$levelInTier}",
                    'tier_th' => $tier['tier_th'],
                    'tier_en' => $tier['tier_en'],
                    'tier_color' => $tier['color'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('mmr_levels')->truncate();
        DB::table('mmr_levels')->insert($records);
    }
}
