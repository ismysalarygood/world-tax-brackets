/**
 * Progressive Tax Calculator
 *
 * Works in Node.js and browsers.
 *
 * Usage (Node.js):
 *   const { calculateTax, loadCountry } = require('./tax.js');
 *   const brackets = loadCountry('US');
 *   const result = calculateTax(brackets, 85000);
 *   console.log(result);
 *
 * Usage (Browser):
 *   <script src="tax.js"></script>
 *   const result = TaxCalc.calculateTax(brackets, 85000);
 */

(function (root) {
  'use strict';

  /**
   * Calculate progressive tax for a given income.
   *
   * @param {Array} brackets - Array of { min, max, rate } objects. Rate as decimal (e.g. 0.22 = 22%).
   * @param {number} grossIncome - Annual gross income in local currency.
   * @returns {{ totalTax: number, effectiveRate: number, netIncome: number, breakdown: Array }}
   */
  function calculateTax(brackets, grossIncome) {
    if (grossIncome <= 0) {
      return { totalTax: 0, effectiveRate: 0, netIncome: 0, breakdown: [] };
    }

    var totalTax = 0;
    var breakdown = [];

    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i];
      var min = b.min;
      var max = b.max === null || b.max === undefined ? Infinity : b.max;
      var rate = b.rate > 1 ? b.rate / 100 : b.rate;

      if (grossIncome <= min) break;

      var taxableInBracket = Math.min(grossIncome - min, max - min);
      var taxAmount = Math.round(taxableInBracket * rate);
      totalTax += taxAmount;

      breakdown.push({
        min: min,
        max: b.max,
        rate: b.rate,
        taxable: taxableInBracket,
        tax: taxAmount
      });
    }

    var effectiveRate = Math.round((totalTax / grossIncome) * 10000) / 100;

    return {
      totalTax: totalTax,
      effectiveRate: effectiveRate,
      netIncome: grossIncome - totalTax,
      breakdown: breakdown
    };
  }

  /**
   * Load country data from a JSON file (Node.js only).
   *
   * @param {string} countryCode - Two-letter country code (e.g. 'US', 'DE').
   * @param {string} [dataDir] - Path to data directory. Defaults to '../data'.
   * @returns {Array} brackets array
   */
  function loadCountry(countryCode, dataDir) {
    if (typeof require === 'undefined') {
      throw new Error('loadCountry() is only available in Node.js. In browsers, fetch the JSON and pass brackets directly.');
    }
    var path = require('path');
    var fs = require('fs');
    var dir = dataDir || path.join(__dirname, '..', 'data');
    var filePath = path.join(dir, countryCode.toUpperCase() + '.json');
    var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.brackets;
  }

  // Export for Node.js or browser
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateTax: calculateTax, loadCountry: loadCountry };
  } else {
    root.TaxCalc = { calculateTax: calculateTax };
  }

})(typeof globalThis !== 'undefined' ? globalThis : this);

// --- Example usage (run with: node tax.js) ---
if (typeof require !== 'undefined' && require.main === module) {
  var mod = module.exports;
  var countries = ['US', 'GB', 'DE', 'SG', 'AE'];
  var income = 100000;

  console.log('Progressive tax on $' + income.toLocaleString() + ':\n');

  countries.forEach(function (code) {
    var brackets = mod.loadCountry(code);
    var result = mod.calculateTax(brackets, income);
    console.log(
      code + ': Tax = ' + result.totalTax.toLocaleString() +
      ' | Effective rate = ' + result.effectiveRate + '%' +
      ' | Net = ' + result.netIncome.toLocaleString()
    );
  });
}
