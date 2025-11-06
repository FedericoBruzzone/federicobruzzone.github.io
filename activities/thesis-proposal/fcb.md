# Thesis

## Automatically Represent Dense Matrices as Sparse Matrices 

It is called matrix materialization. We need to pass to reduce the binary size of the program; the performance impact must be evaluated because calculate the new indices may be costly. Embedded systems may want this optimizations pass.
For instance, the following sparse matrix in CSR (Compressed Sparse Row) format:

```
RowPtr: [0, 2, 4, 4, 7]
ColInd: [0, 2, 2, 3, 0, 1, 3]
Values: [1, 2, 3, 4, 5, 6, 7]
```

Can be represented as a dense matrix:

```DenseMatrix:
[ [1, 0, 2, 0],
  [0, 0, 3, 4],
  [0, 0, 0, 0],
  [5, 6, 0, 7] ]
```

Other representations of sparse matrices can be considered, such as COO (Coordinate List) or DIA (Diagonal) formats. The optimization pass would analyze the sparsity pattern and decide whether to materialize the matrix based on factors like memory usage and access patterns.


## Exploring the Space of Optimization Sequences

Inspired by _Exploring the Space of Optimization Sequences for Code-Size Reduction: Insights and Tools_ (https://dl.acm.org/doi/pdf/10.1145/3446804.3446849) 

First thesis: Exploring the Space of Optimization Sequences for Compile-Time Reduction
Second thesis: Exploring the Space of Optimization Sequences for Run-Time Reduction

## Demand-Driven (Lazy) LCSSA Construction

## Integer Overflow as Unsafe Operation
