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
    pattern: /\b(func|arith|memref|tensor|util|vector|scf|linalg|llvm|affine|arm_sme|hal|builtin|flow|stream|iree_encoding)(?![\w.])/,
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
    pattern: /\b(arith|vector|func|memref|tensor|util|scf|linalg|llvm|affine|arm_sme|hal|builtin|flow|stream|iree_encoding)(?=\.)/,
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