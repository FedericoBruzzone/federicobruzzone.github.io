# Incrementalization of Multiple Recursion


## What Should We Investigate?

- Is it possible to automatically transform multiple recursive functions into iterative functions?
    For example, the Fibonacci function `fib(n)` is defined as:
    ```c
    int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }
    ```
    It can be transformed into an iterative function using memoization or dynamic programming techniques. However, the challenge lies in automating this transformation for arbitrary multiple recursive functions.

- The `max_element` function is a divide-and-conquer algorithm that finds the maximum element in an array. It can be defined recursively as follows:
    ```c
    int max_element(int arr[], int left, int right) {
        if (left == right) return arr[left];
        int mid = (left + right) / 2;
        int max_left = max_element(arr, left, mid);
        int max_right = max_element(arr, mid + 1, right);
        return (max_left > max_right) ? max_left : max_right;
    }
    ```
    An iterative version of this function can be implemented traditionally using a loop. The tail-recursive version can be achieved by using an accumulator to keep track of the maximum value found so far. However, transforming this function into a tail-recursive form automatically is non-trivial and requires careful handling of the recursive calls.

- Is the same procedure applicable to both `fib` and `max_element`, or do we need different techniques for different types of multiple recursion?
    The techniques used to transform `fib` and `max_element` into iterative or tail-recursive forms may differ due to the nature of their recursion. `fib` has overlapping subproblems, making memoization effective, while `max_element` follows a divide-and-conquer approach, which may require a different strategy.

- Could it be useful calculate the **recurrence relations** of multiple recursive functions? (See Bachmann et al. below) Should we take into account only linear recurrences, or also non-linear ones?
    The recurrence relations is solely based on how the function is defined, and does not depend on the input values. For example, the recurrence relation of `fib` is the same regardless of the input value `n`. Note that, in this case, we are not interested in the **image** of the function, but it may be bring some benefits.
    LLVM has no analysis pass that calculates recurrence relations of multiple recursive functions. However, it has a pass called `scalar evolution` (see below) to analyze and categorize scalar expressions in loops by using the same idea of recurrence relations.

## Observations

- The image of a total function on an infinitely countable domain (such as Fibonacci) is infinite. This means that it is not trivial to verify whether the images of two functions coincide. Would it be enough to know if one is a subset of the other? Actually, we would like to know more! We would like the relation that connects the input to the output for all values of the intersection of the two images for both functions. It is not so trivial, but perhaps we could settle for analyzing the recurrences.



## Related Works

**References to Y. Annie Liu's work on incrementalization:**

1. PEPM, Liu, 2024, [Incremental Computation: What Is the Essence?](https://doi.org/10.1145/3635800.3637447).
1. -, Liu et al., 2013, [Incrementalization: From Clarity to Efficiency](https://www3.cs.stonybrook.edu/~liu/papers/IncDesign-TR13.pdf). The `longest common subsequence` problem is used as an example in this paper.
1. HOSC, Liu and Stoller, 2003, [Dynamic Programming via Static Incrementalization](https://doi.org/10.1023/A:1023068020483). The `longest common subsequence` problem is used as an example in this paper.

    _This paper presents a powerful method that statically analyzes and transforms straightforward recursive programs to eﬃciently cache and use the results of needed subproblems at appropriate program points in appropriate data structures. The method has three steps: (1) extend the original program to cache all possibly computed values, (2) incrementalize the extended program, with respect to an input increment, to use and maintain all cached results, (3) prune out cached results that are not used in the incremental computation, and use the resulting incremental program to form an optimized program. The method overcomes both drawbacks of tabulation. First, it consists of static program analyses and transformations that are general and systematic. Second, it stores only values that are necessary for the optimization; it also shows exactly when and where subproblems not in the original computation have to be included._

1. HOSC, Liu, 2000, [Efficiency by Incrementalization: An Introduction](https://doi.org/10.1023/A:1026547031739). `fib` is used as an example in this paper.
1. SIGPLAN Notices, Liu and Stoller, 1999, [From recursion to iteration: what are the optimizations?](https://dl.acm.org/doi/10.1145/328691.328700).
1. TOPLAS, Liu and Stoller, 1998, [Static caching for incremental computation](https://dl.acm.org/doi/10.1145/291889.291895).
1. KBSEC, Liu, 1995, [CACHET: an interactive, incremental-attribution-based program transformation system for deriving incremental programs](https://doi.org/10.1109/KBSE.1995.490115). This paper seems to use *user-knowledge* to guide the incrementalization process.
1. Computer Programming, Liu and Teitelbaum, 1995, [Systematic derivation of incremental programs](https://doi.org/10.1016/0167-6423(94)00031-9). This paper seems to use *theorem-proving* to guide the incrementalization process. `fib` is used as an example in this paper.
1. PEPM, Liu and Teitelbaum, 1995, [Caching Intermediate Results for Program Improvement](https://dl.acm.org/doi/10.1145/215465.215590). `fib` is used as an example in this paper.

**Other references**

- JACM, Burstall and Darlington, 1977, [A Transformation System for Developing Recursive Programs](https://dl.acm.org/doi/10.1145/321992.321996).

- Supercomputing, Pugh, 1991, [The Omega test: a fast and practical integer programming algorithm for dependence analysis](https://dl.acm.org/doi/10.1145/125826.125848). 
    The Omega test determines whether there is an integer solution to an arbitrary set of linear equalities and ineqnalities, referred to as a problem. 

- ISSAC, Bachmann et al., 1994, [Chains of Recurrences - a method to expedite the evaluation of closed-form functions]. LLVM has an analysis step of 14k LoC called `scalar evolution` (see below). Among other things, it uses the methodology of this paper to trace recurrence chains.

- SIGPLAN Notices, Yi et al., 2000, [Transforming Loops to Recursion for Multi-Level Memory Hierarchies](https://doi.org/10.1145/358438.349323).

- POPL, Ramalingam and Reps, 1993, [A Categorized Bibliography on Incremental Computation](https://doi.org/10.1145/158511.158710).

**Lesser importance**

- PLDI, Solar-Lezama, 2007, [Sketching Stencils](https://dl.acm.org/doi/pdf/10.1145/1250734.1250754).

## Examples with links to Compiler Explorer

- **Fibonacci in C and its LLVM IR**: [Compiler Explorer Link](https://godbolt.org/z/5Msv4oTxv).
- **Max Element (Divide and Conquer) in C and its LLVM IR**: [Compiler Exporer Link](https://godbolt.org/z/a81d79sx3).
- **Ackermann Function in C and its LLVM IR**: [Compiler Exporer Link](https://godbolt.org/z/7G63Grsqa).
- **Merge Sort in C and its LLVM IR**: [Compiler Exporer Link](https://godbolt.org/z/sx3n6zfxj). We would need to perform interprocedural analysis and transformation to optimize the `mergeSort` function.

## Foundational Concepts

Leaving aside for a moment [Rice's theorem](https://en.wikipedia.org/wiki/Rice%27s_theorem) (which generalized the [halting problem](https://en.wikipedia.org/wiki/Halting_problem)).

In symbolic computation, also called [Computer algebra](https://en.wikipedia.org/wiki/Computer_algebra) (see also [Modern Computer Algebra](http://lib.ysu.am/disciplines_bk/8daf5ccde25503ca099cd564bc4018f2.pdf), Gathen and Gerhard, 2003), there are two notions of [equality](https://en.wikipedia.org/wiki/Computer_algebra#Equality) for mathematical expressions. _Syntactic_ equality is the equality of their representation in a computer. This is easy to test in a program. _Semantic_ equality is when two expressions represent the same mathematical object
According to the [Richardson's theorem](https://en.wikipedia.org/wiki/Richardson%27s_theorem),  the equality of real numbers defined by expressions involving integers, Pi, ln 2, and exponential and sine functions is **undecidable**. That is, there may not exist an algorithm that decides whether two expressions representing numbers are semantically equal if exponentials and logarithms are allowed in the expressions.

On the other hand, it **could be useful** to know that, in mathematics, a [Diophantine equation](https://en.wikipedia.org/wiki/Diophantine_equation) is a [polynomial equation](https://en.wikipedia.org/wiki/Algebraic_equation) with integer coefficients, for which only integer solutions are of interest. A linear Diophantine equation equates the sum of two or more unknowns, with coefficients, to a constant. An exponential Diophantine equation is one in which unknowns can appear in exponents.
In 1900, Hilbert proposed the solvability of all Diophantine equations as the [tenth](https://en.wikipedia.org/wiki/Hilbert%27s_tenth_problem) of his [fundamental problems](https://en.wikipedia.org/wiki/Hilbert%27s_problems). In 1970, the [theorem of Matiyasevich](https://en.wikipedia.org/wiki/Yuri_Matiyasevich) solved it negatively by proving that no such general algorithm exists. 
Wolfram MathWorld has a good summary of [Diophantine Equations](https://mathworld.wolfram.com/DiophantineEquation.html), which cites also the Fibonacci function.
The problem becomes decidable if we restrict the equations to certain forms, such as *linear* Diophantine equations. 



The [constant problem](https://en.wikipedia.org/wiki/Constant_problem) is the problem of deciding whether a given expression is equal to zero. This problem is known to be undecidable in general, as a consequence of Richardson's theorem. However, for certain restricted classes of expressions, the constant problem can be decidable. 

It's also good to know that the [Tarski's high school algebra problem](https://en.wikipedia.org/wiki/Tarski%27s_high_school_algebra_problem) is a problem in mathematical logic and algebra that asks whether the axioms taught in high school algebra are sufficient to prove all true statements about the real numbers involving addition, multiplication, and exponentiation. In 1980, A. Wilkie showed that the answer is negative by constructing a counterexample.


**Common notions**

- If you are wondering if all recursive functions can be transformed into iterative functions, here are some useful references (It is rather clear due to the [Church–Turing thesis](https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis)):
    - [In functional languages, how is the compiler able to translate non-tail recursion into loops to avoid stack overflows (if at all)?](https://stackoverflow.com/questions/43784575/in-functional-languages-how-is-the-compiler-able-to-translate-non-tail-recursio)
    - [Can all iterative algorithms be expressed recursively?](https://stackoverflow.com/questions/2093618/can-all-iterative-algorithms-be-expressed-recursively)
    
- The [binary decision diagram (BDD)](https://en.wikipedia.org/wiki/Binary_decision_diagram) or branching program is a data structure that is used to represent a Boolean function. On a more abstract level, BDDs can be considered as a compressed representation of sets or relations. Unlike other compressed representations, operations are performed directly on the compressed representation, i.e. without decompression.

- The [Ackermann function](https://en.wikipedia.org/wiki/Ackermann_function) is the earliest-discovered examples of a [total](https://en.wikipedia.org/wiki/Partial_function) [computable function](https://en.wikipedia.org/wiki/Computable_function) that is not [primitive recursive](https://en.wikipedia.org/wiki/Primitive_recursive_function). That is, it is a function that can be computed by an algorithm for all inputs, but cannot be defined using only **bounded** looping constructs (like `for` loops).

- The [overlapping subproblems](https://en.wikipedia.org/wiki/Overlapping_subproblems) property is a key characteristic of problems that can be solved efficiently using [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming). A problem exhibits overlapping subproblems if it can be broken down into smaller subproblems that are reused multiple times in the process of solving the larger problem.

## Useful LLVM passes

All [LLVM passes](https://llvm.org/docs/Passes.html) mentioned below can be enabled via `opt` tool.

- [argpromotion](https://llvm.org/docs/Passes.html#argpromotion-promote-by-reference-arguments-to-scalars): This pass promotes "by reference" arguments to be "by value" arguments. File: `lib/Transforms/IPO/ArgumentPromotion.cpp`.
- [function-attrs](https://llvm.org/docs/Passes.html#function-attrs-deduce-function-attributes): A simple interprocedural pass which walks the call-graph, looking for functions which do not access or only read non-local memory, and marking them readnone/readonly. That is, it detects pure functions. File: `lib/Transforms/IPO/FunctionAttrs.cpp`.
- [tailcallelim](https://llvm.org/docs/Passes.html#tailcallelim-tail-call-elimination): This file transforms calls of the current function (self recursion) followed by a return instruction with a branch to the entry of the function, creating a loop. File: `lib/Transforms/Scalars/TailRecursionElimination.cpp`.
- [scalar-evolution](https://llvm.org/docs/Passes.html#scalar-evolution-scalar-evolution-analysis): The ScalarEvolution analysis can be used to analyze and categorize scalar expressions in loops. Two presentations are provided to better understand this analysis: [1](https://llvm.org/devmtg/2007-10/Slides/Absar-ScalarEvolution.pdf) and [2](https://llvm.org/devmtg/2012-10/Slides/Absar-ScalarEvolution.pdf). File: `lib/Analysis/ScalarEvolution.cpp`.

## Additional References

- [Y. Annie Liu's homepage](https://www3.cs.stonybrook.edu/~liu/)
- [Cachet website](https://www3.cs.stonybrook.edu/~liu/projects/cachet.html)
- A PhD course with the goal of transform a subset of recursive programs into their iterative counterparts: [The CS 6120 Course Blog](https://www.cs.cornell.edu/courses/cs6120/2019fa/blog/internal-function-memoization/). [The code examples are implemented in LLVM 9](https://github.com/liuhenry4428/llvm-pass-skeleton/tree/noauto).
- Quora post: [How does Haskell avoid stack overflow when non tail recursion is required](https://www.quora.com/How-does-Haskell-avoid-stack-overflow-when-non-tail-recursion-is-required).
- $O(2^n)$ `fib` implemented in [Haskell](https://play.haskell.org/saved/HeN1wEai): it goes into stack overflow when called with 100.
- [Implement support for become and explicit tail call codegen for the LLVM backend](https://github.com/rust-lang/rust/pull/144232): a Rust support for explicit tail call optimization using LLVM.



