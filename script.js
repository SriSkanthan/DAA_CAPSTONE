/**
 * script.js — Problem 104: It's All Magic
 *
 * Computes the maximum deck size N for the magic card trick,
 * using a DP on inversion counts.
 *
 * Core formula:
 *   N = floor( (M-1)! / T(n, S) )
 *
 * Where:
 *   n       = M - 1  (number of visible cards)
 *   T(n, S) = number of permutations of n elements with ≤ S inversions
 *
 * Uses BigInt throughout to handle large factorials without precision loss.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

function factorial(n) {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
}

/**
 * Counts permutations of `n` elements with exactly `j` inversions,
 * for all j from 0 to S, using the standard DP recurrence:
 *
 *   dp[i][j] = sum of dp[i-1][j-k]  for k in 0..min(j, i-1)
 *
 * Interpretation: inserting element i into a permutation of size i-1
 * at position k from the right adds k new inversions.
 */
function countInversionPerms(n, S) {
  const dp = Array.from({ length: n + 1 }, () => new Array(S + 1).fill(0n));
  dp[0][0] = 1n;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= S; j++) {
      for (let k = 0; k <= Math.min(j, i - 1); k++) {
        dp[i][j] += dp[i - 1][j - k];
      }
    }
  }

  // T(n, S) = cumulative sum over all j <= S
  let T = 0n;
  for (let j = 0; j <= S; j++) T += dp[n][j];

  return T;
}

/**
 * Main computation.
 * Returns { result, totalPerms, T, n } as BigInt values.
 */
function maxDeckSize(M, S) {
  const n = M - 1;
  const totalPerms = factorial(n);
  const T = countInversionPerms(n, S);
  const result = totalPerms / T;
  return { result, totalPerms, T, n };
}

// ── UI Logic ─────────────────────────────────────────────────────────────────

function compute() {
  const M = parseInt(document.getElementById('M').value);
  const S = parseInt(document.getElementById('S').value);
  const errorEl = document.getElementById('error');
  const resultEl = document.getElementById('result');

  errorEl.classList.remove('visible');
  resultEl.classList.remove('visible');

  if (isNaN(M) || M < 2) {
    errorEl.textContent = 'M must be an integer ≥ 2.';
    errorEl.classList.add('visible');
    return;
  }
  if (isNaN(S) || S < 0) {
    errorEl.textContent = 'S must be a non-negative integer.';
    errorEl.classList.add('visible');
    return;
  }

  const { result, totalPerms, T, n } = maxDeckSize(M, S);

  document.getElementById('result-n').textContent = result.toLocaleString();
  document.getElementById('result-meaning').innerHTML =
    `With <strong>M = ${M}</strong> cards selected and up to <strong>S = ${S}</strong> swaps, 
     a deck of up to <strong>N = ${result}</strong> distinct cards allows guaranteed identification.`;

  document.getElementById('trace-items').innerHTML = `
    <div class="trace-item"><span>n = M − 1 (visible cards)</span><span>${n}</span></div>
    <div class="trace-item"><span>(M−1)! total permutations</span><span>${totalPerms.toLocaleString()}</span></div>
    <div class="trace-item"><span>T(n, S) — perms with ≤ ${S} inversions</span><span>${T.toLocaleString()}</span></div>
    <div class="trace-item"><span>⌊(M−1)! / T(n,S)⌋</span><span>${result.toLocaleString()}</span></div>
  `;

  resultEl.classList.add('visible');

  // Reset trace collapse state on new compute
  const body = document.getElementById('trace-body');
  const arrow = document.getElementById('trace-arrow');
  body.classList.remove('open');
  arrow.classList.remove('open');
}

function toggleTrace() {
  const body = document.getElementById('trace-body');
  const arrow = document.getElementById('trace-arrow');
  body.classList.toggle('open');
  arrow.classList.toggle('open');
}

// Run on page load with default values
window.onload = compute;