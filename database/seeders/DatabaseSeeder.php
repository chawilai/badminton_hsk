<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1)->create();

        $this->call(HanziInertialSeeder::class);
        $this->call(HanziHSK1Seeder::class);
        $this->call(HanziHSK2Seeder::class);
        $this->call(HanziHSK3Seeder::class);
        $this->call(HanziHSK4Seeder::class);
        $this->call(HanziHSK5Seeder::class);
        $this->call(HanziHSK6Seeder::class);
        $this->call(HanziFrequentlyUsedSeeder::class);
        $this->call(HanziCommonSeeder::class);
        $this->call(HanziTraditionalSeeder::class);
        $this->call(HanziUnCommonSeeder::class);
        $this->call(HanziRadicalSeeder::class);
        $this->call(DictionarySeeder::class);
        $this->call(GraphicsSeeder::class);

        $this->call(DictionaryJaSeeder::class);
        $this->call(DictionaryKoSeeder::class);
        $this->call(DictionaryZhHansSeeder::class);
        $this->call(DictionaryZhHantSeeder::class);

        $this->call(GraphicsJaSeeder::class);
        $this->call(GraphicsKanaSeeder::class);
        $this->call(GraphicsKoSeeder::class);
        $this->call(GraphicsZhHansSeeder::class);
        $this->call(GraphicsZhHantSeeder::class);
        $this->call(ThaiAddressSeeder::class);

        $this->call(ChineseWordsTableSeeder::class);
    }
}
