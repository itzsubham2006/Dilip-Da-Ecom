import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/infrastructure/supabase/server';
import { repaymentService } from '@/features/bnpl/services/repayment-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repaymentId, amount, gatewayPaymentId } = body;

    if (!repaymentId) {
      return NextResponse.json({ error: 'repaymentId is required' }, { status: 400 });
    }

    let result;
    if (gatewayPaymentId) {
      result = await repaymentService.processRazorpayRepayment(repaymentId, gatewayPaymentId);
    } else if (amount && amount > 0) {
      result = await repaymentService.processPartialRepayment(repaymentId, amount);
    } else {
      result = await repaymentService.processFullRepayment(repaymentId);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Repayment failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
