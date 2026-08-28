"use client";

import { TransactionWorkspaceTabs } from "@/components/portal/TransactionWorkspaceTabs";

export function BuyerTransactionWorkspace({ transactionId }: { transactionId: string }) {
  return (
    <TransactionWorkspaceTabs
      transactionId={transactionId}
      apiBase="/api/portal/buyer/transactions"
      mode="buyer"
      showFinance={false}
      showStaffActions={false}
    />
  );
}
