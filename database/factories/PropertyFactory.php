<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = \App\Models\Property::class;

    public function definition()
    {
        return [
            'landlord_id' => \App\Models\User::factory()->state(['role'=>'landlord']),
            'address' => $this->faker->address,
            'rent_amount' => $this->faker->numberBetween(20000,100000),
            'status' => 'active',
            'description' => $this->faker->paragraph,
        ];
    }
}
