<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\PropertyUnit;

class PropertyUnitsSeeder extends Seeder
{
    public function run()
    {
        $properties = Property::all();
        if ($properties->isEmpty()) {
            // fallback: create one property
            $property = Property::factory()->create();
        } else {
            $property = $properties->first();
        }

        // create a few units for the first property
        for ($i=1; $i<=6; $i++) {
            PropertyUnit::create([
                'property_ID' => $property->id,
                'unit_name' => "Unit A{$i}",
                'rent_price' => rand(15000, 50000),
                'tenant_status' => 'unoccupied'
            ]);
        }
    }
}
