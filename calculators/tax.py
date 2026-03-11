"""
Progressive Tax Calculator

Usage:
    from tax import calculate_tax, load_country

    brackets = load_country("US")
    result = calculate_tax(brackets, 85000)
    print(result)
"""

import json
import os
from pathlib import Path


def calculate_tax(brackets: list[dict], gross_income: int | float) -> dict:
    """
    Calculate progressive tax for a given income.

    Args:
        brackets: List of dicts with keys: min, max (null=no limit), rate (decimal, e.g. 0.22 = 22%).
        gross_income: Annual gross income in local currency.

    Returns:
        Dict with totalTax, effectiveRate, netIncome, breakdown.
    """
    if gross_income <= 0:
        return {"totalTax": 0, "effectiveRate": 0.0, "netIncome": 0, "breakdown": []}

    total_tax = 0
    breakdown = []

    for b in brackets:
        b_min = b["min"]
        b_max = b["max"] if b["max"] is not None else float("inf")
        rate = b["rate"] / 100 if b["rate"] > 1 else b["rate"]

        if gross_income <= b_min:
            break

        taxable = min(gross_income - b_min, b_max - b_min)
        tax = round(taxable * rate)
        total_tax += tax

        breakdown.append({
            "min": b_min,
            "max": b["max"],
            "rate": b["rate"],
            "taxable": taxable,
            "tax": tax,
        })

    effective_rate = round((total_tax / gross_income) * 100, 1)

    return {
        "totalTax": total_tax,
        "effectiveRate": effective_rate,
        "netIncome": gross_income - total_tax,
        "breakdown": breakdown,
    }


def load_country(country_code: str, data_dir: str | None = None) -> list[dict]:
    """Load tax brackets from a country JSON file."""
    if data_dir is None:
        data_dir = Path(__file__).parent.parent / "data"
    filepath = Path(data_dir) / f"{country_code.upper()}.json"
    with open(filepath) as f:
        data = json.load(f)
    return data["brackets"]


if __name__ == "__main__":
    income = 100_000
    countries = ["US", "GB", "DE", "SG", "AE"]

    print(f"Progressive tax on {income:,}:\n")

    for code in countries:
        brackets = load_country(code)
        result = calculate_tax(brackets, income)
        print(
            f"{code}: Tax = {result['totalTax']:,}"
            f" | Effective rate = {result['effectiveRate']}%"
            f" | Net = {result['netIncome']:,}"
        )
