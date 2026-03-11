const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculateTax, loadCountry } = require('../calculators/tax.js');
const fs = require('fs');
const path = require('path');

describe('calculateTax', () => {
  it('returns zero for zero income', () => {
    const result = calculateTax([{ min: 0, max: null, rate: 0.10 }], 0);
    assert.equal(result.totalTax, 0);
    assert.equal(result.effectiveRate, 0);
    assert.equal(result.netIncome, 0);
  });

  it('calculates single bracket correctly', () => {
    const brackets = [{ min: 0, max: null, rate: 0.10 }];
    const result = calculateTax(brackets, 50000);
    assert.equal(result.totalTax, 5000);
    assert.equal(result.netIncome, 45000);
  });

  it('calculates progressive brackets correctly', () => {
    const brackets = [
      { min: 0, max: 10000, rate: 0.10 },
      { min: 10000, max: 50000, rate: 0.20 },
      { min: 50000, max: null, rate: 0.30 },
    ];
    const result = calculateTax(brackets, 80000);
    // 10000 * 0.10 = 1000
    // 40000 * 0.20 = 8000
    // 30000 * 0.30 = 9000
    assert.equal(result.totalTax, 18000);
    assert.equal(result.netIncome, 62000);
    assert.equal(result.breakdown.length, 3);
  });

  it('handles income below first bracket max', () => {
    const brackets = [
      { min: 0, max: 10000, rate: 0.10 },
      { min: 10000, max: null, rate: 0.20 },
    ];
    const result = calculateTax(brackets, 5000);
    assert.equal(result.totalTax, 500);
    assert.equal(result.breakdown.length, 1);
  });

  it('handles 0% tax brackets (UAE)', () => {
    const brackets = loadCountry('AE');
    const result = calculateTax(brackets, 500000);
    assert.equal(result.totalTax, 0);
    assert.equal(result.effectiveRate, 0);
  });
});

describe('loadCountry', () => {
  it('loads US brackets', () => {
    const brackets = loadCountry('US');
    assert.ok(Array.isArray(brackets));
    assert.ok(brackets.length >= 5);
    assert.equal(brackets[0].min, 0);
    assert.ok(brackets[0].rate > 0);
    assert.ok(brackets[0].rate < 1);
  });

  it('loads all 26 country files', () => {
    const dataDir = path.join(__dirname, '..', 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    assert.ok(files.length >= 26, `Expected 26+ countries, got ${files.length}`);

    for (const file of files) {
      const code = file.replace('.json', '');
      const brackets = loadCountry(code);
      assert.ok(Array.isArray(brackets), `${code}: brackets not an array`);
      assert.ok(brackets.length >= 1, `${code}: no brackets`);

      for (const b of brackets) {
        assert.ok(typeof b.min === 'number', `${code}: min not a number`);
        assert.ok(b.max === null || typeof b.max === 'number', `${code}: invalid max`);
        assert.ok(typeof b.rate === 'number', `${code}: rate not a number`);
        assert.ok(b.rate >= 0 && b.rate <= 1, `${code}: rate ${b.rate} not in [0,1]`);
      }
    }
  });

  it('throws for nonexistent country', () => {
    assert.throws(() => loadCountry('ZZ'));
  });
});
