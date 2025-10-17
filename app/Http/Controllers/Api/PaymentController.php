<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Tenant;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Http\Resources\PaymentResource;

class PaymentController extends Controller
{
    public function index(Request $r)
    {
        $q = Payment::with(['tenant','property']);
        if ($r->filled('tenant_id')) $q->where('tenant_id',$r->tenant_id);
        return PaymentResource::collection($q->paginate($r->get('per_page',15)));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'tenant_id'=>'required|exists:tenants,id',
            'property_id'=>'required|exists:properties,id',
            'amount'=>'required|numeric',
            'date'=>'nullable|date',
            'notes'=>'nullable|string'
        ]);

        $payment = Payment::create(array_merge($data, ['date'=>$data['date'] ?? now(), 'status'=>'completed']));
        return new PaymentResource($payment->load(['tenant','property']));
    }

    // Stripe checkout (server-side create PaymentIntent)
    public function checkoutIntent(Request $r)
    {
        $data = $r->validate([
            'tenant_id'=>'required|exists:tenants,id',
            'property_id'=>'required|exists:properties,id',
            'amount'=>'required|numeric'
        ]);

        // Create pending payment record
        $payment = Payment::create([
            'tenant_id'=>$data['tenant_id'],
            'property_id'=>$data['property_id'],
            'amount'=>$data['amount'],
            'status'=>'pending',
            'date'=>now()
        ]);

        // Create Stripe PaymentIntent
        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount' => (int) round($data['amount'] * 100),
            'currency' => 'usd',
            'metadata' => [
                'payment_id' => $payment->id
            ]
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'payment' => $payment
        ]);
    }

    // Called after frontend confirms payment
    public function confirm(Request $r, Payment $payment)
    {
        $r->validate(['external_payment_id'=>'required|string','status'=>'required|in:completed,failed']);

        $payment->update([
            'external_payment_id' => $r->external_payment_id,
            'status' => $r->status
        ]);

        return new PaymentResource($payment->fresh());
    }

    public function show(Payment $payment)
    {
        return new PaymentResource($payment->load(['tenant','property']));
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(['message'=>'Payment deleted']);
    }
}
