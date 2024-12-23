interface DebtBalances {
  studentLoans: number;
  creditCards: number;
  otherLoans: number;
}

export function distributeDebtPayments(
  monthlyDebtPayment: number,
  debtBalances: DebtBalances
): DebtBalances {
  const totalDebt = Object.values(debtBalances).reduce((sum, debt) => sum + debt, 0);
  
  if (totalDebt === 0) return { studentLoans: 0, creditCards: 0, otherLoans: 0 };

  return {
    studentLoans: monthlyDebtPayment * (debtBalances.studentLoans / totalDebt),
    creditCards: monthlyDebtPayment * (debtBalances.creditCards / totalDebt),
    otherLoans: monthlyDebtPayment * (debtBalances.otherLoans / totalDebt)
  };
}