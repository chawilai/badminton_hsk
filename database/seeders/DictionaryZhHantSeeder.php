<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\DictionaryZhHant;

class DictionaryZhHantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filePath = resource_path('db/dictionaryZhHant.txt');

        if (File::exists($filePath)) {
            $fileContent = File::get($filePath);
            $lines = explode("\n", $fileContent);

            foreach ($lines as $line) {
                $data = json_decode($line, true);
                if ($data) {
                    DictionaryZhHant::create([
                        'character' => $data['character'] ?? null,
                        'set' => isset($data['set']) ? $data['set'] : null,
                        'definition' => $data['definition'] ?? null,
                        'pinyin' => isset($data['pinyin']) ? $data['pinyin'] : null,
                        'radical' => $data['radical'] ?? null,
                        'decomposition' => $data['decomposition'] ?? null,
                        'acjk' => $data['acjk'] ?? null,
                    ]);
                }
            }
        } else {
            $this->command->error("File not found at $filePath");
        }
    }
}
