<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Dictionary;

class DictionarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filePath = resource_path('db/dictionary.txt');

        if (File::exists($filePath)) {
            $fileContent = File::get($filePath);
            $lines = explode("\n", $fileContent);

            foreach ($lines as $line) {
                $data = json_decode($line, true);
                if ($data) {
                    Dictionary::create([
                        'character' => $data['character'] ?? null,
                        'definition' => $data['definition'] ?? null,
                        'pinyin' => isset($data['pinyin']) ? $data['pinyin'] : null,
                        'decomposition' => $data['decomposition'] ?? null,
                        'etymology' => isset($data['etymology']) ? $data['etymology'] : null,
                        'radical' => $data['radical'] ?? null,
                        'matches' => isset($data['matches']) ? $data['matches'] : null,
                    ]);
                }
            }
        } else {
            $this->command->error("File not found at $filePath");
        }
    }
}
