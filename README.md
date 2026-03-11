# 🌍 World Tax Brackets

Progressive income tax brackets for 11 countries in machine-readable JSON — plus ready-to-use calculators in JavaScript and Python.

![Countries](https://img.shields.io/badge/countries-11-blue)
![Format](https://img.shields.io/badge/format-JSON-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## Why this exists

Tax bracket data is scattered across government websites in inconsistent formats, buried in PDFs, or hidden behind paywalls. This repo provides clean, structured, open data that anyone can use — whether you're building a salary calculator, comparing tax burdens, or just curious about how much you'd pay in another country.

## Countries

| Country | Code | Currency | Top Rate | Brackets | Includes Social |
|---------|------|----------|----------|----------|-----------------|
| 🇦🇺 Australia | AU | AUD | 45.0% | 5 | No |
| 🇨🇦 Canada | CA | CAD | 40.0% | 5 | Yes |
| 🇫🇷 France | FR | EUR | 45.0% | 5 | No |
| 🇩🇪 Germany | DE | EUR | 45.0% | 5 | No |
| 🇮🇪 Ireland | IE | EUR | 40.0% | 2 | No |
| 🇳🇱 Netherlands | NL | EUR | 49.5% | 2 | Yes |
| 🇸🇬 Singapore | SG | SGD | 22.0% | 11 | No |
| 🇨🇭 Switzerland | CH | CHF | 15.0% | 10 | No |
| 🇦🇪 UAE | AE | AED | 0.0% | 1 | No |
| 🇬🇧 United Kingdom | GB | GBP | 47.0% | 4 | Yes |
| 🇺🇸 United States | US | USD | 42.0% | 6 | Yes |

> Countries marked "Includes Social" have social security / national insurance contributions baked into the rates for a more realistic take-home estimate.

## Data Format

Each country file in `data/` follows the same schema:

```json
{
  "country": "United States",
  "country_code": "US",
  "currency": "USD",
  "year": 2025,
  "includes_social_contributions": true,
  "brackets": [
    { "min": 0, "max": 11600, "rate": 15.0 },
    { "min": 11600, "max": 47150, "rate": 22.0 },
    { "min": 243725, "max": null, "rate": 42.0 }
  ]
}
```

- `min` / `max` — bracket boundaries in local currency (`null` = no upper limit)
- `rate` — marginal tax rate as a percentage

## Calculators

### JavaScript

```js
const { calculateTax, loadCountry } = require('./calculators/tax.js');

const brackets = loadCountry('US');
const result = calculateTax(brackets, 85000);

console.log(result);
// {
//   totalTax: 17964,
//   effectiveRate: 21.1,
//   netIncome: 67036,
//   breakdown: [...]
// }
```

Works in Node.js and browsers (use `TaxCalc.calculateTax()` in browser context).

### Python

```python
from calculators.tax import calculate_tax, load_country

brackets = load_country("US")
result = calculate_tax(brackets, 85000)

print(result)
# {'totalTax': 17964, 'effectiveRate': 21.1, 'netIncome': 67036, 'breakdown': [...]}
```

### Quick comparison

```bash
$ node calculators/tax.js
Progressive tax on $100,000:

US: Tax = 22,777 | Effective rate = 22.8% | Net = 77,223
GB: Tax = 27,096 | Effective rate = 27.1% | Net = 72,904
DE: Tax = 19,961 | Effective rate = 20.0% | Net = 80,039
SG: Tax = 3,350  | Effective rate = 3.4%  | Net = 96,650
AE: Tax = 0      | Effective rate = 0.0%  | Net = 100,000
```

## Use Cases

- **Salary comparison tools** — show net income across countries
- **Relocation planning** — estimate tax impact before moving
- **Financial apps** — embed tax calculations without maintaining bracket data
- **Research & journalism** — analyze tax burden distribution

## Contributing

To add or update a country:

1. Create `data/{COUNTRY_CODE}.json` following the existing schema
2. Use official government sources for bracket data
3. Note in `includes_social_contributions` whether rates include social charges
4. Open a PR with your source links

## Compare Your Salary Globally

This data powers [ismysalarygood.com](https://ismysalarygood.com) — compare your salary against local benchmarks in 11 countries, adjusted for taxes and cost of living.

## License

MIT
