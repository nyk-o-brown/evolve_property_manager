<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TenantFactory extends Factory
{
    protected $model = \App\Models\Tenant::class;

    public function definition()
    {
        return [
            'property_id' => \App\Models\Property::factory(),
            'name' => $this->faker->name,
            'email' => $this->faker->safeEmail,
            'contact' => $this->faker->phoneNumber,
            'lease_start' => now()->subMonths(2),
            'lease_end' => now()->addMonths(10),
        ];
    }
}
