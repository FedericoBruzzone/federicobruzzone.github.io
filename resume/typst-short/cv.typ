#import "cv.template.typ": cv, entry, papers
#import "students.typ": students

#show: body => cv(
  name: "Federico Bruzzone",
  about: [
    #text(10pt,
    block(inset: (right: 2.5cm, left: 2.5cm))[#rect[
      PhD Candidate in Computer Science. 
      Programming Languages and Compilers enthusiast. Also, a Sound Engineer and Music Composer.
      My personal website is available at #link("https://federicobruzzone.github.io")[this link].
    ]])
  ],
  site_link: "https://federicobruzzone.github.io",
  site_name: "federicobruzzone.github.io",
  personal_info: (
    birth_place: "Magenta (MI), Italy",
    date_of_birth: [7th of *March 2000*],
    residence: "Via F. Turati 75/F, Arluno (MI), 20004",
    emails: ("mailto:federico.bruzzone.i@gmail.com", "mailto:federico.bruzzone@unimi.it"),
    phone: [+39 *391 7369214*]
  ),
  contact_info: (
    github_link: "https://github.com/FedericoBruzzone",
    github_name: "github.com/FedericoBruzzone",
    telegram_link: "https://t.me/federicobruzzone",
    telegram_name: "@federicobruzzone",
    linkedin_link: "https://www.linkedin.com/in/federico-bruzzone/",
    linkedin_name: "in/federico-bruzzone",
    twitter_link: "https://x.com/fedebruzzone7",
    twitter_name: "@fedebruzzone7",
    reddit_link: "https://www.reddit.com/user/FedericoBruzzone",
    reddit_name: "u/FedericoBruzzone"
  ),
  bib : ("publications.bib"),
  textfill: black,//gradient.linear(..color.map.crest.slice(130,), relative:"parent"),
  linkfill: gradient.linear(..color.map.mako.slice(75, 100), relative:"parent"),
  body,
)
// textfill: gradient.linear(..color.map.flare.slice(129,256), relative:"parent"),
// Red based: linkfill: gradient.linear(..(color.map.rocket.slice(108,148).rev(), color.map.rocket.slice(108,148)).flatten(), relative:"parent"),
// GreenBlue based: textfill: gradient.linear(..(color.map.mako.slice(50,100).rev(), color.map.mako.slice(50,100)).flatten(), relative:"parent"),
// Purple based: linkfill: gradient.linear(..color.map.flare.slice(150,256), relative:"parent"),

= Technical Skills
#entry(
  when: [Languages],
  what: (
    [*Rust*, *Python*, *C/C++*, *Go*, OCaml, Java,  Scala, Kotlin, Erlang, Lua, Dart, PHP, HTML/CSS, SQL, Bash, TeX
    ]
  ),
  details: ()
)
#entry(
  when: [Systems/Tooling],
  what: [*Git*, *CI/CD*, *Docker*, *GDB*, *Valgrind*, Build Systems (e.g., CMake, Cargo, Pip), Cross-language *Linking*, Static/Dynamic Libraries, and *FFI* (e.g., C bindgen)],
  details: ()
)
#entry(
  when: [Area of Expertise],
  what: [*Compiler Construction* and *Optimizations*, Programming Languages, *IR Design* and *Implementation*, Type Systems, Language Support Tools (e.g., LSP), Static Analysis, Parsing Techniques and Parser Generators (e.g., ANTLR), *Rustc* Internals, *LLVM*],
  details: ()
)

= Public Contributions (Selected)

#entry(
  when: "2024-Present",
  what: [Contributions to the *Rust* compiler, focusing on type systems, diagnostics, and layout computations --- by fixing some Internal Compiler Errors (ICEs) and implementing new features],
  details: (
    [
      - #link("https://github.com/rust-lang/rust/pull/135158")[Add `TooGeneric` variant to `LayoutError` and emit `Unknown`] (closed but #link("https://github.com/tautschnig/verify-rust-std/commit/ace9ceaeede0f8f832dc1f32e2a83f591d33e395")[merged])
      - #link("https://github.com/rust-lang/rust/pull/136430")[Use the type-level constant value ty::Value where needed]
      - #link("https://github.com/rust-lang/rust/pull/130123")[Report the note when specified in `diagnostic::on_unimplemented`]
      #v(-5pt, weak: true)
    ]
  )
)

#entry(
  when: "2025-Present",
  what: [*Maintainer* of the #link("https://github.com/tide-fwk/tide")[Tide Compiler], an agnostic IR and compiler framework written in *Rust*],
  details: (
    [
      *Tide* aims to be a modular and extensible framework for building compilers and language tools, prioritizing simplicity and ease of use. *Region-based memory management* provides a middle ground between manual memory management and automatic garbage collection, enabling efficient memory usage without the overhead of tracing GC. Research is ongoing on how to preserve separate compilation without compromising modularity or performance.
    ]
  )
)

#entry(
  when: "2025-Present",
  what: [Contributions to the *Rustworkx* graph library, focusing on implementing the Closeness Centrality algorithm for weighted graphs (following Newman's method) and integrating it into the Python bindings],
  details: (
    [
      - #link("https://github.com/Qiskit/rustworkx/pull/1385")[Generalizing Closeness centrality to weighted networks using Newman method] (issue #link("https://github.com/Qiskit/rustworkx/issues/1384")[#1384])
      #v(-5pt, weak: true)
    ]
  )
)

#entry(
  when: "2024-Present",
  what: [*Maintainer* of the cross-platform #link("https://github.com/FedericoBruzzone/tgt")[tgt] project and #link("https://github.com/FedericoBruzzone/tdlib-rs")[tdlib-rs] TDLib bindings written in *Rust*],
  details: (
    [
      #link("https://crates.io/crates/tgt")[Tgt] is a TUI (Terminal User Interface) client for Telegram, built using the  #link("https://crates.io/crates/tdlib-rs")[tdlib-rs] library, which provides safe and idiomatic Rust bindings to the official TDLib (Telegram Database Library) C++ library. Thanks to CI/CD pipelines, we ensure (i) that the projects build and work correctly on Linux, macOS, and Windows, (ii) automatic releases on GitHub and crates.io, and (iii) automatic documentation generation.
    ]
  )
)

= Education
#entry(
  when: "2024-Present",
  what: [*PhD Candidate* in Computer Science at the ADAPT Lab, University of Milan],
  details: (
    [Under the supervision of _W. Cazzola_, my research focuses *compiler*\/*IR* *construction* and *programming languages*, *analysis* and *transformation* of *optimizing compilers* as well as *type systems* and *support tools* (e.g., LSP).]
  )
)

#entry(
  when: "2022-2024",
  what: [MSc in Computer Science at University of Milan (_110/110 cum laude_, _W. Cazzola_, 15/07/2024)],
  details: (
    [Thesis: "*Toward a Modular Approach for Type Systems and LSP Generation*" .],
  )
)
#entry(
  when: "2019-2022",
  what: [BSc in Musical Computer Science at University of Milan (13/10/2022)],
  details: ()
)
#entry(
  when: "2011-2019",
  what: "Piano and Music Composition at I.S.S.M. Novara Conservatory",
  details: ()
)
#entry(
  when: "2014-2019",
  what: "Diploma in Computer Science and Telecommunications at E. Alessandrini",
  details: ()
)

= Scientific Publications

#papers(
  papers: (
    (label: "Bruzzone25", links: [
      // [<a href="/publications/jss25/Bruzzone25.bib">bib</a>]
      // [<a href="/publications/jss25/Bruzzone25.pdf">pdf</a>]
      // [<a href="https://doi.org/10.1016/j.jss.2025.112554">SpringerLink</a>]
      // [<a href="https://arxiv.org/abs/2509.15150">arXiv</a>]
      [#link("https://federicobruzzone.github.io/publications/jss25/Bruzzone25.bib")[bib]]
      [#link("https://federicobruzzone.github.io/publications/jss25/Bruzzone25.pdf")[pdf]]
      [#link("https://doi.org/10.1016/j.jss.2025.112554")[SpringerLink]]
      [#link("https://arxiv.org/abs/2509.15150")[arXiv]]
    ], score: [*Journal Ranked Q1 on Scimago*]),
  )
)

#text(red)[The following publications are in the review process and may not be available yet.]

#papers(
  papers: (
    (label: "TmpBruzzone2", score: [*Conference Ranked A\* on CORE*]),
    (label: "TmpBruzzone3", score: [*Conference Ranked A\* on CORE*]),
  )
)

= Research Activities

#entry(
  when: "2025-Present",
  what: [*Reviewer* for the #link("https://www.sciencedirect.com/journal/journal-of-systems-and-software")[Journal of Software and Systems Modeling], _Springer_, *Q1 on Scimago*],
  details: (
    // [Issue: Trends in Systems and Software Product Line Engineering],
  )
)
#entry(
  when: "2025-Present",
  what: [*Reviewer* for the #link("https://www.sciencedirect.com/journal/journal-of-systems-and-software")[Journal of Systems and Software], _Elsevier_, *Q1 on Scimago*],
  details: (
    // [Issue: Trends in Systems and Software Product Line Engineering],
  )
)

#entry(
  when: "2024-Present",
  what: [*Session Chair*, *Speaker* and *Co-organizer* of the MUSEMI],
  details: ()
)


#entry(
  when: "2-6 Jun 2025",
  what: [*Participant* at #link("https://2025.programming-conference.org/")[\<Programming\> 2025] conference],
  details: ()
)

#entry(
  when: "Apr-Jun 2025",
  what: [*#link("https://conf.researchr.org/profile/federicobruzzone")[Committee Member]* at the Int. Conf. on Software Language Engineering (#link("https://conf.researchr.org/home/sle-2025")[SLE 2025])],
  details: ()
)

#entry(
  when: "2-7 Sep 2024",
  what: [*#link("https://conf.researchr.org/profile/federicobruzzone")[Student Volunteer]* at the Int. Conf. on Functional Programming (#link("https://conf.researchr.org/home/icfp-2024")[ICFP 2024])],
  details: ()
)

#entry(
  when: "2022-2024",
  what: [Research *Internship* at ADAPT Lab, working on modular type systems and LSP generation for Neverlang],
  details: (
  )
)
#entry(
  when: "2021-2022",
  what: [Research *Internship* at LIM Lab, working on the IEEE 1599 standard],
  details: (
  )
)

= Grants and Fellowships
#entry(
  when: "2024",
  what: [#link("https://github.com/gayanvoice/top-github-users/blob/eb0e7d8c60de27a55a7d02c56703d6b8d16c8259/markdown/public_contributions/italy.md")[56th Top Github Public Contributor] in Italy out of 958],
  details: ()
)
#entry(
  when: "2023-2024",
  what: "Scholarship for the MSc in Computer Science, awarded by the University of Milan",
  details: ()
)
#entry(
  when: "2020-2024",
  what: "Scholarship for the BSc in Musical Computer Science, awarded by the University of Milan",
  details: ()
)



= Teaching Activities
== Thesis Supervision
#students // It is a function that generates the list of students
== Graduate Courses
#entry(
  when: "2025-2026",
  what: [Mathematical Logic (Art. 45), *BSc* in CS, University of Milan, _S. Aguzzoli_],
  details: ()
)
#entry(
  when: "2024-2025",
  what: [Mathematical Logic, *BSc* in CS, University of Milan, _S. Aguzzoli_],
  details: ()
)
#entry(
  when: "2023-2024",
  what: [Computer Science, *BSc* in Comm. and Society, University of Milan, _A. Momigliano_],
  details: ()
)
#entry(
  when: "2023-2024",
  what: [Computer Science 1, *BSc* in CS, University of Milan, _A. Trentini_],
  details: ()
)
#entry(
  when: "2023-2024",
  what: [Programming in Python, *MSc* in Chemistry, University of Milan, _M. Monga_],
  details: ()
)

== Additional Activities

#entry(
  when: "2023-Present",
  what: [*Private Tutoring* in Computer Science, Mathematics and Physics],
  details: ()
)
#entry(
  when: "Nov 2024",
  what: [*Collaborator* at the Bebras Challenge , ALaDDIn Lab],
  details: ()
)
#entry(
  when: "Jan-Jun 2024",
  what: [*Organizer* of the BSc Computer Science Laboratories,  ALaDDIn Lab],
  details: ()
)
#entry(
  when: "Jan-Jun 2024",
  what: [*Collaborator* of the Workshops for schools, ALaDDIn Lab],
  details: ()
)
#entry(
  when: "Nov 2023",
  what: [*Collaborator* at the Bebras Challenge , ALaDDIn Lab],
  details: ()
)

= Musical Activities

#entry(
  when: "2021-Present",
  what: [*Sound Engineer and Music Producer*, in collaboration with #link("https://www.believe.com/italia")[Believe] and as a #link("https://www.siae.it/it/")[SIAE] member.],
  details: ()
)
#entry(
  when: "2006-Present",
  what: [*Pianist and Music Composer*, composing original pieces and arrangements for piano and various ensembles],
  details: ()
)
#entry(
  when: "2019-Present",
  what: [*Piano and Music Teacher*, teaching piano and music theory and composition to students of all ages and levels],
  details: (
  )
)

// == Sport Activities
// #entry(
//   when: "2012-2019",
//   what: [Football, Agonistic Level],
//   details: ()
// )
// #entry(
//   when: "2004-2012",
//   what: [*Swimming*, Agonistic Level],
//   details: ()
// )

= Tongues
#entry(
    when: "Italian",
    details: ("Mother tongue")
)
#entry(
    when: "English",
    details: ("Level CEFR B2 (SLAM at University of Milan)")
)
#entry(
    when: "Spanish",
    details: ("Base (A1-A2)")
)

#v(50pt, weak: true)
Milan, #datetime.today().display("[day]/[month]/[year]")
