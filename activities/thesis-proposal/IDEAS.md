# Ideas

- Proof soundness of Trait system in the Rust compiler
    1. Define a formal model of the Rust language
    2. Define a formal model of the Rust compiler
    3. Define a formal model of the Rust trait system
    4. Prove that the Rust trait system is sound with respect to the formal model of the Rust language and the Rust compiler:
       1. Preservation: If a program is well-typed, then the result of executing the program is well-typed.
       2. Progress: If a program is well-typed, then the program will not get stuck.

- Taint Analysis on MIR to find buffer overflows
    1. Leveraging Lattice theory to define a taint analysis on MIR
    2. Implement the taint analysis in the Rust compiler
    3. Use the taint analysis to find buffer overflows in Rust programs

- Statically know how many arena my program needs and have one garbage collection for each arena with the benefit of low fragmentation and deallocation of the whole arena in one go. This could be an alternative to the borrow checker in Rust. Usare questo metodo solo per cio' che non dipende da input dall'utente.

- Statically determine the clock cycle of a program

- Extract computational graph from MIR to perform ML to do something

- Survey of LLVM optimizations

- From Safe Rust to C Code. And then ask to LLMs to regenerate the Rust code from the C code.
