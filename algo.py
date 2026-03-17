# Problem 104: It's All Magic

# Computes maximum deck size N using:
# N = floor((M-1)! / T(n, S))

def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def count_inversion_perms(n, S):
    """
    Returns T(n, S):
    Number of permutations of n elements with ≤ S inversions
    """
    # dp[i][j] = number of permutations of i elements with j inversions
    dp = [[0] * (S + 1) for _ in range(n + 1)]
    dp[0][0] = 1

    for i in range(1, n + 1):
        for j in range(S + 1):
            for k in range(min(j, i - 1) + 1):
                dp[i][j] += dp[i - 1][j - k]

    # Sum all permutations with ≤ S inversions
    T = sum(dp[n][j] for j in range(S + 1))
    return T


def max_deck_size(M, S):
    n = M - 1

    total_perms = factorial(n)        # (M-1)!
    T = count_inversion_perms(n, S)   # permutations within S swaps

    N = total_perms // T              # floor division
    return N


# Example usage
if __name__ == "__main__":
    M = int(input("Enter M: "))
    S = int(input("Enter S: "))

    result = max_deck_size(M, S)
    print("Maximum deck size N =", result)