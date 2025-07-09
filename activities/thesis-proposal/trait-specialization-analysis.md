<!-- pandoc trait-specialization.md -o trait-specialization.pdf -->

---
output: pdf_document
toc: false
colorlinks: true

linkcolor: blue
urlcolor: blue
citecolor: blue
toccolor: red
---

# Trait Specialization Analysis

**Authors**:

- [Walter Cazzola](mailto:cazzola@di.unimi.it)

- [Federico Bruzzone](mailto:federico.bruzzone@unimi.it)

## Introduction

Rust is a systems programming language that focuses on safety, speed, and concurrency. It is designed to be memory-safe without using garbage collection.
This implies that pure Rust programs are free of null pointer dereferences, double frees as well as data races.
Rust boasts a powerful type system inspired by the ML family of languages and the Haskell programming language.
The type system is designed to be expressive and to catch programming errors at compile time.
Unlike Java the generic types in Rust are monomorphized, meaning that the compiler generates a new version of the code for each type that the generic type is instantiated with.
If you are familiar with C++ templates, this approach is similar to the template instantiation mechanism in C++. The foundamental difference between the SFINAE (Substitution Failure Is Not An Error) mechanism in C++ and Rust is that the former substitutes the generic item with the type and checks the validity of the substitution after the substitution itself, while the latter checks the validity of the substitution before the substitution itself.
In other words, C++ compilers if a substitution fails, it is not an error, and the compiler will try to substitute the generic item with another type. Rust, instead, the compiler forces the programmer to proof that the generic item is valid for all possible types that it can be instantiated with.
For example, the following code will not compile:
```rust
enum E<T> { A(T), B(T) }
fn foo1<T>(_: E<T>) {}
fn foo2<A, B>(_: E<(A, B)>) {}
fn bar<T>(e: E<T>) {
    match e {
        E::A(_) => foo1(x),
        _ => foo2(x) // Error: expected `E<(_, _)>`, found `E<T>`
    }
}
```
In C++, a similar code will compile, for example:
```cpp
template <typename T>
struct E { T a, b; };

template <typename T>
void foo1(E<T> e) {}

template <typename A, typename B>
void foo2(E<std::pair<A, B>> e) {}

template <typename T>
void bar(E<T> e) {
    if (e.a == e.b) {
        foo1(e);
    } else {
        foo2(e);
    }
}

int main() {
    E<std::pair<int, int>> e = {
        std::make_pair(1, 2),
        std::make_pair(3, 4)
    };
    bar(e);

    return 0;
}
```
The C++ compiler will reject this code only if `bar` is called with a type that is not a pair.
For example:
```cpp
int main() {
    E<int> e = { 1, 2 };
    bar(e); // Error: no matching function
            //        for call to `foo2(E<int>&)'
    return 0;
}
```
Anyway, although Rust does not support object-oriented programming in the traditional sense, it provides a powerful trait system as a mechanism to define shared behavior between types.
A trait is a collection of methods that can be implemented by any type.
The trait system allows for generic programming. However, it is not possible to specialize a trait implementation for a specific type.
This means that it is not possible to define different implementations of a trait based on the type of the generic parameter.

# Motivation

In 2015 was proposed the specialization feature in this [RFC](https://rust-lang.github.io/rfcs/1210-impl-specialization.html). A related [tracking issue](https://github.com/rust-lang/rust/issues/31844) was opened to track the progress of the implementation. The feature was abandoned for several reasons, including the complexity of the implementation and because of the unsoundness hole in the type system that it would introduce.
C++ has a similar feature called [partial template specialization](https://en.cppreference.com/w/cpp/language/partial_specialization) that allows to specialize a template for a specific type. This feature is very powerful and allows to define different implementations of a template based on the type of the template parameter.
However, Rust already support the `Autoref-based specialization` that allows to specialize a trait implementation based on the number of references to the type (read [here](http://lukaskalbertodt.github.io/2019/12/05/generalized-autoref-based-specialization.html) for more information). Although this feature is useful, it is very limited and does not allow for more complex specialization.
For example:
```rust
struct Wrap<T>(T);

trait ViaString  { fn foo(&self); }
trait ViaDisplay { fn foo(&self); }
trait ViaDebug   { fn foo(&self); }

impl ViaString for &&Wrap<String> {
    fn foo(&self) { println!("String: {}", self.0);  }
}

impl<T: std::fmt::Display> ViaDisplay for &Wrap<T> {
    fn foo(&self) { println!("Display: {}", self.0); }
}

impl<T: std::fmt::Debug> ViaDebug for Wrap<T> {
    fn foo(&self) { println!("Debug: {:?}", self.0); }
}

fn main() {
    (&&&Wrap(String::from("hi"))).foo();
    (&&&Wrap(3)).foo();
    (&&&Wrap(['a', 'b'])).foo();
}
```
generates the following output:
```shell
String: hi
Display: 3
Debug: ['a', 'b']
```

As previously introduced, the interaction between specialization and lifetimes is pretty problematic, as tracked in this [github issue](https://github.com/rust-lang/rust/issues/40582) and better discussed in this [in depth article](https://aturon.github.io/blog/2017/07/08/lifetime-dispatch/).
More specifically, during code generation (the phase where MIR is lowered to LLVM IR and then to machine code) the compiler doesn't know about lifetimes (since it has already erased all lifetime information) and so it can't use them to choose which implementation should apply.
In constrast to the soundness issue, the "always applicable rule" is proposed by Niko Matsakis by using "Maximally minimal specialization" (defined in [this](https://smallcultfollowing.com/babysteps/blog/2018/02/09/maximally-minimal-specialization-always-applicable-impls/) blog post).

## Proposal

Rust's trait system is one of its most powerful language features, enabling a form of ad-hoc polymorphism that is both type-safe and composable. However, a natural and desirable extension — **trait specialization** — remains unstable and limited to nightly Rust via  the `#[feature(specialization)]` feature attribute. Specialization allows a more specific trait implementation to override a general one, offering opportunities for performance optimization, code reuse, and API ergonomics.

In practice, developers often write code that mimics specialization. A common idiom is:

```rust
impl<T> MyTrait<T> for MyStruct { ... }     // generic case
impl MyTrait<u32> for MyStruct { ... }      // specific case
```

While this is permitted under Rust's [coherence rules](https://rust-lang.github.io/chalk/book/clauses/coherence.html) as long as types do not overlap, the compiler has no semantics to treat the second impl as a refinement of the first. Moreover, future changes to trait bounds or type aliases could silently introduce overlaps or conflicts, breaking the code.

Understanding where such cases occur in real codebases could help evaluate the practical need for specialization, guide safe designs, and contribute insights to compiler diagnostics or language evolution.


### Research Questions

1. Under what formal conditions does a trait implementation `impl Foo<T>` overlap with or generalize another `impl Foo<U>`?
2. How can type unification be used to determine the specificity relationship between trait implementations?
3. How common are these situations in existing Rust projects?
4. Can the analysis identify problematic or ambiguous overlap patterns?

## Methodology

1. **Type and Trait Extraction**  
   Instrument the Rust compiler (via `rustc_driver`) to extract (from the AST or HIR/THIR):
   - All trait implementations per crate
   - Type information for each `impl`
   - Trait bounds, where-clauses, and associated types

2. **Unification-Based Analysis**  
   Define a [type unification algorithm](https://rust-lang.github.io/chalk/book/clauses/type_equality.html) to detect when one type can be substituted to match another:
   - `T = u32` unifies: `impl<T> Foo<T>` matches `impl Foo<u32>`
   - Structural matching (tuples, references, generics)

3. **Overlap and Specificity Detection**  
   Given two impls `A` and `B` for the same trait and type:
   - If their types unify and `B` is more specific (less general), mark it as a specialization candidate.
   - Ensure overlap does not violate current Rust rules.

4. **Crate-Level Evaluation**  
   Apply the analysis on a range of open-source crates:
   - `serde`, `regex`, `itertools`, etc.
   - Record how many traits are implemented multiple times per type
   - Classify the patterns (simple types, tuples, references, generic bounds)

5. **Discussion and Applications**  
   - Where could specialization be safely used?
   - Where would it be unsound or ambiguous?
   - Could such a tool help Rustc give better diagnostics?
   - Could this guide future versions of specialization ([min_specialization](https://doc.rust-lang.org/beta/unstable-book/language-features/min-specialization.html))?

