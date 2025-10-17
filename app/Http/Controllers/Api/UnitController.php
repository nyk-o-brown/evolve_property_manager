<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyUnit;
use App\Models\Property;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UnitController extends Controller
{
    // POST /api/units/add
    public function add(Request $request)
    {
        // require authentication & role check if needed
        $user = $request->user();
        // optional: only landlords or admin can add units
        if ($user && !in_array($user->role, ['admin','landlord'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $rules = [
            'property_ID' => 'required|integer|exists:properties,id',
            'unit_name' => 'required|string|max:255',
            'rent_price' => 'required|numeric|min:0',
            'tenant_status' => 'nullable|in:occupied,pending,unoccupied'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        $payload = $validator->validated();

        // create unit
        $unit = PropertyUnit::create([
            'property_ID' => $payload['property_ID'],
            'unit_name' => $payload['unit_name'],
            'rent_price' => $payload['rent_price'],
            'tenant_status' => $payload['tenant_status'] ?? 'unoccupied',
            'user_name' => null,
            'user_ID' => null,
            'tenant_ID' => null
        ]);

        return response()->json(['success'=>true, 'unit'=>$unit], 201);
    }

    // PUT /api/units/edit/{unit_ID}
    public function edit(Request $request, $unit_ID)
    {
        $user = $request->user();
        if ($user && !in_array($user->role, ['admin','landlord'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $unit = PropertyUnit::find($unit_ID);
        if (!$unit) {
            return response()->json(['message'=>'Unit not found'], 404);
        }

        $rules = [
            'unit_name' => 'sometimes|required|string|max:255',
            'rent_price' => 'sometimes|required|numeric|min:0',
            'tenant_status' => 'sometimes|required|in:occupied,pending,unoccupied'
        ];

        $data = $request->only(['unit_name','rent_price','tenant_status']);
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        $unit->update($validator->validated());

        return response()->json(['success'=>true, 'unit'=>$unit->fresh()], 200);
    }
}
