<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\DictionaryJa;

class DictionaryJaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $filePath = resource_path('db/dictionaryJa.txt');

        if (File::exists($filePath)) {
            $fileContent = File::get($filePath);
            $lines = explode("\n", $fileContent);

            foreach ($lines as $line) {
                $data = json_decode($line, true);
                if ($data) {
                    DictionaryJa::create([
                        'character' => $data['character'] ?? null,
                        'set' => isset($data['set']) ? $data['set'] : null,
                        'definition' => $data['definition'] ?? null,
                        'kun' => isset($data['kun']) ? $data['kun'] : null,
                        'on' => isset($data['on']) ? $data['on'] : null,
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
