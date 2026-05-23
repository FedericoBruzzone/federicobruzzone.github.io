# A Friendly Introduction to Substructural Type Systems, Capabilities, and Effects

*A guided tour from linear logic to Rust, Haskell, and beyond — with scientific references.*

---

## The problem: resources are not truths

Classical logic treats propositions as eternal truths. If you know that `A` is true, you can use that fact as many times as you like, pass it around freely, and ignore it if you don't need it. This works beautifully for mathematics.

But programs deal with *resources* — file handles, memory, locks, network connections — and resources do not behave like truths. A file handle used twice may corrupt state. A lock acquired but never released deadlocks. Memory freed and then read causes undefined behavior. The standard type systems inherited from simply-typed lambda calculus have no way to say "this value must be used exactly once" or "you cannot have two copies of this reference."

This is the motivating problem behind an entire family of type systems that place restrictions on how variables can be used. Their common ancestor is a branch of logic — **substructural logic** — and their descendants include Rust's ownership system, Haskell's linear types, Scala's capabilities, and the object-capability security model.

---

## 1. Structural rules: what we normally take for granted

In a standard sequent calculus, three *structural rules* govern how hypotheses in a typing context behave:

- **Exchange** (`Γ, A, B ⊢ C ⟹ Γ, B, A ⊢ C`): the order of hypotheses doesn't matter.
- **Weakening** (`Γ ⊢ C ⟹ Γ, A ⊢ C`): you can add unused hypotheses freely.
- **Contraction** (`Γ, A, A ⊢ C ⟹ Γ, A ⊢ C`): you can use the same hypothesis multiple times.

A **substructural type system** is one that restricts or eliminates one or more of these rules. Depending on which rules are removed, you get a different discipline for how variables can appear in programs.

| System       | Exchange | Weakening | Contraction | Variable use         |
|--------------|----------|-----------|-------------|----------------------|
| Ordered      | ✗        | ✗         | ✗           | Exactly once, in order |
| **Linear**   | ✓        | ✗         | ✗           | **Exactly once**     |
| **Affine**   | ✓        | ✓         | ✗           | **At most once**     |
| Relevant     | ✓        | ✗         | ✓           | At least once        |
| Normal       | ✓        | ✓         | ✓           | Arbitrarily          |

The canonical reference for this taxonomy is Walker (2005), Chapter 1 of *Advanced Topics in Types and Programming Languages* [1].

---

## 2. Linear type systems

### Logical foundations

Linear types are the computational incarnation of **linear logic**, introduced by Jean-Yves Girard in 1987 [2]. Girard's key insight was that classical logic's structural rules — weakening and contraction — are the formal source of a logic's "idealist" character: propositions can be freely duplicated and discarded. By removing these rules, he obtained a logic of *resources*, where every hypothesis must be used exactly once.

In linear logic, the familiar conjunction splits into two:
- **Multiplicative conjunction** `A ⊗ B` ("A and B, separately"): you need resources for both.
- **Additive conjunction** `A & B` ("A or B, your choice"): you share resources between the two.

Similarly, implication `A ⊸ B` ("linear implication" or "lollipop") says: given one copy of A, produce one copy of B — without duplicating A.

### From logic to programming languages

Philip Wadler's 1990 paper "Linear Types Can Change the World!" [3] showed how to translate linear logic into a type system for functional languages. The key application: linear types enable *safe in-place mutation*. If you have the only reference to an array (guaranteed by the type system), you can update it without violating referential transparency — no one else can observe the mutation.

Practically, the type system works like this. A function `f :: a ⊸ b` consumes its argument exactly once. If `(f u)` is consumed once, then `u` must have been consumed once inside `f`. This prevents:
- **Duplication** (contraction): `let arr2 = arr1` followed by modifying both.
- **Discarding** (weakening): allocating a file handle and never closing it.

Modern realizations include **Linear Haskell** (GHC 9.0+), formalized by Bernardy et al. [4], and **Idris 2** with its quantitative type theory.

### The key tension

Linear types come with bureaucracy. Because resources are consumed, they must be threaded explicitly through programs:

```haskell
-- The array must be passed back after each operation
read2 :: MArray a ⊸ (Ur a, Ur a)
read2 arr0 =
  let (arr1, x) = read arr0 0
      (arr2, y) = read arr1 1
      ()        = free arr2
  in (x, y)
```

Each `read` consumes the array and produces a fresh one. The programming experience is correct but verbose. Reducing this verbosity is one of the motivations for *linear constraints* (Section 6).

---

## 3. Affine type systems

**Affine types** relax linearity by allowing weakening but not contraction: a variable may be used *at most once*, but may also be discarded without using it. This corresponds to *affine logic*.

Rust's ownership system is the most prominent example of an affine type system in practice [5]. A value in Rust can be *moved* (consumed once) or *dropped* (discarded). What is prohibited is *duplicating* a value without explicit cloning. The `Copy` trait marks types that are allowed to be implicitly duplicated (i.e., they reintroduce contraction for specific types).

The distinction matters:
- **Linear**: you *must* use the resource. Useful for protocols that require explicit termination (e.g., must send a final message before closing a connection).
- **Affine**: you *may* discard the resource. Rust uses this because `drop` (the destructor) is called automatically — so the resource isn't truly "lost," it is cleaned up at scope exit.

Affine types enable Rust's signature safety guarantees: no use-after-free, no double-free, no data races — all checked at compile time with zero runtime overhead.

---

## 4. Region-based type systems

A closely related approach to managing memory without garbage collection is the use of *regions*. Introduced by Tofte and Talpin in 1994 [6], region-based type systems associate each value with a *region* — a named scope of memory. Values are allocated into regions and deallocated when their region goes out of scope.

The type system tracks, for each expression, which regions it reads from and writes to (as *effects*). This ensures no value outlives its region, preventing dangling pointer dereferences.

Regions are the intellectual ancestor of Rust's **lifetimes**: Rust's borrow checker enforces that references cannot outlive the region (scope) of the data they point to. The connection is explicit — Rust's design was informed by work on regions and on *alias types* [7].

---

## 5. Effect systems

An **effect system** extends the type judgment to include not just the *type* of a value, but a description of the *effects* — observable actions — that computing it may perform. The canonical form is:

```
Γ ⊢ e : τ ! ε
```

where `ε` is the effect annotation: reads, writes, I/O, exceptions, and so on.

Effect systems were introduced by Gifford and Lucassen (1986) [8], with polymorphic effects added by Lucassen and Gifford (1988) [9]. Effects compose bottom-up: the effect of a compound expression is the join (least upper bound) of the effects of its subexpressions.

Modern effect systems include:
- **Koka** (Leijen): row-polymorphic effects, where effects are extensible rows of labels.
- **Algebraic effects** (Plotkin & Pretnar; Bauer & Pretnar): effects as algebraic operations with handlers that give them semantics.
- **OCaml 5**: built-in algebraic effects.
- **Eff**: a research language dedicated to algebraic effects.

Effect systems are *bottom-up* analyzers: they inspect the internals of code to compute what it does. This is their strength — they are precise about use — and also their weakness: reasoning about global invariants and aliasing with effect systems requires complex naming machinery (see Gordon 2020 [10] for a detailed analysis of this trade-off).

---

## 6. Qualified type systems and type qualifiers

**Qualified type systems**, formalized by Mark Jones (1994) [11], extend types with *predicates* (qualifiers, constraints) that must be satisfied for a type to be used. The canonical example in Haskell is type class constraints: `Eq a ⇒ a → a → Bool` says "this function works for any type `a` that satisfies the `Eq` constraint."

**Type qualifiers**, introduced by Foster, Fähndrich, and Aiken (1999) [12], attach *qualifiers* to individual types: `const int`, `readonly Foo`, `writable Bar`. The type system propagates qualifiers according to subtyping rules and checks that operations are consistent with them. This is a lightweight form of subtyping that can express many useful properties without modifying the core type language.

Spiwack et al. (2022) [13] combine both ideas in **linear constraints**: constraints that carry a *multiplicity* annotation (linear or unrestricted). A linear constraint `Read n =◦ ...` must be consumed exactly once, like a linear function argument, but it is passed implicitly by the compiler rather than threaded explicitly through the code. This reduces the bureaucracy of linear types while preserving their safety guarantees — allowing Rust-style ownership to be encoded as a *library* in Haskell, rather than as a language feature.

---

## 7. Reference capability systems

**Reference capability systems** are a family of type systems that attach *capabilities* — qualifiers describing access permissions — to *references*, rather than to the objects they point to. Two different references to the same object can have different capabilities. This is in contrast to linear types, where the value itself is linear.

Common capability qualifiers (using the terminology from Gordon 2020 [10] and the Pony language):

| Qualifier     | Read | Write | Aliases may write |
|---------------|------|-------|-------------------|
| `readable`    | ✓    | ✗     | ✓ (assumed)       |
| `writable`    | ✓    | ✓     | ✓ (assumed)       |
| `immutable`   | ✓    | ✗     | ✗ (guaranteed)    |
| `isolated`    | ✓    | ✓     | ✗ (no aliases)    |

The type system ensures that operations performed through a reference are consistent with its capability. Reading a field through a `readable` reference produces a `readable` result, even if the field declaration says `writable` — the capability is *propagated transitively*.

Reference capabilities have been used for:
- **Safe parallelism**: if no thread holds a `writable` reference shared with another, data races are impossible (Gordon et al. 2012 [14]; Clebsch et al. 2015, Pony [15]).
- **Method purity inference**: a method that only receives `readable` inputs cannot cause heap mutations.
- **Object immutability**: an `immutable` reference guarantees that the entire reachable object graph is permanently frozen.

Systems in this family include the Gordon–Parkinson C# dialect, Pony, Encore, L42, and the reference immutability systems ReIm and Javari.

**Key design trade-off** (Gordon 2020 [10]): reference capabilities perform *top-down* analysis — they reason about what capabilities flow *into* code, without inspecting its internals. This is simpler and works even on precompiled libraries. But it introduces a *use-mention confusion*: possessing a capability means you *could* use it, not that you *do*. An effect system can distinguish between *mentioning* a writable reference (storing it, passing it along) and *using* it (actually writing). Weakening rules in the type system partially compensate for this imprecision.

---

## 8. Object capability systems (ocap)

**Object-capability systems** (ocap) are an architectural security model, not a type system in the narrow sense. The idea, rooted in operating systems work by Lampson (1971/1974) [16] and systematized by Levy (1984) [17], is:

> A *capability* is an unforgeable token that simultaneously *identifies* a resource and *authorizes* access to it.

In an *object-capability language*, object references *are* capabilities. If you cannot obtain a reference to an object, you cannot invoke its methods or observe its state. There is no ambient authority: no global mutable state, no `System.getenv`, no unrestricted reflection. Security is enforced by the *topology* of the object graph — what references exist and how they were obtained.

Mark Miller's PhD thesis (2006) [18] formalizes this model and introduces the **Principle of Least Authority (POLA)**: each component should hold only the capabilities strictly necessary for its task. This prevents the **confused deputy problem**: a trusted intermediary acting on behalf of a less-trusted caller cannot be tricked into exercising authority the caller should not have, because capabilities are passed explicitly, not ambient.

Languages and runtimes in this tradition include the E language, Joe-E, Caja, and **Deno** (the JavaScript/TypeScript runtime that requires explicit permission flags `--allow-net`, `--allow-read`, etc.).

The relationship to *reference capability systems* (Section 7): in ocap, all references are equal — there are no qualifiers distinguishing `readable` from `writable`. Restriction comes from exposing only objects with fewer operations (proxy objects, facade objects). Reference capability systems make this distinction at the type level, allowing two references to the same object to grant different access, which can be more fine-grained but requires a type checker rather than just a careful object graph.

---

## 9. Typestate

**Typestate** (Strom and Yemini, 1986 [19]) extends the type of a variable with information about its *state at a particular point in the program*. A `File` might have typestates `Closed`, `OpenForRead`, `OpenForWrite`. The type system tracks state transitions: `open :: File<Closed> → File<OpenForRead>`, `read :: File<OpenForRead> → (String, File<OpenForRead>)`, `close :: File<OpenForRead> → File<Closed>`.

Typestate is orthogonal to linearity but combines naturally with it: linear typestate ensures you cannot duplicate a file handle (avoiding double-close) and cannot discard it without closing (avoiding resource leaks). The Plaid language, and to a degree Rust's type system, embody this combination.

DeLine and Fähndrich's Vault (2001) and later Fähndrich's Fugue brought typestate to C-like languages. The key challenge is aliasing: if two references point to the same file, transitioning one invalidates the typestate assumption of the other. Linear or affine disciplines resolve this by forbidding such aliasing.

---

## 10. Reachability types

**Reachability types** are a recent proposal (Bao et al., OOPSLA 2021 [21]) that attacks a long-standing open problem: how to reason about *aliasing and separation* in higher-order functional languages, where closures can capture references and escape their defining scope — something that Rust's "shared XOR mutable" discipline cannot express without dynamic reference counting.

### The core idea: qualifiers as sets of reachable variables

In a standard type system, the type of `x` describes the *shape* of a value — `Int`, `List[String]`, and so on. In reachability types, every type also carries a **qualifier**: the set of program variables that are *transitively reachable* from the typed value. For example:

```scala
val x = new Ref(0)   // type: Ref[Int]{x}     — reachable only via x
val y = x            // type: Ref[Int]{x, y}   — reachable via x and y
```

The qualifier `{x}` on `x` says the only way to reach the reference is through `x`. When `y` is bound to `x`, the qualifier expands to `{x, y}`.

### Separation as disjointness of qualifiers

The key metatheoretical property is **preservation of separation**: if two expressions have *disjoint* qualifiers, the type system guarantees their object graphs are *disconnected at runtime*. Two values `a : T{Q₁}` and `b : S{Q₂}` with `Q₁ ∩ Q₂ = ∅` share no heap objects — which is exactly what is needed to safely transfer `b` to another thread without risk of data races.

This inverts the design philosophy of traditional ownership systems: rather than starting from a strict unique-access invariant and selectively relaxing it via borrowing, reachability types take *separation as a derived property* from qualifier disjointness, which scales more naturally to functional abstraction.

### The motivating case: shared closures

The canonical example — impossible in Rust without `Rc`/`Arc` — is:

```scala
def counter(n: Int) = {
  val c = new Ref(n)
  (() => c += 1, () => c -= 1)  // both closures capture c
}
val ctr = counter(0)
// ctr : Pair[(()=>Unit){ctr}, (()=>Unit){ctr}]{ctr}
```

Two closures capture the same mutable reference `c`. Reachability types express this using a **self-reference** `ctr` that abstracts over `c` once it has escaped its defining scope: the result type says that both closures reach the same things, whatever those are, tracked by the outer name `ctr`.

### λ* and its limitations: the polymorphism problem

The original system **λ\*** (Bao et al. 2021) is monomorphic. A naïve extension to type polymorphism turns out to be unsound: reachability qualifiers track transitive closures of reachable variables, and this information does not compose correctly across type abstraction boundaries.

### λ◆: polymorphic reachability types (Wei et al., POPL 2024)

Wei et al. [24] propose **λ◆** (lambda-diamond) as a solution. Instead of always tracking the full transitive closure, the system tracks variables reachable in *a single step* and computes transitive closures only on demand. This preserves reachability chains over known variables that can be refined by substitution. The system introduces a **freshness qualifier** `◆` for variables whose reachability sets may grow during evaluation (i.e., fresh allocations not yet aliased by any known variable). λ◆ is polymorphic over both types and qualifiers, and type soundness together with preservation of separation are proved in Coq.

The `◆` symbol deliberately echoes the `cap` capability of Scala Capture Types: when appearing in a qualifier, `◆` denotes an arbitrary set of reachable variables separated from the current context, much as `cap` represents an arbitrary set of captured capabilities.

### Scala Capture Types (CC<:□)

In parallel, the Odersky group at EPFL has developed **Capture Types** for Scala 3, formalized as the calculus **CC<:□** (Boruch-Gruszecki, Odersky et al., TOPLAS 2023 [23]). The earlier preprint (Boruch-Gruszecki et al. 2021 [22]) introduced the basic idea of tracking *captured variables* — not transitive reachability, but the *direct* free variables of a value — in types. Every type carries a *capture set* `{x, y, ...}` representing which capabilities the value has access to.

The primary application is safe scoped effects via capabilities: an algebraic effect handler can ensure that the effect capability it introduces does not escape the handler's scope, because the type system tracks whether the capability appears in any return type. This is the foundation of Scala 3's experimental `CanThrow` and `boundary`/`break` effect handling.

The key difference from reachability types: CC<:□ uses *boxing* (`□`) to cross generic type boundaries soundly, at the cost of some annotation overhead. λ◆ avoids boxing by tracking single-step reachability instead of full capture sets.

### Milano et al.: flexible types for fearless concurrency (PLDI 2022)

Milano, Turcotti, and Myers [25] propose a type system for concurrent programs that allows threads to exchange complex, arbitrarily connected object graphs without data races. The system tracks a **heap domination invariant**: an `iso` (*isolated*) field contains a reference that *dominates* its entire reachable subgraph — it is the only entry point. Sending an `iso` reference to another thread transfers ownership of the whole dominated subgraph atomically.

The novelty over prior work (LaCasa, Pony) is flexibility: the domination invariant is maintained as strongly as in predecessors, but *temporary violations* are allowed to arise and persist across the program until a transfer (send/receive) makes recovery necessary. This dramatically reduces the annotation burden for common data structure manipulations that previous systems could not express without unnatural rewrites.

### Comparison of the recent reachability-based systems

| System | Tracks | Polymorphism | Separation guarantee | Concurrency |
|--------|--------|-------------|---------------------|-------------|
| λ\* (Bao et al. 2021) | Transitive reachability | ✗ | Disjoint qualifiers | Indirect |
| λ◆ (Wei et al. 2024) | Single-step reachability + freshness | ✓ types and qualifiers | Disjoint qualifiers | Indirect |
| CC<:□ (Boruch-Gruszecki et al. 2023) | Captured variables (direct) | ✓ with boxing | Capture set | Via scoped capabilities |
| Milano et al. 2022 | Heap domination (iso fields) | Limited | Dominator subgraph | ✓ (primary focus) |

---

## 11. Degrees of Separation: the Capture Separation Calculus (CSC)

The systems seen so far tend to share a common philosophy: enforce a strict anti-aliasing invariant globally — unique ownership, disjoint reachability sets, dominated subgraphs — and selectively relax it via borrowing or focus mechanisms. **CSC** (*Capture Separation Calculus*), proposed by Xu, Boruch-Gruszecki, and Odersky (OOPSLA 2024 [26]), takes a different stance: aliases to mutable state are *permitted by default and tracked*, and separation is only enforced where data races are actually possible. The authors call this the **control-as-you-need paradigm**.

### Background: the strict alias-prevention tradition

The dominant prior approach to safe concurrency is to enforce a global *anti-aliasing invariant*. Linear types [3] and uniqueness types [29] guarantee that a value has at most one live reference at any time — useful for protocol checking (open a file exactly once, close it exactly once) but too strict for many real-world patterns. Rust mandates that a thread takes ownership of whatever it captures, effectively precluding aliases to shared data [5]. Ownership types [30] prevent aliases from crossing object boundaries. Reference capability systems [14, 20] tag references with modes that restrict aliasing. Fractional permissions [31] allow temporary immutable sharing by splitting a full write permission into multiple read permissions that must be recombined before the next write.

All of these systems work by enforcing a strong invariant globally and relaxing it locally. The result is that adopting any of them into an existing codebase typically requires non-trivial code refactoring. CSC proposes the opposite: *track aliases freely, regulate them only at the point of parallelism*.

### Intellectual lineage: syntactic control of interference

CSC's control-as-you-need principle has a deep ancestor in John Reynolds's seminal 1978 paper **"Syntactic Control of Interference"** (SCI) [27]. Reynolds observed that in Algol-like languages with both assignment and procedures, *interference* — aliasing and side effects between distinct identifiers — is the source of both programming errors and obstacles to parallelism. His proposal: rather than forbidding interference outright, make it *syntactically detectable*. The basic idea is to prohibit interference between distinct identifiers while permitting interference among components of the same identifier. O'Hearn, Power, Takeyama, and Tennent (1999) [28] revisited and extended this system; Reddy and Reynolds (POPL 2012) later connected it to Concurrent Separation Logic.

### Building on Capture Types

CSC is built directly on top of CC<:□ (Boruch-Gruszecki et al. 2023 [23]), inheriting its lightweight alias tracking via capture sets. The key addition is the notion of **separation degree**: a type-level annotation on function parameters specifying *how much* of the current context a given argument must be separated from.

When no separation annotation is given, aliases are freely permitted — the system is compatible with existing code patterns. Separation annotations are added only where parallelism makes data races possible. Importantly, separation degree inference is supported: in practice, users rarely need to write these annotations explicitly, as the compiler infers them from usage and freezes them once a function is typed.

### The parallel let binding

The main concurrency construct is a **parallel let binding**:

```scala
val (x, y) = par(e1, e2)
```

The type checker verifies that the captured variables of `e1` and `e2` are sufficiently separated — according to the separation degrees declared on their respective types — to guarantee that no mutable state is concurrently accessed from both sides. The check is *local and modular*: separation degrees are inferred once at function definition time, not re-checked globally at every call site. Type safety is proved via standard progress and preservation theorems; data race freedom is proved by establishing confluence of reductions.

### Comparison with related systems

**vs. SCI (Reynolds 1978 [27]; O'Hearn et al. 1999 [28])**: The passive expressions of SCI are similar to an expression in CSC whose captured variables are upper-bounded by `rdr` (the read-only capability). However, alias tracking in SCI is not as expressive: in SCI, *distinct variables are always non-interfering* — equivalent to assigning the *maximum* separation degree to every variable in CSC. CSC allows graduated degrees of separation rather than a binary interfering/non-interfering distinction.

**vs. reachability types (λ\* [21]; λ◆ [24])**: Both approaches track aliasing as type qualifiers. Reachability types use sets of *transitively reachable* variables; CSC uses *directly captured* variables (from CC<:□). Reachability types enforce the separation between arguments and function bodies by default and permit aliases with explicit annotations — requiring considerable annotation when introduced into existing languages. Additionally, since data races are not a central concern of reachability types, immutable sharing of mutable state is not modelled by those systems.

**vs. Milano et al. (PLDI 2022 [25])**: Milano's key concept is **tempered domination**: the proposed `iso` reference by default dominates its reachable object graph, meaning it is the unique reference to that graph. This uniqueness requirement can be relaxed by the **focus mechanism**, which allows objects reachable from an `iso` reference to be aliased as long as the aliasing is tracked in the type system — naturally expressing interlinked data structures like doubly-linked lists. However, the domination property of `iso` references still imposes restrictions on heap structures by default, requiring code refactoring when adopted. Furthermore, Milano's system models *message-passing* concurrency (reachable object graphs between threads are always disjoint), while CSC models *shared-memory* concurrency (mutable state can be immutably shared across threads). Finally, Milano's system studies an imperative language, whereas CSC originates from System F<: and is thus closer to a functional language.

**vs. Capture Types (CC<:□ [23])**: CSC *extends* CC<:□ with mutable variables, parallel let bindings, and separation degrees. CC<:□ alone does not guarantee data race freedom; CSC adds the concurrency-specific machinery on top.

**vs. fractional permissions [31]**: In CSC, a reader capability can be viewed as a fraction of the full capability. However, a reader capability can co-exist with a full capability and be used together *sequentially*. Only the *parallel* usage of reader capabilities and the full capability of a variable is prohibited — a more permissive policy than traditional fractional permission systems.

---

## 12. The landscape, summarized

These systems are not competing alternatives — they are complementary tools for different problems:

| System                    | Primary guarantee                              | Canonical reference |
|---------------------------|------------------------------------------------|---------------------|
| Linear types              | Exact resource use (no dup, no drop)           | Girard 1987 [2]; Wadler 1990 [3] |
| Affine types              | No duplication (safe drop allowed)             | Walker 2005 [1]     |
| Region types              | No dangling pointers, stack discipline         | Tofte & Talpin 1994 [6] |
| Effect systems            | Precise bottom-up effect tracking              | Gifford & Lucassen 1986 [8]; Lucassen & Gifford 1988 [9] |
| Qualified types           | Lightweight subtyping via predicates           | Jones 1994 [11]     |
| Type qualifiers           | Flow-sensitive property propagation            | Foster et al. 1999 [12] |
| Reference capabilities    | Permission per reference, global invariants    | Haller & Odersky 2010 [20]; Gordon 2020 [10] |
| Object capabilities (ocap)| Security via reference topology + POLA         | Lampson 1974 [16]; Miller 2006 [18] |
| Linear constraints        | Implicit linear args (caps as constraints)     | Spiwack et al. 2022 [13] |
| Typestate                 | Protocol compliance, state transitions         | Strom & Yemini 1986 [19] |
| Reachability types (λ\*)  | Aliasing + separation via reachable-var sets   | Bao et al. 2021 [21] |
| Polymorphic reach. (λ◆)   | Same + type/qualifier polymorphism             | Wei et al. 2024 [24] |
| Capture types (CC<:□)     | Captured-variable tracking, scoped effects     | Boruch-Gruszecki et al. 2023 [23] |
| Flexible concurrency (iso)| Heap domination, flexible iso invariant        | Milano et al. 2022 [25] |
| CSC (Degrees of Sep.)     | Alias tracking + separation degrees, control-as-you-need | Xu et al. 2024 [26] |

The deeper pattern across all of these: they are all trying to make the *flow* of authority, access, or resources explicit and checkable at compile time. They differ in *where* the information lives (on the value, the reference, the type context, the effect annotation, or the reachability qualifier), *what* structural rules are restricted, and *how* the analysis proceeds — bottom-up from expressions, or top-down from contexts, or via the shape of the heap graph itself.

---

## References

[1] Walker, D. (2005). Substructural type systems. In B. C. Pierce (Ed.), *Advanced Topics in Types and Programming Languages* (Chapter 1, pp. 3–43). MIT Press.

[2] Girard, J.-Y. (1987). Linear logic. *Theoretical Computer Science*, 50(1), 1–102. https://doi.org/10.1016/0304-3975(87)90045-4

[3] Wadler, P. (1990). Linear types can change the world! In M. Broy & C. Jones (Eds.), *Programming Concepts and Methods* (pp. 347–359). IFIP TC 2 Working Conference, North Holland.

[4] Bernardy, J.-P., Boespflug, M., Newton, R. R., Peyton Jones, S., & Spiwack, A. (2018). Linear Haskell: Practical linearity in a higher-order polymorphic language. *Proceedings of the ACM on Programming Languages*, 2(POPL), Article 5. https://doi.org/10.1145/3158093

[5] Matsakis, N. D., & Klock, F. S. (2014). The Rust language. *Ada Letters*, 34(3), 103–104. https://doi.org/10.1145/2692956.2663188

[6] Tofte, M., & Talpin, J.-P. (1994). Implementing the typed call-by-value λ-calculus using a stack of regions. In *Proceedings of the 21st ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL)* (pp. 188–201). https://doi.org/10.1145/174675.177855

[7] Smith, F., Walker, D., & Morrisett, J. G. (2000). Alias types. In *Proceedings of the 9th European Symposium on Programming (ESOP)*, LNCS 1782 (pp. 366–381). Springer.

[8] Gifford, D. K., & Lucassen, J. M. (1986). Integrating functional and imperative programming. In *Proceedings of the 1986 ACM Conference on LISP and Functional Programming (LFP)* (pp. 28–38). ACM. https://doi.org/10.1145/319838.319848

[9] Lucassen, J. M., & Gifford, D. K. (1988). Polymorphic effect systems. In *Proceedings of the 15th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL)* (pp. 47–57). ACM. https://doi.org/10.1145/73560.73564

[10] Gordon, C. S. (2020). Designing with static capabilities and effects: Use, mention, and invariants. In *Proceedings of the 34th European Conference on Object-Oriented Programming (ECOOP 2020)*. LIPIcs, vol. 166. arXiv:2005.11444

[11] Jones, M. P. (1994). A theory of qualified types. *Science of Computer Programming*, 22(3), 231–256. https://doi.org/10.1016/0167-6423(94)00005-0

[12] Foster, J. S., Fähndrich, M., & Aiken, A. (1999). A theory of type qualifiers. In *Proceedings of the ACM SIGPLAN 1999 Conference on Programming Language Design and Implementation (PLDI)* (pp. 192–203). ACM. https://doi.org/10.1145/301618.301665

[13] Spiwack, A., Kiss, C., Bernardy, J.-P., Wu, N., & Eisenberg, R. A. (2022). Linearly qualified types: Generic inference for capabilities and uniqueness. *Proceedings of the ACM on Programming Languages*, 6(ICFP), Article 95. https://doi.org/10.1145/3547626

[14] Gordon, C. S., Parkinson, M. J., Parsons, J., Bromfield, A., & Duffy, J. (2012). Uniqueness and reference immutability for safe parallelism. In *Proceedings of the ACM International Conference on Object Oriented Programming Systems Languages and Applications (OOPSLA 2012)* (pp. 129–145). https://doi.org/10.1145/2384616.2384619

[15] Clebsch, S., Drossopoulou, S., Blessing, S., & McNeil, A. (2015). Deny capabilities for safe, fast actors. In *Proceedings of the 5th International Workshop on Programming Based on Actors, Agents, and Decentralized Control (AGERE!)* (pp. 1–12). ACM.

[16] Lampson, B. W. (1974). Protection. *ACM SIGOPS Operating Systems Review*, 8(1), 18–24. (Originally presented at the 5th Annual Princeton Conference on Information Sciences and Systems, 1971.)

[17] Levy, H. M. (1984). *Capability-Based Computer Systems*. Digital Press. https://homes.cs.washington.edu/~levy/capabook/

[18] Miller, M. S. (2006). *Robust composition: Towards a unified approach to access control and concurrency control* [PhD thesis]. Johns Hopkins University.

[19] Strom, R. E., & Yemini, S. (1986). Typestate: A programming language concept for enhancing software reliability. *IEEE Transactions on Software Engineering*, 12(1), 157–171. https://doi.org/10.1109/TSE.1986.6312929

[20] Haller, P., & Odersky, M. (2010). Capabilities for uniqueness and borrowing. In *Proceedings of the 24th European Conference on Object-Oriented Programming (ECOOP 2010)*, LNCS 6183 (pp. 354–378). Springer. https://doi.org/10.1007/978-3-642-14107-2_17

[21] Bao, Y., Wei, G., Bračevac, O., Jiang, Y., He, Q., & Rompf, T. (2021). Reachability types: Tracking aliasing and separation in higher-order functional programs. *Proceedings of the ACM on Programming Languages*, 5(OOPSLA), Article 135. https://doi.org/10.1145/3485516

[22] Boruch-Gruszecki, A., Brachthäuser, J. I., Lee, E., Lhoták, O., & Odersky, M. (2021). Tracking captured variables in types. arXiv:2105.11896.

[23] Boruch-Gruszecki, A., Odersky, M., Lee, E., Lhoták, O., & Brachthäuser, J. I. (2023). Capturing types. *ACM Transactions on Programming Languages and Systems*, 45(4). https://doi.org/10.1145/3618003

[24] Wei, G., Bračevac, O., Jia, S., Bao, Y., & Rompf, T. (2024). Polymorphic reachability types: Tracking freshness, aliasing, and separation in higher-order generic programs. *Proceedings of the ACM on Programming Languages*, 8(POPL), 393–424. https://doi.org/10.1145/3632856

[25] Milano, M., Turcotti, J., & Myers, A. C. (2022). A flexible type system for fearless concurrency. In *Proceedings of the 43rd ACM SIGPLAN International Conference on Programming Language Design and Implementation (PLDI 2022)* (pp. 458–473). https://doi.org/10.1145/3519939.3523443

[26] Xu, Y., Boruch-Gruszecki, A., & Odersky, M. (2024). Degrees of separation: A flexible type system for safe concurrency. *Proceedings of the ACM on Programming Languages*, 8(OOPSLA). https://doi.org/10.1145/3649853

[27] Reynolds, J. C. (1978). Syntactic control of interference. In *Conference Record of the 5th Annual ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL)* (pp. 39–46). https://doi.org/10.1145/512760.512766

[28] O'Hearn, P. W., Power, J., Takeyama, M., & Tennent, R. D. (1999). Syntactic control of interference revisited. In *Mathematical Foundations of Programming Semantics (MFPS XV)*. Electronic Notes in Theoretical Computer Science, 20. https://doi.org/10.1016/S1571-0661(04)80026-9

[29] Barendsen, E., & Smetsers, S. (1996). Uniqueness typing for functional languages with graph rewriting semantics. *Mathematical Structures in Computer Science*, 6(6), 579–612. https://doi.org/10.1017/S0960129500001037

[30] Clarke, D. G., Potter, J., & Noble, J. (1998). Ownership types for flexible alias protection. In *Proceedings of the 13th ACM SIGPLAN Conference on Object-Oriented Programming Systems Languages and Applications (OOPSLA)* (pp. 48–64). https://doi.org/10.1145/286936.286947

[31] Boyland, J. T. (2010). Semantics of fractional permissions with nesting. *ACM Transactions on Programming Languages and Systems*, 32(6), Article 22. https://doi.org/10.1145/1749268.1749272