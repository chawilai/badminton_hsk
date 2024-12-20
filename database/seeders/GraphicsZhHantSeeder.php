<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\GraphicsZhHant;

class GraphicsZhHantSeeder extends Seeder
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
                    GraphicsZhHant::create([
                        'character' => $data['character'] ?? null,
                        'strokes' => isset($data['strokes']) ? $data['strokes'] : null,
                        'medians' => isset($data['medians']) ? $data['medians'] : null,
                    ]);
                }
            }
        } else {
            $this->command->error("File not found at $filePath");
        }
    }
}
