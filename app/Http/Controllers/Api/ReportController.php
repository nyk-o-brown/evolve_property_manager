<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Tenant;
use App\Models\Payment;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function overview(Request $r)
    {
        $properties = Property::count();
        $tenants = Tenant::count();
        $payments = Payment::where('status','completed')->sum('amount');
        $openMaintenance = MaintenanceRequest::whereIn('status',['pending','in_progress'])->count();

        return response()->json([
            'properties' => $properties,
            'tenants' => $tenants,
            'revenue' => $payments,
            'open_maintenance' => $openMaintenance
        ]);
    }

    public function occupancy(Request $r)
    {
        // basic occupancy: properties with tenants / total properties
        $total = Property::count();
        $occupied = Property::has('tenants')->count();
        $rate = $total ? round(($occupied / $total) * 100,2) : 0;

        return response()->json([
            'total_properties' => $total,
            'occupied_properties' => $occupied,
            'occupancy_rate' => $rate
        ]);
    }
}
