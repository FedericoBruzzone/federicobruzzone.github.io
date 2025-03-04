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

## Proposal

This proposal aims to introduce a novel way to specialize trait implementations in Rust. The idea is to leverage the Rust _macro_ system to provide a way to define specialized implementations for a trait based on the type of the generic parameter. The proposed syntax for the _derive_ macro is the following:

- `#[spec_default]` to define the default implementation for a trait.

- `#[when(T: U)]` to define a specialized implementation for a trait when the generic parameter `T` is of type `U`.

Between the round braces of the _derive_ macro, a predicate is expected. The predicate is a boolean expression that can contain the following operators:

- `any(T: U, T: V, ...)` to check if the type `T` is equal to `U`, `V`, ...

- `all(T: U, T: V, ...)` to check if the type `T` is equal to `U`, `V`, ...

- `not(T: U)` to check if the type `T` is not equal to `U`.

The _funcion_-like macro `spec!` is used to call the specialized implementation of a trait. The macro `spec!` is used to call the specialized implementation of a trait. The syntax is the following:

- `spec! { expr }` to call the specialized implementation of a trait, where `expr` is the expression that calls the trait method.

For example:
```rust
struct ZST; // Zero Sized Type

trait Foo<T> { fn foo(&self, x: T); }

#[spec_default]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Default Foo for ZST");
    }
}

#[when(T: String)]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is String");
    }
}

#[when(T: &[A])]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is &[A]");
    }
}

#[when(not(T: Vec<_>))]
impl<T> Foo<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is not Vec<_>");
    }
}

fn main() {
    let zst = ZST;
    spec! { zst.foo("hello".to_string()) };
    spec! { zst.foo(&[1, 2, 3]) };
    spec! { zst.foo("hello") };
    spec! { zst.foo(Vec::<()>::new()) };

}

// ===== NEW THINGS =====

static s: &str = "hello";

#[when(all(T: Clone, T: 'static, not(T := &'static Vec<_>))]
impl<T> Foo<T> for ZST {
    fn foo(&self, _x: T) {
        println!("...");
    }
}

fn main2() {
    let zst = ZST;
    spec! { zst.foo(s) };
}
```
generates the following output:
```shell
Foo impl ZST where T is String
Foo impl ZST where T is &[A]
Foo impl ZST where T is not Vec<_>
Default Foo for ZST
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

// Specialized trait for &[A]
trait FooSlice<A> { fn foo(&self, x: &[A]); }

// Specialized trait for not Vec<_>
trait FooNotVec<T> { fn foo(&self, x: T); }

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

impl<A> FooSlice<A> for ZST {
    fn foo(&self, x: &[A]) {
        println!("Foo impl ZST where T is &[A]");
    }
}

impl<T> FooNotVec<T> for ZST {
    fn foo(&self, x: T) {
        println!("Foo impl ZST where T is not Vec<_>");
    }
}

fn main() {
    let zst = ZST;
    <ZST as FooString>::foo(&zst, "hello".to_string());
    <ZST as FooSlice<i32>>::foo(&zst, &[1, 2, 3]);
    <ZST as FooNotVec<&str>>::foo(&zst, "hello");
    <ZST as Foo<Vec<()>>>::foo(&zst, vec![]);
}
```
