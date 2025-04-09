#import "cv.template.typ": entry

#let student-list = (
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 10,
    ),
    name: "Dario Pellegrino",
    title: [Scalable Multi-client Real-time Whisper],
    where : "Bachelor in Computer Science, Università degli Studi di Milano",
    score: ""
  ),
  (
    when: datetime(
      year: 2025,
      month: 4,
      day: 9,
    ),
    name: "Gabriele Esposito",
    title: [Fr3D: A Framework for DAP-compatible DSL-oriented Debugging],
    where : "Master in Computer Science, Università degli Studi di Milano",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2025,
      month: 2,
      day: 24,
    ),
    name: "Luca Favini",
    title: [RustyEx: Intrumenting `rustc` to Extract Feature Dependency Graphs],
    where : "Bachelor in Computer Science, Università degli Studi di Milano",
    score: 102
  ),
)

#let students = {
  for(student) in student-list {
    entry(
      when: student.when.display("[day]/[month]/[year]"),
      what: student.name,
      details: (
        [*#student.title*],
        student.where,
        if "score" in student {
          [Score: *#student.score*]
        } else {
          []
        },
      )
    )
  }
}
