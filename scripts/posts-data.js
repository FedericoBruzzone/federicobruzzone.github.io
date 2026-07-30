var POSTS_DATA = [
  {
    url: "posts/inside-a-linalg-matmul-a-deep-dive-into-IREEs-compilation-pipeline.html",
    title: "Inside a <code class=\"language-mlir\">linalg.matmul</code>: A Deep Dive into IREE's Compilation Pipeline",
    desc: "TODO",
    date: "TODO",
    dateDisplay: "TODO",
    readTime: "TODO",
    titlePrefix: '<img src="posts/images/IREE.png" alt="IREE logo" width="17px"/> <img src="posts/images/MLIR.png" alt="MLIR logo" width="17px"/> <img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/>',
    series: null,
    showOnIndex:false
  },
  {
    url: "posts/a-multi-dimensional-per-pass-empirical-study-of-the-llvm-optimization-pipeline.html",
    title: "A Multi-Dimensional, Per-Pass Empirical Study of the LLVM Optimization Pipeline",
    desc: "We ran every cumulative prefix of the LLVM -O3 pipeline on 30 PolyBench/C kernels (84,750 measurements). The pipeline is non-monotone, back-loaded, and -O3 is Pareto-dominated in 29/30 benchmarks. A per-pass look at runtime, binary size, hardware counters, and energy.",
    date: "2026-07-01",
    dateDisplay: "1 July, 2026",
    readTime: "~15 min",
    titlePrefix: '<img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/>',
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/the-llvm-essence-of-lowering-mlir-to-aarch64-with-sme-support.html",
    title: "The LLVM Essence of Lowering MLIR to AArch64 with SME Support",
    desc: "A post to manually lowering MLIR code to AArch64 executables with Arm SME support. Covers the complete pipeline from MLIR optimization to native compilation, including lowering to LLVM dialect, LLVM-IR translation, assembly generation, and linking. Includes practical commands and one-shot solutions for execution.",
    date: "2026-06-20",
    dateDisplay: "21 June, 2026",
    readTime: "~12 min",
    titlePrefix: '<img src="posts/images/MLIR.png" alt="MLIR logo" width="17px"/> <img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/>',
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/mlir-study.html",
    title: "MLIR Empirical Study on AArch64 (Apple M4 Pro)",
    desc: "Empirical study of MLIR optimization passes on Apple M4 Pro using native AoT binaries. Five research questions on tiling, lowering paths, loop fusion, cross-kernel behavior, and the gap to Apple Accelerate/AMX. Includes a roofline analysis with IREE.",
    date: "2026-06-02",
    dateDisplay: "2 June, 2026",
    readTime: "~10 min",
    titlePrefix: '<img src="posts/images/MLIR.png" alt="MLIR logo" width="17px"/> <img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/>',
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/scribe.html",
    title: "scribe \u2014 A Minimalist LaTeX Document Class and Beamer Theme",
    desc: "A drop-in replacement for the standard <code>article</code> class with callout boxes, theorem-like environments, named inline comments, compact numeric citations, optional line numbers, and a matching Beamer theme \u2014 all with Libertine and Inconsolata typography.",
    date: "2026-06-01",
    dateDisplay: "1 June, 2026",
    readTime: "~3 min",
    titlePrefix: "",
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/the-site-now-has-an-rss-feed.html",
    title: "The Site Now Has an RSS Feed",
    desc: "The website now has an RSS feed that gathers posts, scientific publications, preprints, and activities into one chronological stream. Subscribe with your favourite reader at /feed.xml.",
    date: "2026-05-31",
    dateDisplay: "31 May, 2026",
    readTime: "~2 min",
    titlePrefix: '<img src="icons/rss.svg" width="16px" height="16px"/>',
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/eter/a-friendly-tour-of-substructural-uniqueness-ownership-and-capabilities-types-and-more.html",
    title: "A Friendly Tour of Substructural, Uniqueness, Ownership, and Capabilities Types \u2014 and more!",
    desc: "The third post of the <i>Eter programming language</i> series. A friendly tour of the type-theoretic landscape behind memory safety. Starting from the logical roots of substructural logic, it walks through linear, affine, and uniqueness types, then visits regions, effects, capabilities, typestate, and the latest work on reachability and separation types.",
    date: "2026-05-22",
    dateDisplay: "22 May, 2026",
    readTime: "~15 min",
    titlePrefix: '<img src="https://raw.githubusercontent.com/eter-lang/eter/main/docsrc/logo/logo.png" alt="The Eter logo" width="17px"/>',
    series: "eter",
    showOnIndex: true
  },
  {
    url: "posts/eter/MVS-or-ownership&borrowing.html",
    title: "Mutable Value Semantics (MVS) or Ownership &amp; Borrowing: A Trade-off Analysis",
    desc: "The second post of the <i>Eter programming language</i> series. It explores the trade-offs between Mutable Value Semantics and Ownership &amp; Borrowing, examining friction points in Rust, Hylo, and Swift while searching for common ground between the two memory models.",
    date: "2026-05-03",
    dateDisplay: "3 May, 2026",
    readTime: "~15 min",
    titlePrefix: '<img src="https://raw.githubusercontent.com/eter-lang/eter/main/docsrc/logo/logo.png" alt="The Eter logo" width="17px"/>',
    series: "eter",
    showOnIndex: true
  },
  {
    url: "posts/eter/MVS.html",
    title: "The Mutable Value Semantics (MVS): A Non-superficial Study",
    desc: "The first post of the <i>Eter programming language</i> series. While this post is part of the series, it is not a part of the Eter language itself. The post is a non-superficial study on the MVS, trying to understand its limitations.",
    date: "2026-04-27",
    dateDisplay: "27 April, 2026",
    readTime: "~10 min",
    titlePrefix: '<img src="https://raw.githubusercontent.com/eter-lang/eter/main/docsrc/logo/logo.png" alt="The Eter logo" width="17px"/>',
    series: "eter",
    showOnIndex: true
  },
  {
    url: "posts/eter/regime-based-capability-semantics.html",
    title: "[TODO] Regime-Based Capability Semantics (RCS)",
    desc: "TODO",
    date: "2026-05-22",
    dateDisplay: "22 May, 2026",
    readTime: "~15 min",
    titlePrefix: '<img src="https://raw.githubusercontent.com/eter-lang/eter/main/docsrc/logo/logo.png" alt="The Eter logo" width="17px"/>',
    series: "eter",
    showOnIndex: false
  },
  {
    url: "posts/consume-the-input-only-when-somet-is-returned.html",
    title: "Consume the Input Only When Some&lt;T&gt; is Returned",
    desc: "A discussion on idiomatic Rust patterns for consuming input only when a function successfully returns a value. This explores ownership semantics and how to write clean, expressive APIs in Rust.",
    date: "2025-04-19",
    dateDisplay: "19 April, 2025",
    readTime: "",
    titlePrefix: "",
    series: null,
    showOnIndex: true
  },
  {
    url: "posts/open-source-licenses-a-deep-dive-into-their-meaning.html",
    title: "Open Source Licenses: A Deep Dive into Their Meaning",
    desc: "An in-depth exploration of open source licenses, covering their legal implications, the differences between permissive and copyleft licenses, and practical guidance for choosing the right license for your project.",
    date: "2025-03-23",
    dateDisplay: "23 March, 2025",
    readTime: "",
    titlePrefix: "",
    series: null,
    showOnIndex: true,
    pinned: true
  },
  {
    url: "posts/exploiting-finite-state-automata-for-efficient-lexical-analysis-a-rust-implementation.html",
    title: "Exploiting Finite State Automata for Efficient Lexical Analysis: A Rust Implementation",
    desc: "A practical exploration of building a lexical analyzer in Rust using finite state automata. We cover DFA/NFA theory and show how to implement an efficient lexer from scratch.",
    date: "2024-08-09",
    dateDisplay: "9 August, 2024",
    readTime: "",
    titlePrefix: "",
    series: null,
    showOnIndex: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = POSTS_DATA;
}
