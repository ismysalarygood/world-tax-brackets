interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

interface TaxBreakdownItem {
  min: number;
  max: number | null;
  rate: number;
  taxable: number;
  tax: number;
}

interface TaxResult {
  totalTax: number;
  effectiveRate: number;
  netIncome: number;
  breakdown: TaxBreakdownItem[];
}

/**
 * Calculate progressive tax for a given income.
 * @param brackets - Array of tax brackets. Rate as decimal (0.22 = 22%).
 * @param grossIncome - Annual gross income in local currency.
 */
export function calculateTax(brackets: TaxBracket[], grossIncome: number): TaxResult;

/**
 * Load tax brackets from a country JSON file (Node.js only).
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g. 'US', 'DE').
 * @param dataDir - Optional path to data directory.
 */
export function loadCountry(countryCode: string, dataDir?: string): TaxBracket[];
