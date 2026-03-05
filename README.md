# Problem 104 — It's All Magic 🃏

A web tool to compute the **maximum deck size N** for the magic card trick problem.

---

## Problem Summary

You and a friend perform a magic trick with a deck of N distinct cards:
- A spectator picks **M cards**
- Your friend hides **1 card**, arranges the remaining **M−1 visibly**
- The spectator performs up to **S adjacent swaps** on the sequence
- You must identify the hidden card from the final arrangement alone

**Goal:** Find the largest N for which guaranteed identification is always possible.

---

## How It Works

Your friend encodes the hidden card as one of `(M−1)!` permutations.  
The spectator corrupts the signal with ≤ S adjacent swaps (inversions).  
Permutations within inversion-distance S are indistinguishable, so each "code" covers `T(n, S)` permutations.

```
Max Deck Size N = floor( (M−1)! / T(n, S) )
```

Where `T(n, S)` = number of permutations of n elements with ≤ S inversions, computed via DP.

---

## File Structure

```
magic_deck/
├── README.md       ← You are here
├── index.html      ← UI layout and structure
├── style.css       ← All visual styling
└── script.js       ← Algorithm (DP) + interaction logic
```

---

## Running Locally

Just open `index.html` in any modern browser. No dependencies or build step required.

---

## Example

| M | S | N (Max Deck Size) |
|---|---|-------------------|
| 5 | 1 | 4                 |
| 5 | 0 | 24                |
| 4 | 2 | 3                 |
| 6 | 3 | 20                |

---

## Algorithm — script.js

The DP recurrence:
- `dp[i][j]` = number of permutations of size `i` with exactly `j` inversions
- `dp[i][j] += dp[i-1][j-k]` for `k in 0..min(j, i-1)`
- Uses **BigInt** to handle large factorials without precision loss