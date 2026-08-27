<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'Pending';
    public const STATUS_PAID = 'Paid';
    public const STATUS_FAILED = 'Failed';
    public const STATUS_EXPIRED = 'Expired';

    protected $fillable = [
        'order_id',
        'provider',
        'provider_reference',
        'payment_reference',
        'amount',
        'method',
        'status',
        'paid_at',
        'raw_response',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'raw_response' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
