Prism.languages.mlir = {

  // =========================
  // COMMENT
  // =========================
  comment: {
    pattern: /\/\/[^\n]*/,
    greedy: true
  },

  // =========================
  // STRING
  // =========================
  string: {
    pattern: /"(?:\\.|[^"\\])*"/,
    greedy: true
  },

  // =========================
  // SSA VALUES
  // =========================
  ssa: {
    pattern: /%[\w.$:#]+/,
    alias: "variable"
  },

  // =========================
  // BLOCKS
  // =========================
  block: {
    pattern: /\^[\w\d_$.-]+/,
    alias: "keyword"
  },

  // =========================
  // FUNCTIONS (@matmul)
  // =========================
  func: {
    pattern: /@[\w$.-]+/,
    alias: "function"
  },

  // =========================
  // ATTRIBUTES (#vector.kind)
  // =========================
  attribute: {
    pattern: /#[\w$.-]+(?:\.[\w$.-]+)?/,
    alias: "constant"
  },

  // =========================
  // DIALECT NAMES (vector, arith, func)
  // =========================
  dialect: {
    pattern: /\b(func|arith|memref|tensor|util|vector|scf|linalg|llvm|affine|arm_sme|hal|builtin|flow|stream|iree_encoding|iree_tensor_ext)(?![\w.])/,
    alias: "keyword"
  },

  // =========================
  // SHAPE SEPARATOR (x in 64x64xf32 or [4]x[4]xf32)
  // =========================
  shape_sep: {
    pattern: /(?<=[\d\]?])x(?=[\d\[fi])/,
    alias: "operator"
  },

  // =========================
  // NUMBERS (SAFE)
  // =========================
  number: {
    pattern: /0x[0-9a-fA-F]+|\b\d+\b(?!x)/,
    alias: "number"
  },

  // =========================
  // TYPES
  // =========================
  type: {
    pattern: /\b(memref|tensor|vector|tuple|complex)(?!\.)\b|\b[su]?i\d+\b|\bf(16|32|64|80|128)\b|\bindex\b|\bnone\b/,
    alias: "class-name"
  },

  // =========================
  // BOOLEANS
  // =========================
  boolean: {
    pattern: /\b(true|false)\b/,
    alias: "boolean"
  },

  // =========================
  // GENERICS (<...>)
  // =========================
  generic: {
    pattern: /<(?![^>\n]*->)[^>\n]*>/,
    alias: "type"
  },

  // =========================
  // DIALECT PREFIX (arith, vector before the dot)
  // =========================
  dialect_prefix: {
    pattern: /\b(arith|vector|func|memref|tensor|util|scf|linalg|llvm|affine|arm_sme|hal|builtin|flow|stream|iree_encoding|iree_tensor_ext)(?=\.)/,
    alias: "class-name"
  },

  // =========================
  // OPERATION NAME (after dot: .constant, .addi)
  // =========================
  op_name: {
    pattern: /\.[a-zA-Z_][\w$-]*/,
    alias: "operator"
  },

  // =========================
  // ATTRIBUTE NAMES (indexing_maps, iterator_types, affine_map — plain, no color)
  // =========================
  attr_name: /\b(affine_map|indexing_maps|iterator_types)\b/,

  // =========================
  // PUNCTUATION
  // =========================
  punctuation: /[{}()[\]<>:=,-]/,

  // =========================
  // KEYWORDS
  // =========================
  keyword: /\b(module|return|yield|cf|private|public)\b/
};

// =========================
// AArch64 assembly (GNU/LLVM syntax, as printed by llvm-objdump)
// =========================
Prism.languages.aarch64 = {
  comment: {
    pattern: /\/\/[^\n]*|;[^\n]*/,
    greedy: true
  },

  // mnemonic: first word of a line (b.ne, fmla, ldp, ...)
  instruction: {
    pattern: /(^[ \t]*)[a-z][a-z0-9]*(?:\.[a-z0-9]+)?(?=[ \t]|$)/m,
    lookbehind: true,
    greedy: true,
    alias: "function"
  },

  // x0-x30, w0-w30, q/d/s/h/b0-31, sp, xzr, wzr, v0-v31 with arrangement/lane (v2.s[0], v15.4s)
  register: {
    pattern: /\b(?:v(?:[12]?\d|3[01])(?:\.\d*[bhsd](?:\[\d+\])?)?|[xwqdshb](?:[12]?\d|3[01])|sp|xzr|wzr)(?!\w)/,
    alias: "variable"
  },

  number: /#-?(?:0x[\da-f]+|\d+)\b/i,

  punctuation: /[,\[\]{}!]/
};
