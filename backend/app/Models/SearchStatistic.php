<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchStatistic extends Model
{
    protected $fillable = [
        'query',
        'response_time',
        'timestamp'
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'response_time' => 'float'
    ];
} 