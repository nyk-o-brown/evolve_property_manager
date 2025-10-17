<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyUnit extends Model
{
    use HasFactory;

    protected $table = 'properties_units';
    protected $primaryKey = 'unit_ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'property_ID',
        'user_ID',
        'tenant_ID',
        'user_name',
        'unit_name',
        'rent_price',
        'tenant_status'
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_ID');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_ID');
    }
}
