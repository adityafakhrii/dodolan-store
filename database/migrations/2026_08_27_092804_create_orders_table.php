<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->index();
            $table->string('customer_name')->index();
            $table->string('customer_email')->index();
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->text('note')->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('total', 15, 2);
            $table->string('payment_status')->default('Pending')->index();
            $table->string('order_status')->default('Menunggu Pembayaran')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
