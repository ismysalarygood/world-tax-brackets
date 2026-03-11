# World Tax Brackets

Progressive income tax brackets for 26 countries in machine-readable JSON — plus ready-to-use calculators in JavaScript and Python.

![Countries](https://img.shields.io/badge/countries-26-blue)
![Format](https://img.shields.io/badge/format-JSON-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)
[![npm](https://img.shields.io/npm/v/progressive-tax)](https://www.npmjs.com/package/progressive-tax)

## Install

```bash
npm install progressive-tax
```

```js
const { calculateTax, loadCountry } = require('progressive-tax');

const brackets = loadCountry('US');
const result = calculateTax(brackets, 85000);

console.log(result);
// {
//   totalTax: 13498,
//   effectiveRate: 15.88,
//   netIncome: 71502,
//   breakdown: [...]
// }
```

Or use the data files directly — no library needed:

```bash
curl https://raw.githubusercontent.com/ismysalarygood/world-tax-brackets/main/data/US.json
```

## Countries

| Code | Country | Currency | Top Rate | Brackets | Year |
|------|---------|----------|----------|----------|------|
| AE | United Arab Emirates | AED | 0% | 1 | 2025 |
| AT | Austria | EUR | 55% | 7 | 2025 |
| AU | Australia | AUD | 45% | 5 | 2024/25 |
| BE | Belgium | EUR | 50% | 4 | 2025 |
| BR | Brazil | BRL | 28% | 5 | 2025 |
| CA | Canada | CAD | 33% | 5 | 2025 |
| CH | Switzerland | CHF | 12% | 11 | 2025 |
| DE | Germany | EUR | 45% | 5 | 2025 |
| DK | Denmark | DKK | 27% | 2 | 2025 |
| ES | Spain | EUR | 47% | 6 | 2025 |
| FR | France | EUR | 45% | 5 | 2025 |
| GB | United Kingdom | GBP | 45% | 4 | 2025/26 |
| IE | Ireland | EUR | 40% | 2 | 2025 |
| IN | India | INR | 30% | 7 | 2025/26 |
| IT | Italy | EUR | 43% | 3 | 2025 |
| JP | Japan | JPY | 45% | 7 | 2025 |
| KR | South Korea | KRW | 45% | 8 | 2025 |
| NL | Netherlands | EUR | 50% | 3 | 2025 |
| NO | Norway | NOK | 18% | 6 | 2025 |
| NZ | New Zealand | NZD | 39% | 5 | 2025/26 |
| PL | Poland | PLN | 32% | 2 | 2025 |
| PT | Portugal | EUR | 48% | 9 | 2025 |
| SE | Sweden | SEK | 20% | 2 | 2025 |
| SG | Singapore | SGD | 24% | 13 | 2025 |
| TR | Turkey | TRY | 40% | 5 | 2025 |
| US | United States | USD | 37% | 7 | 2025 |

> **Note:** Some countries show only the national/federal component. See each JSON file's `notes` field for details on what's included.

## Data Format

```json
{
  "country": "United States",
  "country_code": "US",
  "currency": "USD",
  "currency_symbol": "$",
  "filing_status": "single",
  "tax_year": 2025,
  "source": "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
  "notes": "Federal income tax only. Does not include state taxes or FICA.",
  "brackets": [
    { "min": 0, "max": 11925, "rate": 0.10 },
    { "min": 11925, "max": 48475, "rate": 0.12 },
    { "min": 48475, "max": 103350, "rate": 0.22 },
    { "min": 626350, "max": null, "rate": 0.37 }
  ]
}
```

- `rate` — marginal tax rate as a decimal (0.22 = 22%)
- `max: null` — no upper limit (top bracket)
- `source` — official government or tax authority URL

## Calculators

### JavaScript (Node.js & Browser)

```js
const { calculateTax, loadCountry } = require('progressive-tax');

// With built-in country data
const brackets = loadCountry('DE');
const result = calculateTax(brackets, 60000);

// With custom brackets
const custom = [
  { min: 0, max: 10000, rate: 0.10 },
  { min: 10000, max: null, rate: 0.25 },
];
const result2 = calculateTax(custom, 50000);
```

Browser (without npm):

```html
<script src="calculators/tax.js"></script>
<script>
  const result = TaxCalc.calculateTax(brackets, 85000);
</script>
```

### Python

```python
from calculators.tax import calculate_tax, load_country

brackets = load_country("TR")
result = calculate_tax(brackets, 500000)
print(f"Tax: ₺{result['totalTax']:,} | Effective: {result['effectiveRate']}%")
```

### Quick Comparison

```
$ node calculators/tax.js
Progressive tax on $100,000:

US: Tax = 16,915 | Effective rate = 16.92% | Net = 83,085
GB: Tax = 27,432 | Effective rate = 27.43% | Net = 72,568
DE: Tax = 26,236 | Effective rate = 26.24% | Net = 73,764
SG: Tax = 5,650  | Effective rate = 5.65%  | Net = 94,350
AE: Tax = 0      | Effective rate = 0%     | Net = 100,000
```

## Use Cases

- **Salary tools** — show net income across countries
- **Relocation planning** — estimate tax impact before moving
- **Fintech apps** — embed tax calculations without maintaining bracket data
- **Payroll systems** — federal tax pre-calculation
- **Research** — analyze and compare tax burden across economies

## Data Sources

Every country file includes a `source` URL linking to the official tax authority or a reputable tax guide (IRS, HMRC, ATO, PwC Tax Summaries, etc.). All brackets reflect 2025 or the current fiscal year.

## Contributing

To add or update a country:

1. Create `data/{COUNTRY_CODE}.json` following the existing format
2. Include `source` URL from an official government source
3. Add `notes` explaining what's included/excluded (federal only, social contributions, etc.)
4. Open a PR

## Compare Your Salary

This data powers the salary comparison tools at [ismysalarygood.com](https://ismysalarygood.com) — see how your salary compares across 26 countries, adjusted for taxes and purchasing power.

## License

MIT
