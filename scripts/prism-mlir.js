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
    pattern: /\b(func|arith|memref|tensor|vector|scf|linalg|llvm|affine)(?!\.)/,
    alias: "keyword"
  },

  // =========================
  // SHAPE SEPARATOR (x in 64x64xf32 or [4]x[4]xf32)
  // =========================
  shape_sep: {
    pattern: /x(?=[\d\[fi])/,
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
    pattern: /\b(memref|tensor|vector|tuple|complex)(?!\.)|[su]?i\d+|f(16|32|64|80|128)|index|none/,
    alias: "class-name"
  },

  // =========================
  // GENERICS (<...>)
  // =========================
  generic: {
    pattern: /<[^>\n]*>/,
    alias: "type"
  },

  // =========================
  // DIALECT PREFIX (arith, vector before the dot)
  // =========================
  dialect_prefix: {
    pattern: /\b(arith|vector|func|memref|tensor|scf|linalg|llvm|affine)(?=\.)/,
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
  // PUNCTUATION
  // =========================
  punctuation: /[{}()[\]<>:=,-]/,

  // =========================
  // KEYWORDS (NO more bare fallback!)
  // =========================
  keyword: /(?<!\.)\b(func|module|return|yield|cf|scf|llvm)\b/
};