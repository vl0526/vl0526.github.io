#!/usr/bin/env python3
"""
This script generates a JSON file with 1,000 simple math puzzles.

Each puzzle contains a Vietnamese question (``câu``) and an answer (``đáp án``).
We randomly choose two integers between 1 and 100 and an operation (addition,
subtraction or multiplication). Subtraction is adjusted to avoid negative
results by sorting the operands. The generated puzzles are saved to
``puzzles.json`` in the same directory as this script.
"""

import json
import random
import os


def generate_puzzles(n=1000, seed=42):
    random.seed(seed)
    puzzles = []
    ops = [('+', lambda a, b: a + b),
           ('-', lambda a, b: a - b if a >= b else b - a),
           ('×', lambda a, b: a * b)]
    for i in range(1, n + 1):
        a = random.randint(1, 100)
        b = random.randint(1, 100)
        op_symbol, op_func = random.choice(ops)
        # Ensure subtraction yields non‑negative results
        if op_symbol == '-':
            a, b = max(a, b), min(a, b)
        question = f"Câu {i}: {a} {op_symbol} {b} = ?"
        answer = str(op_func(a, b))
        puzzles.append({"question": question, "answer": answer})
    return puzzles


def main():
    puzzles = generate_puzzles()
    # Determine the output path relative to this script
    output_path = os.path.join(os.path.dirname(__file__), 'puzzles.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(puzzles, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()