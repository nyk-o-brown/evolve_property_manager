<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'address'=>$this->address,
            'rent_amount'=>$this->rent_amount,
            'status'=>$this->status,
            'description'=>$this->description,
            'landlord'=>$this->landlord ? ['id'=>$this->landlord->id,'name'=>$this->landlord->name] : null,
            'images'=>$this->images->map(function($i){ return ['id'=>$i->id,'url'=>$i->url]; }),
            'tenants'=>$this->tenants,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
        ];
    }
}
