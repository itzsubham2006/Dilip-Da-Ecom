'use client';

import { ShieldCheck, Loader2, AlertTriangle, CheckCircle, Ban, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { checkBNPLEligibility } from '../actions';
import { formatCurrency } from '@/lib/utils';

interface BNPLPaymentOptionProps {
  selected: boolean;
  onSelect: () => void;
  orderTotal: number;
}

export default function BNPLPaymentOption({ selected, onSelect, orderTotal }: BNPLPaymentOptionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['bnpl-eligibility'],
    queryFn: checkBNPLEligibility,
    enabled: selected,
  });

  const eligibility = data?.data;
  const hasInsufficientCredit = eligibility?.account && eligibility.account.available_credit < orderTotal;
  const isUnverified = eligibility?.account?.verification_status === 'pending';
  const isRejected = eligibility?.account?.verification_status === 'rejected';
  const isSuspended = eligibility?.account?.status === 'suspended';

  return (
    <div>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
          selected ? 'border-[#E23744] bg-red-50 dark:bg-red-950/20' : 'border-zborder dark:border-[#2A2A2A] hover:border-ztext-light'
        }`}
      >
        <ShieldCheck size={20} className="mt-0.5 shrink-0" style={{ color: selected ? '#E23744' : '#9C9C9C' }} />
        <div className="flex-1">
          <p className="font-semibold text-ztext text-sm">Ethics Pay (Buy Now, Pay Later)</p>
          <p className="text-xs text-ztext-light mt-0.5">Pay in 15 days. Zero interest.</p>
        </div>
      </button>

      {selected && (
        <div className="mt-3 pl-7">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-ztext-light">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking eligibility...
            </div>
          ) : isRejected ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50">
              <AlertTriangle className="w-4 h-4 text-zred mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Credit Not Approved</p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">Your credit application was not approved. Contact support for details.</p>
              </div>
            </div>
          ) : isSuspended ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50">
              <Ban className="w-4 h-4 text-zred mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Account Suspended</p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">Your credit account is suspended. Contact support.</p>
              </div>
            </div>
          ) : isUnverified ? (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Verification Pending</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400/80 mt-0.5">Your account is being verified. You&apos;ll be notified once approved.</p>
              </div>
            </div>
          ) : hasInsufficientCredit ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50">
              <AlertTriangle className="w-4 h-4 text-zred mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Insufficient Credit</p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">
                  Available: {formatCurrency(eligibility?.account?.available_credit || 0)} &bull;
                  Required: {formatCurrency(orderTotal)}
                </p>
              </div>
            </div>
          ) : eligibility?.eligible ? (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/50">
              <CheckCircle className="w-4 h-4 text-zgreen mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Eligible for BNPL</p>
                <p className="text-xs text-green-600 dark:text-green-400/80 mt-0.5">
                  Available credit: {formatCurrency(eligibility?.account?.available_credit || 0)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
