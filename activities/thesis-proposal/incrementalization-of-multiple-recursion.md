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

    _This method is systematic and parameterized by modules for equality reasoning, time analysis, and strategies used in introducing incremental functions. It can be made automatic or semiautomatic depending on the power one expects from each module. For example, equality reasoning can exploit algebraic properties of only constructors or exploit arithmetic properties as well; time analysis can conservatively compare times of primitives or handle all recursive functions; and strategies for introducing incremental functions can allow one argument for a cached result and one incremental version for each given function or allow multiple arguments for cached results and multiple incremental versions. If the conservative option is chosen for each module, then the overall derivation is fully automatic and always terminates; alternatively, if the more ambitious option is chose, the derivation is semiautomatic. The method in Liu and Teitelbaum [1995] limits each incremental function to use one argument for a cached result, but it leaves other choices as parameters of the method.
Even though this method uses transformations like unfoldings and simplifications, it is tailored to achieve the special goal of using a previously computed result. It uses a specific sequence of special transformations and is therefore systematic. In particular, it introduces incremental functions that correspond to nonincremen-tal functions and uses cached results as extra arguments, and it performs unfold-ings, simplifications, and replacements using cached results. The effect cannot be achieved by general optimization strategies, such as the general fold/unfold transformation strategies Burstall and Darlington 1977], in such an automatable way.
In particular, the method does not introduce eureka definitions, which can be new functions with arbitrary arguments, nor does it perform arbitrary folding, which may cause a resulting program not to terminate even when the original program terminates._
3. KBSEC, Liu, 1995, [CACHET: an interactive, incremental-attribution-based program transformation system for deriving incremental programs](https://doi.org/10.1109/KBSE.1995.490115). This paper seems to use *user-knowledge* to guide the incrementalization process.
4. Computer Programming, Liu and Teitelbaum, 1995, [Systematic derivation of incremental programs](https://doi.org/10.1016/0167-6423(94)00031-9). This paper seems to use *theorem-proving* to guide the incrementalization process. `fib` is used as an example in this paper.
5. PEPM, Liu and Teitelbaum, 1995, [Caching Intermediate Results for Program Improvement](https://dl.acm.org/doi/10.1145/215465.215590). `fib` is used as an example in this paper.

**Other references**

- JACM, Burstall and Darlington, 1977, [A Transformation System for Developing Recursive Programs](https://dl.acm.org/doi/10.1145/321992.321996).

- Supercomputing, Pugh, 1991, [The Omega test: a fast and practical integer programming algorithm for dependence analysis](https://dl.acm.org/doi/10.1145/125826.125848). 
    The Omega test determines whether there is an integer solution to an arbitrary set of linear equalities and ineqnalities, referred to as a problem. 

- ISSAC, Bachmann et al., 1994, [Chains of Recurrences - a method to expedite the evaluation of closed-form functions]. LLVM has an analysis step of 14k LoC called `scalar evolution` (see below). Among other things, it uses the methodology of this paper to trace recurrence chains.

- SIGPLAN Notices, Yi et al., 2000, [Transforming Loops to Recursion for Multi-Level Memory Hierarchies](https://doi.org/10.1145/358438.349323).

- POPL, Ramalingam and Reps, 1993, [A Categorized Bibliography on Incremental Computation](https://doi.org/10.1145/158511.158710).

- CGO, Ginsbach and O'Boyle, 2017, [Discovery and Exploitation of General Reductions: A Constraint Based Approach](https://ieeexplore.ieee.org/document/7863746)

- ASPLOS, Sundararajah et al, 2017, [Locality Transformations for Nested Recursive Iteration Spaces](https://dl.acm.org/doi/pdf/10.1145/3093336.3037720): This paper develops the first set of scheduling trans- formations for nested recursions: recursive methods that call other recursive methods. These are the recursive analog to nested loops. We present a transformation called recursion twisting that automatically improves locality at all levels of the memory hierarchy, and show that this transformation can yield substantial performance improvements across several benchmarks that exhibit nested recursion.

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

## Email exchanges with Annie Liu

<details>
<summary>Bruzzone to Liu (Nov 24, 2025)</summary>
    Dear Professor Liu,

Please accept my apologies for taking up your valuable time. I am writing to you because I need to clarify some aspects of your seminal research on "Incrementalization".

I am Federico Bruzzone, a PhD candidate in Computer Science at the University of Milan, supervised by Prof. W. Cazzola, and my research focuses on compiler optimizations.

I recently read your papers on Incrementalization, specifically in the order of [1], [2], [3], and [4], and also reviewed the CACHET web page [5]. I became interested in your work after observing that some of the techniques you propose are not commonly integrated into optimizing compilers.

As an example, when applied to functions with multiple recursive calls (like the classic Fibonacci function), these techniques do not seem to fully transition from recursion to pure iteration. While I acknowledge this is a non-trivial transformation, they appear to treat an expression like `fib(n) = fib(n-1) + fib(n-2)` as a form of tail recursion where only one of the recursive calls can be tail-call optimized into an iterative loop, leaving the other call still recursive (a possibility you've mentioned in [1]).

To better understand [1], I delved into [2], [3], and [4]. I was particularly intrigued by the introduction of [2] where you describe Step II. Although Step II builds upon the principles of [3] and [4]---which, as I understand it, typically rely on user-provided knowledge or a theorem prover to derive the incremental program---I inferred that [2] systematically automates this process using only static analysis and semantic-preserving transformations.

My first question is: Is this understanding correct? Or am I fundamentally missing a key component?

Based on your answer, I have a few follow-up questions:

If my understanding is incorrect:
    - To achieve the results described in [2], is the reliance on user-knowledge or a theorem prover still necessary? Or are both required?
    - My impression is that by requiring only a theorem prover, the process could be entirely automated. Given the current state of technology, do you believe modern optimizing compilers could either (1) readily integrate fast theorem provers (like Z3) into their pipelines or (2) rely on their existing, sophisticated analysis passes to prove the necessary properties?
If my understanding is correct:
    - How exactly did you manage to fully automate the process in [2]? Did you employ specific static analysis techniques to infer the required properties? Were there certain semantic-preserving transformations used that were not detailed in the paper's overview?

A General Question on Adoption

Finally, regardless of the automation method, do you see a path for these Incrementalization techniques to be integrated into modern optimizing compilers for recursive functions? Are there fundamental limitations---such as significant performance overhead, excessive implementation complexity, or applicability only to specific use cases---that currently prevent their widespread adoption in real-world compilers?

We would be genuinely honored if you could take the time to address these points. We are also completely available for a video call if you feel that would be a more efficient way to discuss these matters. We are also open to collaborations if you find our research interests align.

Thank you very much for your time and consideration. I eagerly await your kind reply.

Best regards,
Federico Bruzzone

[1] 1999, From recursion to iteration: what are the optimizations?
[2] 1998, Static Caching for Incremental Compilation
[3] 1995, Systematic derivation of incremental programs
[4] 1995, CACHET: An interactive, incremental-attribution-based program transformation system for deriving incremental programs
[5] https://www3.cs.stonybrook.edu/~liu/projects/cachet.html
</details>

<details>
    <summary>Liu to Bruzzone (Dec 2, 2025)</summary>
    Hello,
Thanks for your interest.

I'm not sure what techniques you are referring to when you say
they "do not seem to fully transition from recursion to pure
iteration".  [1] does transform fib from recursion to iteration.
BTW, the fib function has no tail recursion at all, if you follow
the definition of tail recursion.

Deriving incremental recursive functions in [3][4] can use any
degree of user-interaction or theorem-proving for equality
reasoning.  So it can use only the simplest rules described in
those papers (e.g., car(cons(x,y)) = x) and be fully automatic,
and still be effective for all those well-written recursive
functions.  That's all we did.

BTW, in general, for arbitrary not well-written recursive
functions, even powerful theorem provers may not be effective for
automation.

Overall, recursive functions are often too low-level, which makes
incrementalization unnecessarily hard.  Higher-level language
features (set expressions and logic rules) are much easier to
program with and to automatically incrementalize.  There were
already optimizing compilers, since the 70s, that incrementalize
set expressions (e.g., APTS for SETL, a predecessor of Python).
My group has had various implementations too.  I definitely see
these as totally feasible as well as essential for raising the
level of abstraction for programming.

You might want to see an overview paper that covers [2],[3],[4]
and more, with discussions that can help answer your questions:
https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww3.cs.stonybrook.edu%2F~liu%2Fpapers%2FIncEff-HOSC00.pdf&data=05%7C02%7Cfederico.bruzzone%40unimi.it%7Cda2a9a7e7af74e2b864d08de31731838%7C13b55eef70184674a3d7cc0db06d545c%7C0%7C0%7C639002567701390398%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=5pl%2Bs60EMHimcAHwpteFvZ0BogxMSk%2BsUvhC%2FFOm6l8%3D&reserved=0

And a most recent one that covers even more:
https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Farxiv.org%2Fabs%2F2312.07946&data=05%7C02%7Cfederico.bruzzone%40unimi.it%7Cda2a9a7e7af74e2b864d08de31731838%7C13b55eef70184674a3d7cc0db06d545c%7C0%7C0%7C639002567701412806%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=T4KeobN8gMF5QbUuWv0d2O8pDqrGAvuVJI%2FXafkxS%2Bk%3D&reserved=0

Hope these will help. Best, Annie
</details>


<details>
<summary>Bruzzone to Liu (Dec 2, 2025)</summary>
Dear Prof. Liu,

Thank you for sending me those additional papers, which are new to me.
I apologize for my poor choice of words in my initial email.
I fully agree with you that the Fibonacci function is not tail-recursive if
we consider the classical definition, and that incrementalization is generally
easier to achieve in higher-order languages.
However, what I meant to convey is that current optimizing compilers (e.g., LLVM)
typically fail to fully optimize recursive functions in the presence of *multiple*
recursive calls, not that your method in [1] doesn't succeed.

In the case of single tail recursion, optimizing compilers are quite able at transforming
the recursive call into a simple iterative loop, it's a pattern they easily recognize.
In the case of multiple (even mutually exclusive) recursions, they often merely treat them
as specific cases of tail recursion (when they can). For instance, in the classic
`fib(n)=fib(n−1)+fib(n−2)`, only `fib(n−2)` is optimized as a tail recursive function due
to the commutativity and associativity of addition, leaving `fib(n−1)` unoptimized.
This, of course, only holds if the function is well-formed.
The LLVM-IR output for the classic Fibonacci function in SSA form with all
optimizations enabled (-O3) is as follows:
    
----------
```llvm
define i32 @fib(i32 %n) {
entry:
 %cmp6 = icmp slt i32 %n, 2
 br i1 %cmp6, label %return, label %if.end
if.end:
 %n.tr8 = phi i32 [ %sub1, %if.end ], [ %n, %entry ]
 %accumulator.tr7 = phi i32 [ %add, %if.end ], [ 0, %entry ]
 %sub = add nsw i32 %n.tr8, -1
 %call = tail call i32 @fib(i32 %sub) 
 %sub1 = add nsw i32 %n.tr8, -2
 %add = add nsw i32 %call, %accumulator.tr7
 %cmp = icmp samesign ult i32 %n.tr8, 4
 br i1 %cmp, label %return, label %if.end
return:
 %accumulator.tr.lcssa = phi i32 [ 0, %entry ], [ %add, %if.end ]
 %n.tr.lcssa = phi i32 [ %n, %entry ], [ %sub1, %if.end ]
 %accumulator.ret.tr = add nsw i32 %n.tr.lcssa, %accumulator.tr.lcssa
 ret i32 %accumulator.ret.tr
}                                       
```
----------
As you can see, at line 9, the `fib(n-1)` call remains recursive.

**Static Compiler Automation and Equality Reasoning**

Focusing on functions with multiple recursions, my core question is: since optimizing
compilers can handle single tail recursion without user-interaction or general theorem
provers, could we, today, fully automate the incrementalization of functions with
multiple recursions without resorting to the more complex techniques you mentioned?

You stated that user-interaction or theorem provers were used only for equality reasoning
between expressions. I wonder if it is possible to achieve the necessary equality proofs
using only the static analysis passes that modern compilers already perform.

I certainly do not expect current compilers to prove the equality of arbitrary expressions,
but perhaps they could handle a determinable subset (e.g., those involving basic arithmetic
operations, all determinable at compile-time).
   - Have you ever explored this specific direction (automating equality reasoning for
     Incrementalization using only existing compiler static analysis)?
   - Are there any known, fundamental limitations that currently prevent this approach?

I have only been exploring this for a few weeks, so I do not have a strong position, and I
would be greatly interested in your professional opinion on the feasibility of this
compiler-only automation.

Finally, would we be able to find a generic procedure (for a certain set of functions)
such that we can incrementalize it without the aid of external tools?

**The Recursive Maximum Element Function**

The following function, which should be incrementalizable using your method, for finding the
maximum element in a list recursively (a divide-and-conquer approach) is also making us think
quite a lot due to its totally disjoint recursive calls (each recursive call works on a separate
half of the list), i.e., memorization techniques would not bring any benefits in terms of
asymptotic spatial complexity.

It is written in C because we can easily see the LLVM output:
----------
```c
int max_element(int *arr, int start, int end) {
   if (start == end) {
       return arr[start];
   }

   int mid = (start + end) / 2;
   int left_max = max_element(arr, start, mid);
   int right_max = max_element(arr, mid + 1, end);

   return (left_max > right_max) ? left_max : right_max;
}
```
----------

We know this function can be trivially written iteratively (or in a tail-recursive manner by comparing
the head of the list with the maximum of the rest). However, we wonder: Is the same "generic procedure"
used for Fibonacci (if it exists) is applicable to this function as well?
(For simplicity, I'm currently excluding non-primitive recursive total computable functions like Ackermann
from my reasoning, but perhaps a future generalization would be possible or potentially already included).

Thank you once again for your time and willingness to engage with my questions.

Best, Fede
</details>

<details>
<summary>Liu to Bruzzone (Dec 10, 2025)</summary>
Hi,
Fib has no tail call at all by definition, not sure what you mean
by "classical" or otherwise.

Incrementalization is easier for higher-level languages,
independent of higher-order that you wrote.

Tail call optimization is straightforward, but it does not
improve time complexity in any case, unlike incrementalization.
It could only improve space complexity, if there is only one
recursive call.

fib(n-2) is not a tail recursive call, even though the llvm code
writes "tail call".  I find the llvm code too level to be clear,
but I think they just use a loop to do fib on n-2, n-4, etc (or
perhaps on n-1, n-3, etc but you can check carefully yourself).
Whatever they call it, the time complexity is still exponential,
and the space complexity is still linear, as I see, but you can
check for yourself.

Optimization by incrementalization makes fib linear time and
constant space.

Without our analysis (we had to invent better and new static
analyses), you cannot do incrementalization of recursive
functions in general.  For well-written recursive functions and
all dynamic programming problems, these analyses are easy to
implement, and we did implement them back then.

You can certainly have all kinds of special classes/patterns that
you can incrementalize/optimize straightforwardly.  For example,
there are many kinds of patterns people use for various dynamic
programming problems.

For your max function, you didn't say what your goal is.  If you
just want to compute max, your binary recursion is not good to
start with, more complicated and wasteful than a straightforward
iteration or tail recursion.  If you want to incrementalize max
under some changes, you need to say what the changes are.

In any case, there is never a need in the real-world to write max
as you did and then turn it into iteration.  The only reason one
might write like that is for parallel computing, but then one
shouldn't want to turn it into iteration.  In all cases, one
should use high-level languages and simply write max(list),  and
different needs are supported easily by compilers. If you have
any other goal, you didn't justify, or even say:) Annie
</details>

<details>
<summary>Bruzzone to Liu (Dec 10, 2025)</summary>
Dear Prof. Liu,

Thank you again for your swift and detailed response. I apologize if my previous email was unclear, and I appreciate you taking the time to engage with my specific technical points.

I agree with you completely on the following fundamental principles:
- The classical Fib function is not tail-recursive by definition, and the term "tail-call" in the LLVM-IR output for one of the calls is indeed misleading. We are "generalizing" the term here to refer to any function that a compiler can see as tail-call optimizable, even if the function itself is not strictly tail-recursive.
- Incrementalization provides superior complexity improvements (e.g., O(2^n)->O(n) time and O(n)->O(1) space for Fib) compared to simple tail-call optimization.
- Incrementalization is generally easier to achieve in higher-level languages.

First, when trying to create an iterative version of a function without bringing any benefit in terms of asymptotic temporal complexity or spatial complexity (or one of them), is this considered "incrementalization" according to your definition?
I ask because creating the iterative version of the `max_element` function in divide-and-conquer (from the last email) may or may not coincide with incrementation (I'll come back to this later in the email).
I'll use "incrementalization" in the rest of the email for both cases, but please correct me if I'm wrong.

The LLVM-IR snippet was intended to show a compiler's attempt at optimization (often via a TailRecursionElimination or similar pass) which, despite identifying a single call for potential tail-call elimination, still leaves the overall structure as exponential (recursively calling `fib(n-1)` within the loop you mentioned).
This illustrates a gap that is precisely what a powerful technique like incrementalization would solve, leading me to my core question about its automation and implementation.


**Static Compiler Automation and Equality Reasoning**

I understand that your method for incrementalization required new and better static analyses.
I would be greatly interested to know if there are any published papers or prior work that detail these specific analyses.
I would expect a generic procedure/algorithm that works within the confines of the functions and performs the necessary analyses and transformations; so far, I have found [1] that seems relevant.

BTW, at this point, I'm a little bit confused...

Although, I perfectly understand that the formalization you provided is sound and necessary for the correctness of the incrementalization process, I am trying to grasp the practical aspects of the implementation.
You stated that user-interaction or theorem provers were used "only" for equality reasoning between expressions. I am still unclear whether your group was ultimately able to completely automate via static analyses the incrementalization process (and thus bypass the need for external provers/user interaction for all necessary equality proofs) for a practical subset of recursive functions.

My questions are:
   1.  Have you or your colleagues ever explicitly explored the limits of automating this crucial equality reasoning step by leveraging only the static analysis passes already standard within a modern optimizing compiler infrastructure? While I am aware that general expression equality is undecidable (per Rice's Theorem and the complexity demonstrated by Richardson's Theorem for expressions involving functions like the exponential), I wonder if the subset of equality proofs required for common incrementalization patterns might be sufficiently narrow and deterministic for existing compiler technology.
   2. Are there known, fundamental limitations in static analysis (beyond the obvious undecidability of general equality) that would inherently prevent the full automation of this particular step for functions like Fibonacci? For instance, the search for the inverse function, and so forth.

My hypothesis is that for a significant, practical class of functions that are prime candidates for incrementalization, the required equality proofs involve simple arithmetic and structural properties that a sufficiently advanced compiler could verify without external provers.


**The Recursive Maximum Element Function**

My interest in the `max_element` function is purely theoretical: to understand the generality of the incrementalization process.

The goal is to see if the same generic procedure used for Fibonacci---which is based on overlapping subproblems---is robust enough to handle the disjoint subproblems of this divide-and-conquer function. Does a "generic procedure for a certain set of functions" exist, and does it encompass both the Fibonacci and `max_element` cases?

Note that, by incrementalizing even the mutually exclusive subproblems of `max_element`, optimizing compilers would gain a broader ability to apply existing loop optimizations (e.g., vectorization, unrolling, etc.) to a wider range of functions, as well as reducing to constant space complexity.

Thank you once again for your generous sharing of knowledge.

Best, Fede


[1] https://link.springer.com/article/10.1023/A:1023068020483
</details>

<details>
<summary>Liu to Bruzzone (Dec 15, 2025)</summary>
Hi,
on my homepage (https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.cs.stonybrook.edu%2F~liu&data=05%7C02%7Cfederico.bruzzone%40unimi.it%7C07ab5266a579479d29b708de3bf7bc57%7C13b55eef70184674a3d7cc0db06d545c%7C0%7C0%7C639014132518124051%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=adU9AL821Sf2rtksE6DWuLYHUPIPYSC62Sq0w%2Behi7o%3D&reserved=0), see under
research overview, pointers to questions/papers you asked about
including the following on recursive functions:

Incrementalization: deriving incremental programs, with respect to
input change operations, that use
. the return values (SCP 95),
. the intermediate results (PEPM 95 / TOPLAS 98),
. and auxiliary information (POPL 96 / SCP 01),
. with an overview of all three (HOSC 00).

Optimization: generating efficient implementations by incrementalizing
expensive computations for
. recursive functions (ESOP 99 / HOSC 03, PEPM 00, PEPM 02a, PEPM 03),

Program dependence analysis: dead-code analysis, a.k.a. slicing, on
recursive data using
. abstract interpretation on fixed domains (see PEPM 95 / TOPLAS 98),
. abstract interpretation on regular tree grammar domains (ICCL 98b),
. or regular tree grammar based constraints (SAS 99 / SCP 03),
. with efficient algorithms for solving the grammar-based constraints (SAS 01).

Implementations of program transformations and analyses, besides
described in papers above:
. a system for deriving incremental programs (KBSE 95, ICFP 98 poster)

I don't know what you mean by "a practical subset of recursive functions".
In any case, I don't see anything practical in your recursive max. In
practice, it should simply be max(list), on which all needed
optimizations can be done straightforwardly. Best, Annie
</details>

<details>
<summary>Bruzzone to Liu (Dec 17, 2025)</summary>
Dear Prof. Liu,

I would like to sincerely thank you for the time and patience you have dedicated to answering my many emails. 


Best,
Fede
</details>

<details>
<summary>Liu to Bruzzone (Dec 18, 2025)</summary>
Sure. The HOSC 00 overview should be the fastest to get a good idea.
Best, Annie
</details>

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

