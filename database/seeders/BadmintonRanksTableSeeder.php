<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadmintonRanksTableSeeder extends Seeder
{
    public function run()
    {
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
            DB::table('badminton_ranks')->insert([
                'education_rank' => $item['education_rank'],
                'education_group_rank' => $item['education_group_rank'],
                'general_rank' => $item['general_rank'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
