<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HanziListWord extends Model
{
    use HasFactory;

    protected $table = 'hanzi_list_words';

    public $timestamps = false;

    protected $fillable = [
        "hanzi_list_id",
        "hanzi_id",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function list()
    {
        return $this->belongsTo(HanziList::class);
    }

    public function dictionaryZhHans()
    {
        return $this->belongsTo(DictionaryZhHans::class, 'hanzi_id');
    }

    public function hanzi()
    {
        return $this->belongsTo(DictionaryZhHans::class, 'hanzi_id');
    }
}
