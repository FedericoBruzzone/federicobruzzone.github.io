#import "cv.template.typ": entry

#let student-list = (
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
        // [Score: *#student.score*]
      )
    )
  }
}