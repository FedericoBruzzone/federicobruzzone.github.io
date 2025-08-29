#import "cv.template.typ": entry

#let student-list = (
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 10,
    ),
    name: "D. Pellegrino", // Dario
    title: [Scalable Multi-client Real-time Whisper],
    where : "BSc",
    score: "96"
  ),
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 9,
    ),
    name: "A. Longoni", // Andrea
    title: [GUIDE: Graphical User Interface Development Environment],
    where : "MSc",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 9,
    ),
    name: "L. Albani", // Leonardo 
    title: [New Generalized Protocol For Software Product Line Extraction And Configuration],
    where : "MSc",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 9,
    ),
    name: "G. Esposito", // Gabriele
    title: [Fr3D: A Framework for DAP-compatible DSL-oriented Debugging],
    where : "MSc",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2025,
      month: 2,
      day: 24,
    ),
    name: "L. Favini", // Luca
    title: [RustyEx: Intrumenting `rustc` to Extract Feature Dependency Graphs],
    where : "BSc",
    score: "102"
  ),
)

#let students = {
  for(student) in student-list {
    entry(
      when: student.when.display("[day]/[month]/[year]"),
      what: [#student.name, #emph(student.title), #student.where, *#student.score*],
      details: ()
    )
  }
}
