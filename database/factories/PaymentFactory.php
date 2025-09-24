<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = \App\Models\Payment::class;

    public function definition()
    {
        return [
            'tenant_id' => \App\Models\Tenant::factory(),
            'property_id' => \App\Models\Property::factory(),
            'amount' => $this->faker->numberBetween(20000,100000),
            'date' => $this->faker->dateTimeBetween('-1 month','now'),
            'status' => 'completed',
            'external_payment_id' => null,
        ];
    }
}
