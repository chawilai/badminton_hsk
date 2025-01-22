<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartyCourtBooking extends Model
{
    use HasFactory;

    protected $fillable = ['party_id', 'court_id', 'court_field_number', 'start_time', 'end_time'];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}
