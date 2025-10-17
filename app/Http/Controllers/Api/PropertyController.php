<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use App\Http\Resources\PropertyResource;

class PropertyController extends Controller
{
    public function index(Request $r)
    {
        $q = Property::with(['images','tenants']);
        if ($r->filled('search')) {
            $q->where('address','like','%'.$r->search.'%');
        }
        if ($r->filled('status')) {
            $q->where('status',$r->status);
        }
        $perPage = $r->get('per_page', 15);
        return PropertyResource::collection($q->paginate($perPage));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'address'=>'required|string',
            'rent_amount'=>'required|numeric',
            'landlord_id'=>'required|exists:users,id',
            'description'=>'nullable|string',
            'status'=>'nullable|in:active,archived,maintenance,draft'
        ]);

        $property = Property::create($data);
        return new PropertyResource($property->load(['images','tenants']));
    }

    public function show(Property $property)
    {
        return new PropertyResource($property->load(['images','tenants','payments']));
    }

    public function update(Request $r, Property $property)
    {
        $data = $r->validate([
            'address'=>'sometimes|required|string',
            'rent_amount'=>'sometimes|required|numeric',
            'description'=>'nullable|string',
            'status'=>'nullable|in:active,archived,maintenance,draft'
        ]);

        $property->update($data);
        return new PropertyResource($property->fresh()->load(['images','tenants']));
    }

    public function destroy(Property $property)
    {
        $property->delete();
        return response()->json(['message'=>'Property deleted']);
    }
}
