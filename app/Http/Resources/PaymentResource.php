<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'tenant'=>$this->tenant ? ['id'=>$this->tenant->id,'name'=>$this->tenant->name] : null,
            'property'=>$this->property ? ['id'=>$this->property->id,'address'=>$this->property->address] : null,
            'amount'=>$this->amount,
            'date'=>$this->date,
            'status'=>$this->status,
            'external_payment_id'=>$this->external_payment_id,
            'notes'=>$this->notes,
            'created_at'=>$this->created_at,
        ];
    }
}
