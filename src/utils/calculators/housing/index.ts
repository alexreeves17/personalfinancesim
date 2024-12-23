import { HOUSING_CONSTANTS } from '../constants';
import { calculateMaxMonthlyPayment } from './calculateMaxPayment';
import { calculateLoanAmount } from './calculateLoanAmount';
import { calculateMonthlyPayments } from './calculateMonthlyPayments';

export function calculateHousingAffordability(params: {
  annualIncome: number;
  monthlyDebts: number;
  downPaymentPercent: number;
  mortgageRate: number;
}) {
  const { annualIncome, monthlyDebts, downPaymentPercent, mortgageRate } = params;
  
  console.log('Initial Parameters:', {
    annualIncome,
    monthlyDebts,
    downPaymentPercent,
    mortgageRate
  });

  const monthlyIncome = annualIncome / 12;
  const maxMonthlyPayment = calculateMaxMonthlyPayment(monthlyIncome, monthlyDebts);
  
  console.log('Max Monthly Payment:', maxMonthlyPayment);

  // If max monthly payment is 0 or negative, return minimum values
  if (maxMonthlyPayment <= 0) {
    console.log('Max monthly payment is 0 or negative, returning minimum values');
    return {
      maxHomePrice: 0,
      recommendedPrice: 0,
      downPayment: 0,
      monthlyPayment: 0,
      breakdown: { mortgage: 0, tax: 0, insurance: 0 }
    };
  }

  // Start with a conservative initial estimate
  let maxHomePrice = (monthlyIncome * 12 * 3); // 3x annual income as starting point
  let previousHomePrice = 0;
  let iteration = 0;
  const maxIterations = 10;
  const convergenceThreshold = 1000;

  while (Math.abs(maxHomePrice - previousHomePrice) > convergenceThreshold && iteration < maxIterations) {
    previousHomePrice = maxHomePrice;
    
    const loanAmount = calculateLoanAmount(maxMonthlyPayment, mortgageRate, maxHomePrice);
    const downPaymentRate = Math.max(0.03, downPaymentPercent / 100);
    
    // Only update maxHomePrice if loanAmount is valid
    if (loanAmount > 0) {
      maxHomePrice = loanAmount / (1 - downPaymentRate);
    } else {
      // If loan amount is 0, reduce the estimate and try again
      maxHomePrice = previousHomePrice * 0.75;
    }
    
    console.log(`Iteration ${iteration + 1}:`, {
      previousPrice: previousHomePrice,
      newPrice: maxHomePrice,
      difference: Math.abs(maxHomePrice - previousHomePrice),
      loanAmount
    });

    iteration++;
  }

  // Apply safety margin and calculate final values
  const recommendedPrice = maxHomePrice * HOUSING_CONSTANTS.SAFETY_MARGIN;
  const downPayment = recommendedPrice * (downPaymentPercent / 100);
  const loanAmount = recommendedPrice - downPayment;

  console.log('Final Calculations:', {
    maxHomePrice,
    recommendedPrice,
    downPayment,
    loanAmount
  });

  const payments = calculateMonthlyPayments(loanAmount, recommendedPrice, mortgageRate);

  console.log('Monthly Payments:', payments);

  return {
    maxHomePrice: Math.round(maxHomePrice),
    recommendedPrice: Math.round(recommendedPrice),
    downPayment: Math.round(downPayment),
    monthlyPayment: payments.total,
    breakdown: payments
  };
}