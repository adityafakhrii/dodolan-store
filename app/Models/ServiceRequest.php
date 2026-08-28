<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    public const TYPE_INSTALLATION = 'Instalasi';

    public const TYPE_SURVEY = 'Survey';

    public const TYPE_MAINTENANCE = 'Maintenance';

    public const STATUS_NEW = 'Baru';

    public const STATUS_PROCESSING = 'Diproses';

    public const STATUS_COMPLETED = 'Selesai';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'service_type',
        'location',
        'description',
        'note',
        'status',
    ];

    public function scopeNew($query)
    {
        return $query->where('status', self::STATUS_NEW);
    }
}
