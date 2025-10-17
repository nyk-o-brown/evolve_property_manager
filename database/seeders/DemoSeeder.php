<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\Tenant;
use App\Models\Payment;
use App\Models\MaintenanceRequest;

class DemoSeeder extends Seeder
{
    public function run()
    {
        // Admin
        User::factory()->create([
            'name'=>'Admin User',
            'email'=>'admin@example.com',
            'password'=>bcrypt('password'),
            'role'=>'admin'
        ]);

        // Landlord with properties
        $landlord = User::factory()->create([
            'name'=>'Liron (landlord)',
            'email'=>'liron@demo.com',
            'password'=>bcrypt('password'),
            'role'=>'landlord'
        ]);

        $props = Property::factory()->count(3)->state(['landlord_id'=>$landlord->id])->create();

        foreach($props as $p) {
            $tenant = Tenant::factory()->state(['property_id'=>$p->id])->create();
            Payment::factory()->count(3)->state(['tenant_id'=>$tenant->id,'property_id'=>$p->id])->create();
            MaintenanceRequest::factory()->count(1)->state(['tenant_id'=>$tenant->id,'property_id'=>$p->id,'description'=>'Leaky faucet'])->create();
        }
    }
}
