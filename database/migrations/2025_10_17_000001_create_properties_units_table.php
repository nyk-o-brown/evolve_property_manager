<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('properties_units', function (Blueprint $table) {
            $table->id('unit_ID');
            $table->foreignId('property_ID')->constrained('properties')->onDelete('cascade');
            // user_ID references users.id if a user account is created for a tenant
            $table->foreignId('user_ID')->nullable()->constrained('users')->onDelete('set null');
            // tenant_ID references tenants table (if you keep a separate tenants record)
            $table->foreignId('tenant_ID')->nullable()->constrained('tenants')->onDelete('set null');
            $table->string('user_name')->nullable();
            $table->string('unit_name');
            $table->decimal('rent_price', 12, 2)->default(0);
            $table->enum('tenant_status', ['occupied','pending','unoccupied'])->default('unoccupied');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties_units');
    }
};
