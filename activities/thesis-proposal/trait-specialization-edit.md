---
output: pdf_document
toc: false
colorlinks: true

linkcolor: blue
urlcolor: blue
citecolor: blue
toccolor: red
---

# Impl Specialization

**Authors**:

- [Cazzola Walter](mailto:cazzola@di.unimi.it)
- [Bruzzone Federico](mailto:federico.bruzzone@unimi.it)

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

## Motivation

In 2015 was proposed the specialization feature in this [RFC](https://rust-lang.github.io/rfcs/1210-impl-specialization.html). A related [tracking issue](https://github.com/rust-lang/rust/issues/31844) was opened to track the progress of the implementation. The feature was abandoned for several reasons, including the complexity of the implementation and because of the unsoundness hole in the type system that it would introduce.
C++ has a similar feature called [partial template specialization](https://en.cppreference.com/w/cpp/language/partial_specialization) that allows to specialize a template for a specific type. This feature is very powerful and allows to define different implementations of a template based on the type of the template parameter.
However, Rust already support the `Autoref-based specialization` that allows to specialize a trait implementation based on the number of references to the type (read [here](http://lukaskalbertodt.github.io/2019/12/05/generalized-autoref-based-specialization.html) or [here](https://github.com/dtolnay/case-studies/blob/master/autoref-specialization/README.md) for more information). Although this feature is useful, it is very limited and does not allow for more complex specialization.
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

## Proposal

This proposal aims to introduce a novel way to specialize trait implementations in Rust. The idea is to leverage the Rust _macro_ system to provide a way to define specialized implementations for a trait based on the type of the generic parameter. 

We first need to mark every trait whose implementations we want to be able to specialize with the following _derive_ macro:
- `#[specializable]` to make its definition available at compile time and hence be able to create the specialized alternatives, as we'll see later.

The proposed syntax for the main _derive_ macro is the following:
- `#[spec_default]` to define the default implementation for a trait.
- `#[when(predicate)]` to define a specialized implementation for a trait when predicate is respected.

The `predicate` of the _proc_ macro `when` is a boolean expression that can contain a combination of the following operators:
- `any(predicate_1, preticate_2, ...)` to check if at least one predicate is respected.
- `all(predicate_1, predicate_2, ...)` to check if all of the predicates are respected.
- `not(predicate)` to check if the predicate is not respected.
- `T = U` to check if the type of the generic paramter `T` is of type `U`.
- `T: U` to check if the generic parameter `T` implements the trait `U`.

The _funcion-like_ macro `spec!` is used to call the specialized implementation of a trait. The macro `spec!` is used to call the specialized implementation of a trait. The syntax is the following:

- `spec! { expr }` to call the specialized implementation of a trait, where `expr` is the expression that calls the trait method.

For example:
```rust
struct ZST; // Zero Sized Type

#[specializable]
trait Foo<T> { fn foo(&self, x: T); }

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T = String)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is String");
    }
}

#[when(T = &[_])]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is &[_]");
    }
}

#[when(not(T = Vec<_>))]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is not Vec<_>");
    }
}

#[when(any(T = i8, T = &u8))]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is i8 or &u8");
    }
}

fn main() {
    let zst = ZST;
    spec! { zst.foo("hello".to_string()) };
    spec! { zst.foo(&[1, 2, 3]) };
    spec! { zst.foo("hello") };
    spec! { zst.foo(Vec::<()>::new()) };
    spec! { zst.foo(&1u8) };
}
```
generates the following output:
```shell
Foo impl ZST where T is String
Foo impl ZST where T is &[A]
Foo impl ZST where T is not Vec<_>
Default Foo for ZST
Foo impl ZST where T is i8 or &u8
```

The idea is to generate different implementations of the trait `Foo` based on the type of the generic parameter `T`. This process will be done at compile time, and we will call it _monomorphic specialization_. The _monomorphic specialization_, keeping the same meaning of the [_monomorphization_](https://en.wikipedia.org/wiki/Monomorphization) used by the Rust compiler, ensures that the trait implementation is monomorphic, and the compiler can optimize the code better. Doing so, the soundness of the type system is preserved since the compiler can check the type of the generic parameter at compile time.
The `spec!` macro will be expanded according to the type of the expression passed as an argument. It will leverange the type aliasing to call the specialized implementation of the trait.

For example, the previous code will be expanded to:
```rust
struct ZST; // Zero Sized Type

// Default trait
trait Foo<T> { fn foo(&self, x: T); }

// Specialized trait for String
trait FooString { fn foo(&self, x: String); }

// Specialized trait for &[_]
trait FooSlice<T> { fn foo(&self, x: &[T]); }

// Specialized trait for not Vec<_>
trait FooNotVec<T> { fn foo(&self, x: T); }

// Specialized trait for i8 or &u8
trait FooI8OrRefU8<T> { fn foo(&self, x: T); }

impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

impl FooString for ZST {
    fn foo(&self, x: String) {
        println!("Foo impl ZST where T is String");
    }
}

impl<A> FooSlice<T> for ZST {
    fn foo(&self, x: &[T]) {
        println!("Foo impl ZST where T is &[_]");
    }
}

impl<T> FooNotVec<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is not Vec<_>");
    }
}

impl<T> FooI8OrRefU8<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is i8 or &u8");
    }
}

fn main() {
    let zst = ZST;
    <ZST as FooString>::foo(&zst, "hello".to_string());
    <ZST as FooSlice<i32>>::foo(&zst, &[1, 2, 3]);
    <ZST as FooNotVec<&str>>::foo(&zst, "hello");
    <ZST as Foo<Vec<()>>>::foo(&zst, vec![]);
    <ZST as FooI8OrRefU8<&u8>>::foo(&zst, &1u8);
}
```

## Annotations
In stable rust, unfortunately, there's no way to know if a value we have in our hands implements a trait or not (this isn't possible neither at run-time nor at compile-time).
Furthermore, if we are using type aliases, when using `std::any::type_name_of_val` rust has already lowered them to their interned version, and hence we have no way to understand the alias anymore.
For these reasons, if we are relying on traits or type aliases for specialization, we need to give the `spec!` macro some additional info, which we are calling _annotations_. Other than the default case described above, we are introducting the following syntax:
- `spec! { expr; annotations }`

The `annotations` are a semicolon-separated series where each annotation can be:
- `T: U` to specify that the concrete type `T` implements trait `U`.
- `T = U` to specify that the concrete type `T` can also be aliased as `U`.

For example:
```rust
struct ZST;

#[specializable]
trait Foo<T> { fn foo(&self, x: T); }

type MyType = u8;

trait Bar {}
trait FooBar {}

impl Bar for i32 {}
impl Bar for i64 {}
impl FooBar for i64 {}

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T = MyType)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is MyType");
    }
}

#[when(T: Bar)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T implements Bar");
    }
}

#[when(T: Bar + FooBar)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T implements Bar and FooBar");
    }
}

fn main() {
    let zst = ZST;
    spec! { zst.foo(1u8); u8 = MyType; i32: Bar; i64: Bar + FooBar };
    spec! { zst.foo(1i32); u8 = MyType; i32: Bar; i64: Bar + FooBar };
    spec! { zst.foo(1i64); u8 = MyType; i32: Bar; i64: Bar + FooBar };
    spec! { zst.foo(1i8); u8 = MyType; i32: Bar; i64: Bar + FooBar };
}
```
which generates the following output:
```shell
Foo impl ZST where T is MyType
Foo impl ZST where T implements Bar
Foo impl ZST where T implements Bar and FooBar
Default Foo for ZST
```
Of course the annotations not relevant to the current parameters can be removed, and hence we can have this cleaner version of the `main`:
```rust
fn main() {
    let zst = ZST;
    spec! { zst.foo(1u8); u8 = MyType };
    spec! { zst.foo(1i32); i32: Bar };
    spec! { zst.foo(1i64); i64: Bar + FooBar };
    spec! { zst.foo(1i8) };
}
```

## Multi-specialization
To allow the user to use the macros on multiple traits and types at the same type, we need to slightly modify the syntax of the `spec!` macro.

First of all, we can't really use `std::any::type_name_of_val` as it is only resolved at runtime and not at compile time, which would force us to have the macro expansion to return a large boilerplate for _every_ invokation of such macro, which of course is not ideal.

Considering this, the function-like macro's allowed syntax becomes the following:
- `spec! { expr; var_type; args_types; annotations }`

The `expr` and `annotations` were already defined above, while:
- `var_type` is the type of the variable on which we make the call, in the example above it would be `ZST`.
- `args_types` is an array which contains the types of each argument of the invoked method and it follows the following syntax `[arg_type_1, arg_type_2, ...]`. Its length must be the same as that of the arguments in the `expr` and it's optional if the function takes no argument (other than `&self`), but required if we need to specify some `annotations`.

Taken all of this into consideration, here's a more extensive allowed use of the macro-based specialization:
```rust
struct ZST;
struct ZST2;

#[specializable]
trait Foo<T> { fn foo(&self, x: T); }

#[specializable]
trait Foo2<T, U> {
    fn foo(&self);
    fn foo2(&self, x: T, y: U);
}

type MyType = u8;

trait Bar {}
trait FooBar {}

impl Bar for i32 {}
impl Bar for i64 {}
impl FooBar for i64 {}

// ZST - Foo

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T = MyType)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is MyType");
    }
}

#[when(T: Bar)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T implements Bar");
    }
}

#[when(T: Bar + FooBar)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T implements Bar and FooBar");
    }
}

// ZST - Foo2

#[spec_default]
impl<T, U> Foo2<T, U> for ZST {
    fn foo(&self) {
        println!("Default Foo2::foo for ZST");
    }
    fn foo2(&self, x: T, y: U) {
        println!("Default Foo2::foo2 for ZST");
    }
}

#[when(T = MyType)]
impl<T, U> Foo2<T, U> for ZST {
    fn foo(&self) {
        println!("Foo2::foo for ZST where T is MyType");
    }
    fn foo2(&self, x: T, y: U) {
        println!("Foo2::foo2 for ZST where T is MyType");
    }
}


// ZST2 - Foo

#[spec_default]
impl<T> Foo<T> for ZST2 {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST2");
    }
}

#[when(T = MyType)]
impl<T> Foo<T> for ZST2 {
    fn foo(&self, x: T) {
        println!("Foo impl ZST2 where T is MyType");
    }
}


fn main() {
    let zst = ZST;
    let zst2 = ZST2;
    
    // ZST - Foo
    spec! { zst.foo(1u8); ZST; [u8]; u8 = MyType }
    spec! { zst.foo(1i32); ZST; [i32]; i32: Bar  }
    spec! { zst.foo(1i64); ZST; [i64]; i64: Bar + FooBar }
    spec! { zst.foo(1i8); ZST; [i8] }

    // ZST - Foo2
    spec! { zst.foo(1u8, 2u8); ZST; [u8, u8]; u8 = MyType }
    spec! { zst.foo(1i32, 1i32); ZST; [i32, i32] }

    // ZST2 - Foo
    spec! { zst2.foo(1u8); ZST2; [u8]; u8 = MyType }
    spec! { zst2.foo(1i8); ZST2; [i8] }
}
```
which generates the following output:
```shell
Foo impl ZST where T is MyType
Foo impl ZST where T implements Bar
Foo impl ZST where T implements Bar and FooBar
Default Foo for ZST

Foo2 for ZST where T is MyType
Default Foo2 for ZST

Foo impl ZST2 where T is MyType
Default Foo for ZST2
```


## Lifetimes
The interaction between specialization and lifetimes is pretty problematic, as tracked in this [github issue](https://github.com/rust-lang/rust/issues/40582) and better discussed in this [in depth article](https://aturon.github.io/blog/2017/07/08/lifetime-dispatch/).
More specifically, during code generation (the phase where MIR is lowered to LLVM IR and then to machine code) the compiler doesn't know about lifetimes (since it has already erased all lifetime information) and so it can't use them to choose which implementation should apply.
To avoid this soundness issue, specialization based on lifetimes is hence not allowed.

### Rule
More precisely, given that we have to manually tell the `spec!` macro which traits the value we are passing implements (see [annotations](https://hackmd.io/VFhcjTupTJ23ilKpTrj7Kw#Annotations) above) and that we want to have an implementation marked as default (using `#[spec_default]`), we could say that
1. no lifetime specification can be used in the predicates of the `when` macro.
2. in every spec we must have the same lifetimes costraints as in all the other specs for that type-trait couple, so every generic parameter `T` can either have no lifetime constraint in every spec or have the same constraint (generic `'a` or `'static`) in each one of them. 
3. no generic type parameter can appear in the same spec condition twice on the right side of a declaration.
4. no generic type parameter can appear on the right side of a declaration if it is constrained to a specific lifetime (like `'static`).
5. no generic lifetime can be associated with more than one generic type parameter in the same spec.

Taken the "always applicable rule" used by `min_specialization` (and defined in [this](https://smallcultfollowing.com/babysteps/blog/2018/02/09/maximally-minimal-specialization-always-applicable-impls/) blog post), we could see our point 2. as an extension of the second condition and our point 3. as the third condition itself. 
Note: the first condition from that post should not be needed in this case because we already have the need to ask for the implemented traits, so there can't be cases where the implementation of a trait or not depends on a lifetime (like [example 3](https://hackmd.io/VFhcjTupTJ23ilKpTrj7Kw?stext=19851%3A222%3A0%3A1744916084%3AtvGDvm&both=) which we'll see later) as we require the user to tell us upfront.

**Point 1.** is required because, as discussed, we don't want to allow any kind of specialization based on lifetimes.

**Point 2.** is required because we might want to have some lifetimes restrictions applied to all of the possible specializations, for example we want to allow the following case
```rust
trait Foo { fn foo(&self); }

trait Bar {}

#[spec_default]
impl<T: 'static> Foo for T {
    fn foo(&self) {
        println!("Default Foo for T");
    }
}

#[when(T: Bar)]
impl<T: 'static> Foo for T {
    fn foo(&self) {
        println!("Foo for T where T implements Bar");
    }
}
```
which will be translated into something equivalent to
```rust
trait Foo { fn foo(&self); }

trait FooBar { fn foo(&self); }

trait Bar {}

impl<T: 'static> Foo for T {
    fn foo(&self) {
        println!("Default Foo for T");
    }
}

impl<T: 'static + Bar> FooBar for T {
    fn foo(&self) {
        println!("Foo for T where T implements Bar");
    }
}
```
Another case we would like to allow is the following
```rust
struct ZST;

trait Foo<T> { fn foo(&self, x: T); }

trait Bar {}

#[spec_default]
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T: Bar)]
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T implements Bar");
    }
}
```
which will be translated into something equivalent to
```rust
struct ZST;

trait Foo<T> { fn foo(&self, x: T); }

trait FooBar<T> { fn foo(&self, x: T); }

trait Bar {}

impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

impl<T: 'static + Bar> FooBar<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T implements Bar");
    }
}
```
This rule translates into saying that the signature of each specialized `impl` must be equal to that of the default one, but don't worry: you can still handle more complex cases where you need more generics, simply by using them or by using the placeholder `_`.
Here are some examples of that:
```rust
struct ZST;

trait Foo<T> { fn foo(&self, x: T); }

#[spec_default]
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

// here the placeholder `_` will be replaced by a generic parameter U
#[when(T = Vec<_>)]
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is Vec<U>");
    }
}

// here each placeholder `_` will be replaced by a different generic parameter
#[when(T = (_, _))]
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is (U, V)");
    }
}

// here we know that `U` is a generic parameter because it is later used
// in the expression in a place expecting a generic 
#[when(all(T = Vec<U>, U: Clone))] 
impl<T: 'static> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is Vec<U> and U implements Clone");
    }
}
```

**Point 3.** is also required because lifetimes constraints might be more sneaky like in the following examples:
```rust
struct ZST;

trait Foo<T> { fn foo(&self, x: T); }

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(all(T = (U, U), U = &str))]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is (&str, &str)");
    }
}

#[when(all(T = (U, V), V = U, U = &str))]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is (&str, &str)");
    }
}
```
The problem here is that the above examples would resolve in `T = (&'a str, &'a str)`, hence requiring a specialization based on lifetimes, which again we don't want to allow.
To comply with point 1. while also providing a better DevEx, we can simply assume that each time we are re-using a generic parameter that assumes a certain lifetime, we are considering that parameter for a new generic lifetime. So in the examples above, the code would be interpreted as `T = (&'a str, &'b str)`.

### Examples
1. We don't want to allow specialization on lifetimes, so neither of the two following specializations can be allowed as they are adding a constraint on `T` (saying that it must have a `'static` lifetime), while in the default spec `T` could have any lifetime.
```rust
struct ZST;

trait Foo<T> { fn foo(&self, x: T); }

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T: 'static)] // this violates point 1
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is 'static");
    }
}

#[when(T: Clone)]
impl<T: 'static> Foo<T> for ZST { // this violates point 2
    fn foo(&self, x: T) {
        println!("Foo for ZST where T is 'static and clone");
    }
}
```
2. This is basically the same as the first example: we are adding a lifetime constraint that wasn't there in the default case and this violates point 1, but it would be ok if in the default case we had `T: 'static` instead of just `T`.
```rust
//? soundness issue reported in the original implementation

trait Bomb {
    type Assoc: Default;
}

impl<T> Bomb for T {
    default type Assoc = ();
}

impl Bomb for &'static str {
    type Assoc = String;
}

fn build<T: Bomb>(t: T) -> T::Assoc {
    T::Assoc::default()
}

fn main() {
    let s: String = build("Uh oh");
    drop(s) // typeck and trans disagree about the type of `s`
}
```
3. This should not be a problem, because in the `spec!` we have to specify manually if we implement the trait or not, hence overcoming the original problem of having the chosen specialization depend on the `'static` lifetime. 
```rust
//? soundness issue reported in the original implementation

////////////////////////////////////////////////////////////////////////////////
// Crate marker
////////////////////////////////////////////////////////////////////////////////

trait Marker {}
impl Marker for u32 {}

////////////////////////////////////////////////////////////////////////////////
// Crate foo
////////////////////////////////////////////////////////////////////////////////

extern crate marker;

trait Foo {
    fn foo(&self);
}

impl<T> Foo for T {
    default fn foo(&self) {
        println!("Default impl");
    }
}

impl<T: marker::Marker> Foo for T {
    fn foo(&self) {
        println!("Marker impl");
    }
}

////////////////////////////////////////////////////////////////////////////////
// Crate bar
////////////////////////////////////////////////////////////////////////////////

extern crate marker;

pub struct Bar<T>(T);
impl<T: 'static> marker::Marker for Bar<T> {}

////////////////////////////////////////////////////////////////////////////////
// Crate client
////////////////////////////////////////////////////////////////////////////////

extern crate foo;
extern crate bar;

fn main() {
    // prints: Marker impl
    0u32.foo();

    // The relevant specialization depends on the 'static lifetime
    // If the lifetime specialization was allowed, it would print
    // "Marker impl".
    bar::Bar("Activate the marker!").foo();
}
```
4. This is also the same as the first example: we are adding a lifetime constraint that wasn't there in the default case and this violates point 2, but the overload would be ok if in the default case we had `R: 'a` instead of just `R`. In that case, though, the code would not compile as it's not possible to assume `'static` in the return type of `make_static`.
```rust
//? soundness issue reported in the original implementation

trait FromRef<'a, T: ?Sized> {
    fn from_ref(r: &'a T) -> Self;
}

impl<'a, T: ?Sized, R> FromRef<'a, T> for R {
    default fn from_ref(_: &'a T) -> Self {
        unimplemented!()
    }
}

impl<'a, T: ?Sized> FromRef<'a, T> for &'a T {
    fn from_ref(r: &'a T) -> Self {
        r
    }
}

fn main() {
    let s = "specialization".to_owned();
    println!("{:?}", make_static(s.as_str()));
}

fn make_static<T: ?Sized>(data: &T) -> &'static T {
    fn helper<T: ?Sized, R>(data: &T) -> R {
        R::from_ref(data)
    }
    helper(data)
}
```

## Overlap
To best evaluate the grade of specialization of each implementations' conditions, we need to first turn them into a common form, which is the [dnf](https://en.wikipedia.org/wiki/Disjunctive_normal_form). This is particularly helpful because it allows us to have for each implementation a set of separate cases in which it can be applied.

Now that we have these, we can filter between all of the implementations to only have those who are allowed for the current expression call (from now on we'll call them applicable impls), at which point we need to determine which one of them is the most specific one (which is the one that's going to be used).

To do this, we order the applicable impls following this simple procedure to compare the constraints: 
- we first check type conditions (e.g. `T = i32`) and if only one of them has that, it is the most specific impl.
- otherwise, we go ahead and check trait conditions (e.g. `T: Foo + Bar`) and if one of them has a greater number of traits implemented it is the most specific one.
- otherwise, we now check not-type conditions (e.g. `not(T = i32)`) and as per the previous step if one of them has more of them it is considered more specific.
- otherwise, we check not-trait conditions (e.g. `not(T: Foo + Bar)`) and we do the same as in the two previous steps.
- otherwise, if we get to this point the two conditions are considered equally specific.

After ordering the conditions, we need to ensure that there is a single most-specific one, otherwise we have an overlap and we can't procede as it is unsure which of them should be applied, as neither is more specific than the other(s).

But if one of the conditions is applicable and is more specific than the other applicable ones, we can procede and use that for the specialization.


# Useful links

- [Rust lang book](https://doc.rust-lang.org/book/)
- [Rust lang nomicon](https://doc.rust-lang.org/nomicon)
- [Rust lang reference - Procedural Macro](https://doc.rust-lang.org/reference/procedural-macros.html)
- [Rust reflection](https://github.com/dtolnay/reflect)
- [Conditions normalization](https://en.wikipedia.org/wiki/Disjunctive_normal_form)

## Macros
- [Hygienic macro expansion](https://www.semanticscholar.org/paper/Hygienic-macro-expansion-Kohlbecker-Friedman/d18e91ddfd00b2a04cdbbf800f25b3ce12e1c982)
- [Hygienic macro technology](https://www.semanticscholar.org/paper/Hygienic-macro-technology-Clinger-Wand/21a115b9948739dbe7dee1370276e7e1ff2fc783)
- [Macros that work](https://www.semanticscholar.org/paper/Macros-that-work-Clinger-Rees/7654657ce59704a0df9307546ce421b8f8b46928)
- [Composable and compilable macros](https://www.semanticscholar.org/paper/Composable-and-compilable-macros%3A%3A-you-want-it-when-Flatt/b85944b4417938b7b2cc042e916f85b914d6872d)
- [Semantic Analysis of Macro Usage for Portability](https://www.semanticscholar.org/paper/Semantic-Analysis-of-Macro-Usage-for-Portability-Pappas-Gazzillo/54cada836877b943e30049dbbc2f04b0c7356e21)
- [The Machine that Builds Itself: How the Strengths of Lisp Family Languages Facilitate Building Complex and Flexible Bioinformatic Models](https://www.semanticscholar.org/paper/The-Machine-that-Builds-Itself%3A-How-the-Strengths-Khomtchouk-Weitz/9f8fa009651be14308487da461cc8a462eff8dc7)
- [Template meta-programming for Haskell](https://www.semanticscholar.org/paper/Template-meta-programming-for-Haskell-Sheard-Jones/f57304b239f248037a0492054aaf4695c4fca610)

## Specialization
- [Autoref-based stable rust specialization](https://github.com/dtolnay/case-studies/blob/master/autoref-specialization/README.md)
- [Shipping specialization: a story of soundness](https://aturon.github.io/blog/2017/07/08/lifetime-dispatch/)
- [Maximally minimal specialization: always applicable impls](https://smallcultfollowing.com/babysteps/blog/2018/02/09/maximally-minimal-specialization-always-applicable-impls/)
- [Trace-based just-in-time type specialization for dynamic languages](https://www.semanticscholar.org/paper/Trace-based-just-in-time-type-specialization-for-Gal-Eich/0d281938d3ff2377541704cab6ba1c4408420733)
- [A general approach for run-time specialization and its application to C](https://www.semanticscholar.org/paper/A-general-approach-for-run-time-specialization-and-Consel-No%C3%ABl/bd0e3c9f36d2937efb5f99bd23e8032d3f7dab3a)
- [Compile-Time Symbolic Differentiation Using C++ Expression Templates](https://www.semanticscholar.org/paper/Compile-Time-Symbolic-Differentiation-Using-C%2B%2B-Kourounis-Gergidis/355048aefa8e6b9cb1612ab1b0a0de4751e7582d)
- [Dynamic dispatch of context-sensitive optimizations](https://www.semanticscholar.org/paper/Dynamic-dispatch-of-context-sensitive-optimizations-Poesia-Pereira/f7445195598494595c372ae34c141a558c2745d6)
- [Contextual dispatch for function specialization](https://www.semanticscholar.org/paper/Contextual-dispatch-for-function-specialization-Fl%C3%BCckiger-Chari/87069bc91b8448831fbe8371956465632c03f5da)
- [A Methodology for Procedure Cloning](https://www.sciencedirect.com/science/article/pii/009605519390005L?via%3Dihub)
- [Using Procedure Cloning for Performance Optimization of Compiled Dynamic Languages](https://www.semanticscholar.org/paper/Using-Procedure-Cloning-for-Performance-of-Compiled-Hus%C3%A1k-Kofro%C5%88/7aeb1e4df3588e4e274cb4aa09b32c493d53b204)

## Overloading
- [The Use of Overloading in Java Programs](https://www.semanticscholar.org/paper/The-Use-of-Overloading-in-Java-Programs-Gil-Lenz/f6250da7b8227c0b4220f09037066bb3340964d5)
- [Overlord: A C++ Overloading Inspector](https://www.semanticscholar.org/paper/Overlord%3A-A-C%2B%2B-Overloading-Inspector-Horv%C3%A1th-Szalay/637c3429736e053138873d291fccc188d5bfa39d)
- [Incremental overload resolution in object-oriented programming languages](https://www.semanticscholar.org/paper/Incremental-overload-resolution-in-object-oriented-Szab%C3%B3-Kuci/6f38f6d52f83e599058a9d6b862e68446f5092c6)
- [Java Modular Extension for Operator Overloading](https://www.semanticscholar.org/paper/Java-Modular-Extension-for-Operator-Overloading-Melentyev/166c9943cc847087d95c8ae642f7dfbdb80920b8)

## Monomorphization
- [Featherweight go](https://www.semanticscholar.org/paper/Featherweight-go-Griesemer-Hu/bf5a74b7a82f493353900c220e899cb1f02ee988)
- [Generic go to go: dictionary-passing, monomorphisation, and hybrid](https://www.semanticscholar.org/paper/Generic-go-to-go%3A-dictionary-passing%2C-and-hybrid-Ellis-Zhu/8c928294aea1624a4e40a977723c1f2a17faac8e)

## Rust
- [Towards a Transpiler for C/C++ to Safer Rust](https://www.semanticscholar.org/paper/Towards-a-Transpiler-for-C-C%2B%2B-to-Safer-Rust-Tripuramallu-Singh/915ce85e57910f7decc9fec605f81f6fcb46c59b)
- [Bringing Rust to Safety-Critical Systems in Space](https://www.semanticscholar.org/paper/Bringing-Rust-to-Safety-Critical-Systems-in-Space-Seidel-Beier/5864bb946e7f53af26a989b2cbed3269e45d941e)

## Related work
- [Extending OpenMP to Support Automated Function Specialization Across Translation Units](https://link.springer.com/chapter/10.1007/978-3-031-15922-0_11)
- [Template Metaprogramming Techniques for Concept-Based Specialization](https://onlinelibrary.wiley.com/doi/abs/10.3233/SPR-130362)
- [Meta-Level Reuse for Mastering Domain Specialization](https://link.springer.com/chapter/10.1007/978-3-319-47169-3_16)
- [Clone detection using abstract syntax trees](https://ieeexplore.ieee.org/abstract/document/738528?casa_token=7fx2mAaB93AAAAAA:oaWsTPo7y-APpX23ufcRp_QiNFGxCjkULbW6Iog4d2dFt0IsJFT9mLBkSC5z3vfEoZRASL4)

# Sperimentation
Alternatives used in stable rust to overcome the lack of specialization.
## Type bounds
Baseline 1 (approach with specialization)
```rust
struct MyType;
trait Foo<T> {
    fn foo(&self, v: T)
}
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("default");
    }
}
impl Foo<i32> for MyType {
    fn foo(&self, v: i32) {
        println!("v is i32");
    }
}
impl Foo<u32> for MyType {
    fn foo(&self, v: u32) {
        println!("v is u32");
    }
}
fn call<T>(x: &MyType, v: T) {
    x.foo(v);
}
```
Baseline 2 (approach with our proposal)
```rust
struct MyType;
trait Foo<T> {
    fn foo(&self, v: T)
}
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("default");
    }
}
#[when(T = i32)]
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v is i32");
    }
}
#[when(T = u32)]
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v is u32");
    }
}
fn call_default<T>(x: &MyType, v: T) {
    spec!{x.foo(v); MyType, [xxx]};
}
fn call_i32(x: &MyType, v: i32) {
    spec!{x.foo(v); MyType, [i32]};
}
fn call_u32(x: &MyType, v: u32) {
    spec!{x.foo(v); MyType, [u32]};
}
```
1. Manual dispatch
```rust
struct MyType;
trait Foo {
    fn foo_i32(&self, v: i32)
    fn foo_u32(&self, v: u32)
}
impl Foo for MyType {
    fn foo_i32&self, v: i32) {
        println!("v is i32");
    }
    fn foo_u32(&self, v: u32) {
        println!("v is u32");
    }
}
fn call_i32(x: &MyType, v: i32) {
    x.foo_i32(v);
}
fn call_u32(x: &MyType, v: u32) {
    x.foo_u32(v);
}
```
2. Monomorphized traits
```rust
struct MyType;
trait FooDefault<T> {
    fn foo(&self, v: T);
}
trait FooI32 {
    fn foo(&self, v: i32);
}
trait FooU32 {
    fn foo(&self, v: u32);
}
impl FooDefault for MyType {
    fn foo(&self, v: T) {
        println!("default");
    }
}
impl FooI32 for MyType {
    fn foo(&self, v: i32) { 
        println!("v is i32"); 
    }
}
impl FooU32 for MyType {
    fn foo(&self, v: u32) { 
        println!("v is u32"); 
    }
}
fn call_default<T>(x: &MyType, v: T) {
    <MyType as FooDefault<T>>::foo(x, v);
}
fn call_i32(x: &MyType, v: i32) {
    <MyType as FooI32>::foo(x, v);
}
fn call_u32(x: &MyType, v: u32) {
    <MyType as FooU32>::foo(x, v);
}
```
3. Standalone fns
```rust
struct MyType;
fn foo_default<T>(x: &MyType, v: T) {
    println!("default");
}
fn foo_i32(x: &MyType, v: i32) {
    println!("v is i32");
}
fn foo_u32(x: &MyType, v: u32) {
    println!("v is u32");
}
fn call_default<T>(x: &MyType, v: T) {
    foo_default(x, v);
}
fn call_i32(x: &MyType, v: i32) {
    foo_i32(x, v);
}
fn call_u32(x: &MyType, v: u32) {
    foo_u32(x, v);
}
```
4. Pattern matching blocks
```rust
struct MyType;
enum Value {
    I32(i32),
    U32(u32),
    Default
}
fn foo(x: &MyType, v: Value) {
    match v {
        Value::I32 => {
            println!("v is i32");
        }
        Value::U32 => {
            println!("v is u32");
        }
        Value::Default => {
            println!("default");
        }
    }
    
}
fn call(x: &MyType, v: Value) {
    foo(x, v);
}
```
5. If blocks
```rust
struct MyType;
enum Value {
    I32(i32),
    U32(u32),
    Default
}
fn foo(x: &MyType, v: Value) {
    if let Value::I32(v) = v {
        println!("v is i32");
    } else if let Value::U32(v) = v {
        println!("v is u32");
    } else {
        println!("default");
    }
}
fn call(x: &MyType, v: Value) {
    foo(x, v);
}
```
6. Type-level dispatch
```rust
struct MyType {}
struct MyTypeWithV<T> {
    v: T,
}
trait Foo {
    fn foo(&self);
}
impl Foo for MyTypeWithV<i32> {
    fn foo(&self) { 
        println!("v is i32"); 
    }
}
impl Foo for MyTypeWithV<u32> {
    fn foo(&self) { 
        println!("v is u32"); 
    }
}
fn call_i32(x: &MyType, v: i32) {
    let x = MyTypeWithV { v };
    x.foo();
}
fn call_u32(x: &MyType, v: u32) {
    let x = MyTypeWithV { v };
    x.foo();
}

```
7. Sealed trait
```rust
struct MyType;
mod sealed {
    pub trait Sealed {}
}
use sealed::Sealed;
trait Foo<T>: Sealed {
    fn foo(&self, v: T);
}
impl Sealed for MyType {}
impl Foo<i32> for MyType {
    fn foo(&self, v: i32) { 
        println!("v is i32"); 
    }
}
impl Foo<u32> for MyType {
    fn foo(&self, v: u32) { 
        println!("v is u32"); 
    }
}
fn call<T, X: Foo<T>>(x: &X, v: T) {
    x.foo(v);
}
```
8. Layered traits

Alternatively the options 1,2,3,6 might use pattern matching in the call functions, which improves readibility a little bit.

## Trait bounds
Baseline 1 (approach with specialization)
```rust
struct MyType;
trait Foo<T> {
    fn foo(&self, v: T)
}
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("default");
    }
}
impl<T: Copy> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v implements Copy");
    }
}
impl<T: Clone> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v implements Clone");
    }
}
fn call<T>(x: &MyType, v: T) {
    x.foo(v);
}
```
Baseline 2 (approach with our proposal)
```rust
struct MyType;
trait Foo<T> {
    fn foo(&self, v: T)
}
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("default");
    }
}
#[when(T: Copy)]
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v implements Copy");
    }
}
#[when(T: Clone)]
impl<T> Foo<T> for MyType {
    fn foo(&self, v: T) {
        println!("v implements Clone");
    }
}
fn call_default<T>(x: &MyType, v: T) {
    spec!{x.foo(v); MyType; [xxx]};
}
fn call_copy<T: Copy>(x: &MyType, v: T) {
    spec!{x.foo(v); MyType; [xxx]; xxx: Copy};
}
fn call_clone<T: Clone>(x: &MyType, v: T) {
    spec!{x.foo(v); MyType; [xxx]; xxx: Clone};
}
```


# Formalization
## Reasoning about Traits via Typing Rules

Traits are fundamentally about interfaces and ad hoc polymorphism. When we reason about them formally, we usually care about:
- Typing: When is a program using traits type-correct?
- Resolution: How are trait methods actually picked and invoked?
- Semantics: What meaning (denotational, operational) do trait-based programs have?
- Coherence: Is method dispatch unambiguous?
- Soundness: Does the trait system preserve type safety?

> [!WARNING]
>
> We **must** extend the following typing rules by making trait constraints explicit in the typing judgment.
> Instead of judgments of the form
> $$
> \Gamma \vdash e : T
> $$
> we **must** use judgments of the form
> $$
> \Gamma \mid \Delta \vdash e : T
> $$
> where:
> - $\Gamma$ is the usual typing context (variables and their types),
> - $\Delta$ is a trait context, a set of trait constraints of the form $T : \text{Trait}$.
> This reflects that typing an expression might assume certain trait implementations.

## Formal Typing Systems for Traits

It is done by usually extending the core typing rules of our language with trait-specific rules.
Typical ingredients:
- Trait bounds: "type $T$ must implement trait $\text{Trait}$"
    $$
    \frac{
        \Gamma \vdash e : T \quad T : \text{Trait} \in \Gamma
    }{
        \Gamma \vdash e : T : \text{Trait}
    }
    $$
    - $\Gamma$ is the type environment.
    - $T \models \text{Trait}$ means that $T$ satisfies all the constraints required by the trait $\text{Trait}$.

    This rule says that, given an expression $e$ of type $T$, if $T$ implements $\text{Trait}$, then we can type $e$ with the trait bound.

- Trait constraints in contexts: By carrying assumptions like $T: \text{Trait}$ in our type environment. In other words, if an implementation of a trait is in scope, we can use it.
    $$
    \frac{
        \Gamma \vdash e : T \quad T : \text{Trait} \quad \Gamma' = \Gamma, T : \text{Trait}
    }{
        \Gamma' \vdash e : T
    }
    $$
    - $\Gamma'$ is the extended type environment, where we include the assumption that $T$ implements the trait $\text{Trait}$.
    - $T : \text{Trait}$ is the trait constraint on the type $T$, indicating that $T$ must implement $\text{Trait}$.

    This rule demonstrates that, when typechecking expression $e$ of type $T$, and we assume that $T$ satisfies the trait $\text{Trait}$, we extend the type environment to include this assumption and proceed with the typechecking of $e$.

- Method typing: When typechecking a method call, we need to verify that the trait constraint is satisfied for the receiver type.
    $$
    \frac{
        \Gamma \vdash e : T \quad \text{TraitMethod}(T, \text{Trait}, m) = (\text{args} \to \text{ret})
    }{
        \Gamma \vdash e.m(\text{args}) : \text{ret}
    }
    $$
    - $e$ is the receiver expression being typechecked.
    - $\text{TraitMethod}(T, \text{Trait}, m)$ refers to the method $m$ in the trait $\text{Trait}$ implemented by type $T$, with the signature $(\text{args} \to \text{ret})$.

    Trait lookup must succeed: it's not enough that $e$ has type $T$; we must also know that $T$ implements the trait containing $m$.
Typing depends on the method signature associated with $m$ in that trait.

## Resolution

Resolution is about figuring out which implementation of a trait method is being called.
In formal systems, resolution can be modeled as a separate judgment:
$$
\Gamma \vdash T \Rightarrow m \mapsto f
$$
where:
- $\Gamma$ is the typing context.
- $\Rightarrow$ is a relation that indicates that type $T$ provides a method $m$ that maps to an implementation $f$. It is read as "resolves to".
- $m$ is the method being called.
- $f$ is the function (or implementation) that will be executed when calling method $m$ on type $T$.
- $\mapsto$ is a relation that indicates the mapping between the method and its implementation.

We can immagine rules like:

**Direct implementation**:
$$
\frac{
    T: \text{Trait} \in \Gamma \quad T \Rightarrow m \mapsto f
}{
    \Gamma \vdash T \Rightarrow m \mapsto f
}
$$

This models normal, straightforward method dispatch — like calling a method on a struct that we already know implements a trait.


**Resolution Requires Trait Bounds**:

$$
\frac{
    T: \text{Trait} \in \Gamma \quad m \in \text{Trait}
}{
    \Gamma \vdash T \Rightarrow (m \mapsto \text{TraitMethod}(T, \text{Trait}, m))
}
$$

Even if we don't know yet whether $T$ implements the trait, we can assume it if it is in our assumptions.


Concretely:
```rust
trait Display {
    fn display(&self) -> String;
}

struct Point { x: i32, y: i32 }

impl Display for Point {
    fn display(&self) -> String {
        format!("({}, {})", self.x, self.y)
    }
}

// ====================

let p = Point { x: 1, y: 2 };
p.display(); // Direct implementation

// ====================

fn show<T: Display>(value: T) -> String {
    value.display() // Resolution requires trait bounds
}
```

## Semantics

Semantics describes what expressions mean after typing and resolution.

There are two main styles:
- Operational Semantics: How programs execute step-by-step.
- Denotational Semantics: Mapping programs to mathematical objects.

If we think operationally, trait method calls reduce to function applications.
So a small-step rule could be:
$$
\frac{
    \Gamma \vdash e : T \quad T \Rightarrow m \mapsto f
}{
    e.m(e') \to f(e, e')
}
$$
where:
- $e$ is the receiver expression.
- $e'$ is the argument expression.

This models that a method call becomes a direct function call.


## Coherence

- [Coherence of Type Class Resolution](https://dl.acm.org/doi/pdf/10.1145/3341695)
- [Type classes: an exploration of the design space](https://courses.cs.washington.edu/courses/cse590p/06sp/multi.pdf)
- [Little Orphan Impls](https://smallcultfollowing.com/babysteps/blog/2015/01/14/little-orphan-impls/) by Matsakis

In any well-typed program, method dispatch is deterministic and unambiguous. In other words, trait coherence in Rust type systems ensures that for a given trait and set of types, there's only one implementation that applies.
Formally, for any $\Gamma$, $T$, and $m$, there is at most one $f$ such that
$$
\Gamma \vdash T \Rightarrow m \mapsto f
$$

This means that for any type $T$ and method $m$, there is at most one implementation $f$ that can be resolved. If two different implementations could be resolved, it would lead to ambiguity in method dispatch.
Formally, this is expressed as:
$$
\forall \Gamma, T, m, f_1, f_2 \quad \text{if} \quad \Gamma \vdash T \Rightarrow m \mapsto f_1 \land \Gamma \vdash T \Rightarrow m \mapsto f_2
\implies f_1 = f_2
$$

In Rust, this is enforced by the orphan rules and overlapping trait restrictions, which prevent two distinct trait implementations from being equally applicable. **We need to formalize this in our system.**

## Soundness

Finally, the heart of it all: Soundness.
Soundness means that well-typed programs cannot "go wrong" at runtime. In the context of traits, this specifically implies:
- If a method call typechecks, it will always successfully dispatch to a valid function.
- No "method not found" or "wrong number of arguments" errors can happen at runtime if typing succeeded.

More precisely, we usually prove soundness via two main properties:

**Progress:**
- A well-typed expression is either a value or can take a step of evaluation.
- Trait method calls will resolve and execute — they won't get stuck.

**Preservation**:
- If a well-typed expression takes a step, the resulting expression is still well-typed (under possibly updated typing context).
- Method calls reduce to applications of the corresponding function, preserving types.

Formally, we can express this as:
$$
\frac{
    \Gamma \vdash e : T \quad e \to e'
}{
    \Gamma \vdash e' : T
}
$$
where:
- $\Gamma$ is the typing context.
- $e$ is the original expression.
- $e'$ is the resulting expression after a step of evaluation.
- $T$ is the type of the original expression.

This means that if $e$ is well-typed, and it takes a step to $e'$, then $e'$ is also well-typed.

## Additional Things

Our typing judgments will have the form:
$$
\Gamma \mid \Delta \vdash e : T
$$
where:
- $\Gamma$ = variable context (usual types of variables),
- $\Delta$ = trait context (assumed trait constraints like $T : \text{Trait}$),
- $e$ = the expression,
- $T$ = the type assigned to $e$.

We need typing rules for:

### Variables
Variables have the type assigned to them in $\Gamma$.
$$
\frac{
    x : T \in \Gamma
}{
    \Gamma \mid \Delta \vdash x : T
} \quad {\tiny(\text{T-Var})}
$$


### Functions (lambdas)

Typing a lambda expression:
$$
\frac{
    \Gamma, x : T_1 \mid \Delta \vdash e : T_2
}{
    \Gamma \mid \Delta \vdash \lambda x. e : T_1 \to T_2
} \quad {\tiny(\text{T-Abs})}
$$


### Function Application
Application typechecks as usual:
$$
\frac{
    \Gamma \mid \Delta \vdash e_1 : T_1 \to T_2
    \quad
    \Gamma \mid \Delta \vdash e_2 : T_1
}{
    \Gamma \mid \Delta \vdash e_1(e_2) : T_2
} \quad {\tiny(\text{T-App})}
$$

## Introducing Trait Constraints
If we want to *assume* that $T$ implements trait $\text{Trait}$, we add it to the context.
$$
\frac{
    \Gamma \mid \Delta, T : \text{Trait} \vdash e : T'
}{
    \Gamma \mid \Delta \vdash e : T'
} \quad {\tiny(\text{T-TraitBound})}
$$
where $T : \text{Trait} \in \Delta$.

(*this just says we can use our trait assumptions during typechecking.*)

### Method Call via Traits
When typechecking a method call $e.m(e')$:
$$
\frac{
    \Gamma \mid \Delta \vdash e : T
    \quad
    T : \text{Trait} \in \Delta
    \quad
    \text{TraitMethod}(T, \text{Trait}, m) = (T' \to T'')
    \quad
    \Gamma \mid \Delta \vdash e' : T'
}{
    \Gamma \mid \Delta \vdash e.m(e') : T''
} \quad {\tiny(\text{T-MethodCall})}
$$

**Explanation**:
- $e$ must have type $T$,
- We must *know* (in $\Delta$) that $T$ implements $\text{Trait}$,
- The method $m$ must be found inside $\text{Trait}$ for $T$,
- The argument $e'$ must match the input type $T'$,
- Result type is $T''$.

## Trait Introduction Rules

If we have **impl blocks** (like `impl Display for Point`), we might have special typing rules for "trait introduction", but for now we can treat those as building $\Delta$ appropriately.

For example, if we have:
```rust
impl Display for Point {
    fn display(&self) -> String { ... }
}
```

We can add a rule like, but generic:
$$
\frac{
    \Gamma \mid \Delta \vdash e : T
    \quad
    T : \text{Display} \in \Delta
}{
    \Gamma \mid \Delta, T : \text{Display} \vdash e.display() : String
} \quad {\tiny(\text{T-TraitImpl})}
$$

## Resolution Judgment (separate)

Method resolution (needed for semantics) has a judgment like:
$$
\Gamma \vdash T \Rightarrow m \mapsto f
$$
Meaning: for type $T$ and method $m$, we resolve to function $f$.

Resolution must succeed if the typing rule above is used!

## Soundness Proof (Progress + Preservation)

Because we have full typing rules, we can now set up:

### Progress
If $\Gamma \mid \Delta \vdash e : T$, then either:
- $e$ is a value (e.g., a function), or
- $e$ can step: $e \to e'$.

In particular:
- If $e = e_1.m(e_2)$, and $e_1$ and $e_2$ are values, and $T$ implements the trait, then **resolution** tells us which $f$ to call.
- So $e_1.m(e_2) \to f(e_1, e_2)$.

No stuck expressions occur because method resolution always succeeds when types say it should.

### Preservation
If $\Gamma \mid \Delta \vdash e : T$ and $e \to e'$, then
$$
\Gamma \mid \Delta \vdash e' : T
$$
still holds.

In particular:
- If $e = e_1.m(e_2) \to f(e_1, e_2)$,
- and $f$ is the correct implementation from trait lookup,
- and $f$ has type $T_1 \to T'$, then $f(e_1, e_2)$ still has type $T'$,
- matching the type assigned to $e.m(e')$.

Thus typing is preserved across evaluation steps.

