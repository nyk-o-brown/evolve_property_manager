<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceRequestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'tenant'=>$this->tenant ? ['id'=>$this->tenant->id,'name'=>$this->tenant->name] : null,
            'property'=>$this->property ? ['id'=>$this->property->id,'address'=>$this->property->address] : null,
            'description'=>$this->description,
            'status'=>$this->status,
            'assigned_to'=>$this->assigned_to,
            'attachments'=>$this->attachments,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
        ];
    }
}
