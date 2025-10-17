<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Tenant;
use App\Models\PropertyUnit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class TenantManagementController extends Controller
{
    // POST /api/tenants/add
    public function add(Request $request)
    {
        $authUser = $request->user();
        if ($authUser && !in_array($authUser->role, ['admin','landlord'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $rules = [
            'user_name' => 'required|string|max:255',
            'unit_ID' => 'required|integer|exists:properties_units,unit_ID',
            'property_ID' => 'required|integer|exists:properties,id',
            'email' => 'nullable|email|unique:users,email'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) return response()->json(['errors'=>$validator->errors()], 422);

        $data = $validator->validated();

        return DB::transaction(function() use ($data) {
            // fetch unit and ensure it belongs to property and is unoccupied or pending
            $unit = PropertyUnit::where('unit_ID', $data['unit_ID'])->first();
            if (!$unit) return response()->json(['message'=>'Unit not found'], 404);
            if ($unit->property_ID != $data['property_ID']) {
                return response()->json(['message'=>'Unit does not belong to provided property_ID'], 422);
            }
            if ($unit->tenant_status === 'occupied') {
                return response()->json(['message'=>'Unit already occupied'], 409);
            }

            // create a user account for tenant (password is random; frontend should set/change)
            $password = bin2hex(random_bytes(6)); // simple temporary password
            $user = User::create([
                'name' => $data['user_name'],
                'email' => $data['email'] ?? null,
                'password' => Hash::make($password),
                'role' => 'tenant'
            ]);

            // create tenant record
            $tenant = Tenant::create([
                'user_id' => $user->id,
                'property_id' => $data['property_ID'],
                'unit_id' => $unit->unit_ID,
                'name' => $data['user_name'],
                'email' => $data['email'] ?? null,
                'contact' => $request->input('contact') ?? null,
                'lease_start' => $request->input('lease_start') ?? null,
                'lease_end' => $request->input('lease_end') ?? null,
            ]);

            // update unit record: link to user and tenant and set tenant_status = 'occupied'
            $unit->user_ID = $user->id;
            $unit->tenant_ID = $tenant->id;
            $unit->user_name = $data['user_name'];
            $unit->tenant_status = 'occupied';
            $unit->save();

            // return tenant profile (user + tenant + unit)
            $tenant->load('property');
            $user->makeHidden(['password']);

            return response()->json([
                'success' => true,
                'user' => $user,
                'tenant' => $tenant,
                'unit' => $unit,
                'temporary_password' => $password // remove or send via secure channel in production
            ], 201);
        });
    }

    // PUT /api/tenants/edit/{user_ID}
    public function edit(Request $request, $user_ID)
    {
        $authUser = $request->user();
        if ($authUser && !in_array($authUser->role, ['admin','landlord'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::find($user_ID);
        if (!$user) return response()->json(['message'=>'User not found'], 404);

        $rules = [
            'user_name' => 'nullable|string|max:255',
            'unit_ID' => 'nullable|integer|exists:properties_units,unit_ID',
            'property_ID' => 'nullable|integer|exists:properties,id',
            'email' => ['nullable','email', Rule::unique('users','email')->ignore($user->id)],
            'contact' => 'nullable|string',
            'lease_start' => 'nullable|date',
            'lease_end' => 'nullable|date'
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) return response()->json(['errors'=>$validator->errors()], 422);

        $data = $validator->validated();

        return DB::transaction(function() use ($user, $data) {
            // update user
            if (isset($data['user_name'])) $user->name = $data['user_name'];
            if (isset($data['email'])) $user->email = $data['email'];
            $user->save();

            // find tenant record linked to this user (if exists)
            $tenant = Tenant::where('user_id', $user->id)->first();

            if (!$tenant) {
                // create tenant record if not exists
                $tenant = Tenant::create([
                    'user_id' => $user->id,
                    'property_id' => $data['property_ID'] ?? null,
                    'unit_id' => $data['unit_ID'] ?? null,
                    'name' => $data['user_name'] ?? $user->name,
                    'email' => $data['email'] ?? $user->email,
                    'contact' => $data['contact'] ?? null
                ]);
            } else {
                // update tenant fields if provided
                if (isset($data['user_name'])) $tenant->name = $data['user_name'];
                if (isset($data['email'])) $tenant->email = $data['email'];
                if (isset($data['contact'])) $tenant->contact = $data['contact'];
                if (isset($data['lease_start'])) $tenant->lease_start = $data['lease_start'];
                if (isset($data['lease_end'])) $tenant->lease_end = $data['lease_end'];
            }

            // handle unit reassignment
            $old_unit = $tenant->unit_id ? PropertyUnit::where('unit_ID', $tenant->unit_id)->first() : null;
            $new_unit = null;

            if (isset($data['unit_ID'])) {
                $new_unit = PropertyUnit::where('unit_ID', $data['unit_ID'])->first();
                if (!$new_unit) {
                    return response()->json(['message'=>'New unit not found'], 404);
                }
                // check new_unit property match if property provided
                if (isset($data['property_ID']) && $new_unit->property_ID != $data['property_ID']) {
                    return response()->json(['message'=>'New unit does not belong to provided property_ID'], 422);
                }
                // ensure new unit isn't occupied by another tenant
                if ($new_unit->tenant_status === 'occupied' && $new_unit->user_ID !== $user->id) {
                    return response()->json(['message'=>'Requested unit is already occupied'], 409);
                }

                // update tenant to new unit_id & property
                $tenant->unit_id = $new_unit->unit_ID;
                $tenant->property_id = $new_unit->property_ID;
            } elseif (isset($data['property_ID'])) {
                // just update property_id if requested
                $tenant->property_id = $data['property_ID'];
            }

            $tenant->save();

            // Update unit status: release old unit, occupy new unit
            if ($old_unit && (!$new_unit || $old_unit->unit_ID !== ($new_unit->unit_ID ?? null))) {
                $old_unit->user_ID = null;
                $old_unit->tenant_ID = null;
                $old_unit->user_name = null;
                $old_unit->tenant_status = 'unoccupied';
                $old_unit->save();
            }

            if ($new_unit) {
                $new_unit->user_ID = $user->id;
                $new_unit->tenant_ID = $tenant->id;
                $new_unit->user_name = $tenant->name;
                $new_unit->tenant_status = 'occupied';
                $new_unit->save();
            }

            $user->makeHidden(['password']);

            return response()->json([
                'success' => true,
                'user' => $user,
                'tenant' => $tenant->fresh(),
                'unit_old' => $old_unit,
                'unit_new' => $new_unit
            ]);
        });
    }
}
