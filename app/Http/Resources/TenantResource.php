<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'email'=>$this->email,
            'contact'=>$this->contact,
            'lease_start'=>$this->lease_start,
            'lease_end'=>$this->lease_end,
            'property'=> $this->property ? ['id'=>$this->property->id,'address'=>$this->property->address] : null,
            'payments'=>$this->payments,
        ];
    }
}
