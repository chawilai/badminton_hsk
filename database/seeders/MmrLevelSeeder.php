<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MmrLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Normal distribution: 2+3+4+5+5+4+3+2+1+1 = 30 levels
     * Middle tiers have more levels (narrow MMR range) = more players here
     * Edge tiers have fewer levels (wide MMR range) = fewer players
     */
    public function run(): void
    {
        $tiers = [
            // Tier, Thai name, English name, Color, Levels in tier, MMR start, MMR end
            ['tier_th' => 'หัดเล่น',     'tier_en' => 'Beginner',   'color' => '#A0AEC0', 'count' => 2, 'min' => 0,    'max' => 249],
            ['tier_th' => 'หน้าบ้าน',    'tier_en' => 'Backyard',   'color' => '#68D391', 'count' => 3, 'min' => 250,  'max' => 549],
            ['tier_th' => 'ในสวน',       'tier_en' => 'Park',       'color' => '#4FD1C5', 'count' => 4, 'min' => 550,  'max' => 849],
            ['tier_th' => 'เข้าคอร์ท',   'tier_en' => 'Court',      'color' => '#63B3ED', 'count' => 5, 'min' => 850,  'max' => 1099],
            ['tier_th' => 'มือดี',       'tier_en' => 'Skilled',    'color' => '#76E4F7', 'count' => 5, 'min' => 1100, 'max' => 1349],
            ['tier_th' => 'มือแข็ง',     'tier_en' => 'Advanced',   'color' => '#B794F4', 'count' => 4, 'min' => 1350, 'max' => 1649],
            ['tier_th' => 'มือโปร',      'tier_en' => 'Pro',        'color' => '#F6AD55', 'count' => 3, 'min' => 1650, 'max' => 1949],
            ['tier_th' => 'สายแข่ง',     'tier_en' => 'Competitor', 'color' => '#FC8181', 'count' => 2, 'min' => 1950, 'max' => 2349],
            ['tier_th' => 'แชมเปี้ยน',   'tier_en' => 'Champion',   'color' => '#F687B3', 'count' => 1, 'min' => 2350, 'max' => 2699],
            ['tier_th' => 'ตำนาน',       'tier_en' => 'Legend',     'color' => '#FFD700', 'count' => 1, 'min' => 2700, 'max' => 3000],
        ];

        $records = [];
        $level = 1;

        foreach ($tiers as $tier) {
            $rangePerLevel = ($tier['max'] - $tier['min'] + 1) / $tier['count'];

            for ($i = 0; $i < $tier['count']; $i++) {
                $minMmr = (int) round($tier['min'] + ($i * $rangePerLevel));
                $maxMmr = ($i === $tier['count'] - 1)
                    ? $tier['max']
                    : (int) round($tier['min'] + (($i + 1) * $rangePerLevel)) - 1;

                $levelInTier = $i + 1;

                $records[] = [
                    'level' => $level,
                    'min_mmr' => $minMmr,
                    'max_mmr' => $maxMmr,
                    'name_th' => $tier['count'] > 1
                        ? "{$tier['tier_th']} {$levelInTier}"
                        : $tier['tier_th'],
                    'name_en' => $tier['count'] > 1
                        ? "{$tier['tier_en']} {$levelInTier}"
                        : $tier['tier_en'],
                    'tier_th' => $tier['tier_th'],
                    'tier_en' => $tier['tier_en'],
                    'tier_color' => $tier['color'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $level++;
            }
        }

        DB::table('mmr_levels')->truncate();
        DB::table('mmr_levels')->insert($records);
    }
}
