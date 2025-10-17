<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;
use App\Http\Resources\TenantResource;

class TenantController extends Controller
{
    public function index(Request $r)
    {
        $q = Tenant::with('property');
        if ($r->filled('search')) {
            $q->where('name','like','%'.$r->search.'%');
        }
        return TenantResource::collection($q->paginate($r->get('per_page',15)));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'property_id'=>'required|exists:properties,id',
            'name'=>'required|string',
            'email'=>'nullable|email',
            'contact'=>'nullable|string',
            'lease_start'=>'nullable|date',
            'lease_end'=>'nullable|date',
        ]);

        $tenant = Tenant::create($data);
        return new TenantResource($tenant->load('property'));
    }

    public function show(Tenant $tenant)
    {
        return new TenantResource($tenant->load(['property','payments']));
    }

    public function update(Request $r, Tenant $tenant)
    {
        $data = $r->validate([
            'name'=>'sometimes|required|string',
            'email'=>'nullable|email',
            'contact'=>'nullable|string',
            'lease_start'=>'nullable|date',
            'lease_end'=>'nullable|date',
        ]);

        $tenant->update($data);
        return new TenantResource($tenant->fresh()->load(['property','payments']));
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return response()->json(['message'=>'Tenant removed']);
    }
}
