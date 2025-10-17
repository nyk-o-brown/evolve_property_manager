<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Property;
use App\Models\User;

class PropertyUnitFactory extends Factory
{
    protected $model = \App\Models\PropertyUnit::class;

    public function definition()
    {
        $property = Property::inRandomOrder()->first() ?? Property::factory()->create();

        return [
            'property_ID' => $property->id,
            'user_ID' => null,
            'tenant_ID' => null,
            'user_name' => null,
            'unit_name' => $this->faker->bothify('Unit ?#'),
            'rent_price' => $this->faker->numberBetween(5000,100000),
            'tenant_status' => 'unoccupied'
        ];
    }
}
