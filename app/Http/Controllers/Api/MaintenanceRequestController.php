<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MaintenanceRequest;
use App\Http\Resources\MaintenanceRequestResource;

class MaintenanceRequestController extends Controller
{
    public function index(Request $r)
    {
        $q = MaintenanceRequest::with(['tenant','property']);
        if ($r->filled('status')) $q->where('status',$r->status);
        return MaintenanceRequestResource::collection($q->paginate($r->get('per_page',15)));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'tenant_id'=>'required|exists:tenants,id',
            'property_id'=>'required|exists:properties,id',
            'description'=>'required|string',
            'attachments'=>'nullable|array'
        ]);

        $req = MaintenanceRequest::create($data);
        return new MaintenanceRequestResource($req->load(['tenant','property']));
    }

    public function show(MaintenanceRequest $maintenanceRequest)
    {
        return new MaintenanceRequestResource($maintenanceRequest->load(['tenant','property']));
    }

    public function update(Request $r, MaintenanceRequest $maintenanceRequest)
    {
        $data = $r->validate([
            'status'=>'nullable|in:pending,in_progress,completed,cancelled',
            'assigned_to'=>'nullable|exists:users,id',
            'description'=>'nullable|string'
        ]);

        $maintenanceRequest->update($data);
        return new MaintenanceRequestResource($maintenanceRequest->fresh()->load(['tenant','property']));
    }

    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        $maintenanceRequest->delete();
        return response()->json(['message'=>'Maintenance request removed']);
    }
}
