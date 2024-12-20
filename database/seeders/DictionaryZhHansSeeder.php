<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\DictionaryZhHans;
use Overtrue\Pinyin\Pinyin;

class DictionaryZhHansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filePath = resource_path('db/dictionaryZhHans.txt');

        if (File::exists($filePath)) {
            $fileContent = File::get($filePath);
            $lines = explode("\n", $fileContent);

            foreach ($lines as $line) {
                $data = json_decode($line, true);
                if ($data) {
                    DictionaryZhHans::create([
                        'character' => $data['character'] ?? null,
                        'set' => isset($data['set']) ? $data['set'] : null,
                        'meaning_thai' => $data['meaning_thai'] ?? null,
                        'definition' => $data['definition'] ?? null,
                        'pinyin' => isset($data['pinyin']) ? $data['pinyin'] : null,
                        'radical' => $data['radical'] ?? null,
                        'decomposition' => $data['decomposition'] ?? null,
                        'acjk' => $data['acjk'] ?? null,
                    ]);
                }
            }

            // update pinyin_english
            DictionaryZhHans::chunk(1000, function ($hanziList) {
                foreach ($hanziList as $hanzi) {
                    $hanzi->pinyin_english = Pinyin::sentence($hanzi->character, 'none')[0];
                    $hanzi->save();
                }
            });

        } else {
            $this->command->error("File not found at $filePath");
        }
    }
}
