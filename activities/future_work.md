# Future Work

## 1

- Think of arc weights as clock cycles. The sum of incoming arc weights to a node is the number of clock cycles it takes to reach that node. This is a more intuitive way to think about the weights.
    - We can do it using the MIR and the AST
    - Comparison with the true clock cycle count can be done to see how well the model is doing.

## 2

- Coupling between functio in the MIR
    - `.clone()` to satisfy borrow checker is anti-pattern
    - Evaluate the approach between different rust codebases

## 3

- Find anti-pattern in rust codebases
    - Use the MIR to find the anti-pattern
    - Example: `.clone()` where it is not correct

# Notes

## Art1

- Write it proposing rust codebases as an SPL, and the analysis can be simply the number of cross-tree constraints.
- RustEx is a tool to extract cross-tree constraints of rust codebases.
