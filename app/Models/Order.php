<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    public const PAYMENT_PENDING = 'Pending';

    public const PAYMENT_PAID = 'Paid';

    public const PAYMENT_FAILED = 'Failed';

    public const PAYMENT_EXPIRED = 'Expired';

    public const STATUS_PENDING_PAYMENT = 'Menunggu Pembayaran';

    public const STATUS_PAID = 'Dibayar';

    public const STATUS_PROCESSING = 'Diproses';

    public const STATUS_SHIPPED = 'Dikirim';

    public const STATUS_COMPLETED = 'Selesai';

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'note',
        'subtotal',
        'total',
        'payment_status',
        'order_status',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'total' => 'float',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }
}
