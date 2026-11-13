/**
 * Kenyan Tax & Statutory Payroll Regulations (KRA & Ministry of Labour)
 * Includes PAYE (Finance Act), SHIF (2.75%), Housing Levy (1.5%), NSSF Tier I & II, and Turnover Tax (3%).
 */

export interface KenyaDeductionsResult {
  grossPay: number;
  nssf: number;
  taxablePay: number;
  payeBeforeRelief: number;
  personalRelief: number;
  paye: number;
  shif: number;
  housingLevy: number;
  totalDeductions: number;
  netPay: number;
}

/**
 * Calculates NSSF Tier I and Tier II contributions according to Kenya NSSF Act.
 * Tier I: 6% of first KSh 7,000 (max 420)
 * Tier II: 6% of remainder up to KSh 36,000 (max 1,740)
 */
export function calculateKenyaNSSF(grossPay: number): number {
  if (grossPay <= 0) return 0;
  const tierILimit = 7000;
  const tierIILimit = 36000;

  const tierI = Math.min(grossPay, tierILimit) * 0.06;
  const tierII = grossPay > tierILimit
    ? Math.min(grossPay - tierILimit, tierIILimit - tierILimit) * 0.06
    : 0;

  return Math.round(tierI + tierII);
}

/**
 * Calculates Affordable Housing Levy (AHL) = 1.5% of gross pay.
 */
export function calculateKenyaHousingLevy(grossPay: number): number {
  if (grossPay <= 0) return 0;
  return Math.round(grossPay * 0.015);
}

/**
 * Calculates Social Health Insurance Fund (SHIF) = 2.75% of gross salary (min 300).
 */
export function calculateKenyaSHIF(grossPay: number): number {
  if (grossPay <= 0) return 0;
  const shif = grossPay * 0.0275;
  return Math.max(300, Math.round(shif));
}

/**
 * Calculates PAYE tax using official progressive KRA tax brackets.
 * Relief: KSh 2,400 monthly personal relief.
 */
export function calculateKenyaPAYE(taxablePay: number): { taxBeforeRelief: number; relief: number; paye: number } {
  if (taxablePay <= 0) return { taxBeforeRelief: 0, relief: 0, paye: 0 };

  const relief = 2400;
  let tax = 0;
  let rem = taxablePay;

  // Band 1: Up to 24,000 @ 10%
  const b1 = Math.min(rem, 24000);
  tax += b1 * 0.10;
  rem -= b1;

  // Band 2: Next 8,333 (24,001 - 32,333) @ 25%
  if (rem > 0) {
    const b2 = Math.min(rem, 8333);
    tax += b2 * 0.25;
    rem -= b2;
  }

  // Band 3: Next 467,667 (32,334 - 500,000) @ 30%
  if (rem > 0) {
    const b3 = Math.min(rem, 467667);
    tax += b3 * 0.30;
    rem -= b3;
  }

  // Band 4: Next 300,000 (500,001 - 800,000) @ 32.5%
  if (rem > 0) {
    const b4 = Math.min(rem, 300000);
    tax += b4 * 0.325;
    rem -= b4;
  }

  // Band 5: Above 800,000 @ 35%
  if (rem > 0) {
    tax += rem * 0.35;
  }

  const netPAYE = Math.max(0, Math.round(tax - relief));
  return {
    taxBeforeRelief: Math.round(tax),
    relief,
    paye: netPAYE
  };
}

/**
 * Complete payroll calculation for a Kenyan beauty salon employee
 */
export function computeKenyanPayroll(
  payType: 'salary' | 'commission' | 'hybrid',
  baseSalary: number,
  serviceSales: number,
  productSales: number,
  serviceCommissionRate: number, // e.g. 0.30
  productCommissionRate: number // e.g. 0.10
): KenyaDeductionsResult {
  let base = 0;
  let commission = 0;

  if (payType === 'salary') {
    base = baseSalary;
    commission = 0;
  } else if (payType === 'commission') {
    base = 0;
    commission = (serviceSales * serviceCommissionRate) + (productSales * productCommissionRate);
  } else {
    // Hybrid: base + commission
    base = baseSalary;
    commission = (serviceSales * serviceCommissionRate) + (productSales * productCommissionRate);
  }

  const grossPay = Math.round(base + commission);
  const nssf = calculateKenyaNSSF(grossPay);
  const housingLevy = calculateKenyaHousingLevy(grossPay);
  const shif = calculateKenyaSHIF(grossPay);

  const taxablePay = Math.max(0, grossPay - nssf);
  const { paye } = calculateKenyaPAYE(taxablePay);

  const totalDeductions = nssf + housingLevy + shif + paye;
  const netPay = Math.max(0, grossPay - totalDeductions);

  return {
    grossPay,
    nssf,
    taxablePay,
    payeBeforeRelief: 0,
    personalRelief: 2400,
    paye,
    shif,
    housingLevy,
    totalDeductions,
    netPay
  };
}

/**
 * Calculates Kenyan Turnover Tax (TOT) for MSME Salons = 3% of gross turnover
 */
export function calculateKenyaTurnoverTax(grossTurnoverKSh: number): number {
  return Math.round(grossTurnoverKSh * 0.03);
}

export interface MonthlySalonTaxSummary {
  periodLabel: string;
  totalSalesKSh: number;
  mpesaSalesKSh: number;
  cashSalesKSh: number;
  totalExpensesKSh: number;
  netOperatingProfitKSh: number;
  // KRA Business Taxes
  turnoverTax3PercentKSh: number; // 3% of Gross Sales
  corporateTax30PercentKSh: number; // 30% of Net Profit (for comparison)
  // Payroll Statutory Remittances for Month
  payrollGrossKSh: number;
  totalPAYEKSh: number;
  totalSHIFKSh: number;
  totalHousingLevyCombinedKSh: number; // 1.5% employee + 1.5% employer
  totalNSSFKSh: number;
  // Total Remittance Payable to KRA for this Month
  totalKRAPayableKSh: number; // Turnover Tax + PAYE + Housing Levy + SHIF + NSSF
  dueTaxDateNotice: string;
}

export function computeMonthlySalonTaxSummary(
  sales: { date: string; amountKSh: number; paymentMethod: string }[],
  expenses: { date: string; amountKSh: number }[],
  payrollList: { grossPay: number; paye: number; shif: number; housingLevy: number; nssf: number }[],
  selectedMonthPrefix?: string // e.g. "2026-11" or undefined for all
): MonthlySalonTaxSummary {
  // Filter sales and expenses by month if specified
  const filteredSales = selectedMonthPrefix && selectedMonthPrefix !== 'all'
    ? sales.filter((s) => s.date.startsWith(selectedMonthPrefix))
    : sales;

  const filteredExpenses = selectedMonthPrefix && selectedMonthPrefix !== 'all'
    ? expenses.filter((e) => e.date.startsWith(selectedMonthPrefix))
    : expenses;

  const totalSalesKSh = filteredSales.reduce((acc, s) => acc + s.amountKSh, 0);
  const mpesaSalesKSh = filteredSales.filter((s) => s.paymentMethod === 'M-Pesa').reduce((acc, s) => acc + s.amountKSh, 0);
  const cashSalesKSh = filteredSales.filter((s) => s.paymentMethod === 'Cash').reduce((acc, s) => acc + s.amountKSh, 0);

  const totalExpensesKSh = filteredExpenses.reduce((acc, e) => acc + e.amountKSh, 0);
  const netOperatingProfitKSh = Math.max(0, totalSalesKSh - totalExpensesKSh);

  const turnoverTax3PercentKSh = calculateKenyaTurnoverTax(totalSalesKSh);
  const corporateTax30PercentKSh = Math.round(netOperatingProfitKSh * 0.30);

  const payrollGrossKSh = payrollList.reduce((acc, p) => acc + p.grossPay, 0);
  const totalPAYEKSh = payrollList.reduce((acc, p) => acc + p.paye, 0);
  const totalSHIFKSh = payrollList.reduce((acc, p) => acc + p.shif, 0);
  const totalHousingLevyCombinedKSh = payrollList.reduce((acc, p) => acc + (p.housingLevy * 2), 0); // 1.5% EE + 1.5% ER
  const totalNSSFKSh = payrollList.reduce((acc, p) => acc + (p.nssf * 2), 0); // Tier I + II EE + ER

  // Total Statutory and KRA remittance due for the month
  const totalKRAPayableKSh = turnoverTax3PercentKSh + totalPAYEKSh + totalHousingLevyCombinedKSh + totalSHIFKSh + totalNSSFKSh;

  return {
    periodLabel: selectedMonthPrefix && selectedMonthPrefix !== 'all' ? selectedMonthPrefix : 'All Recorded Months',
    totalSalesKSh,
    mpesaSalesKSh,
    cashSalesKSh,
    totalExpensesKSh,
    netOperatingProfitKSh,
    turnoverTax3PercentKSh,
    corporateTax30PercentKSh,
    payrollGrossKSh,
    totalPAYEKSh,
    totalSHIFKSh,
    totalHousingLevyCombinedKSh,
    totalNSSFKSh,
    totalKRAPayableKSh,
    dueTaxDateNotice: 'Due by the 9th / 20th of the following month via KRA Paybill 222222'
  };
}

