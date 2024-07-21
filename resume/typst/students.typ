#import "cv.template.typ": entry

#let student-list = (
  (
    when: datetime(
      year: 2023,
      month: 4,
      day: 21,
    ),
    name: "Matteo Cavada",
    title: "COBOL on the JVM",
    where : "Laurea Magistrale in Informatica, Università degli Studi di Milano",
    score: 108
  ),
  (
    when: datetime(
      year: 2023,
      month: 4,
      day: 21,
    ),
    name: "Gaetano D'Agostino",
    title: "An extensible type system for Language Server Protocol development",
    where : "Laurea Magistrale in Informatica, Università degli Studi di Milano",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2023,
      month: 4,
      day: 21,
    ),
    name: "Gianluca Nitti",
    title: "Static Analysis in the Neverlang Language Workbench",
    where : "Laurea Magistrale in Informatica, Università degli Studi di Milano",
    score: "110L"
  ),
  (
    when: datetime(
      year: 2024,
      month: 2,
      day: 22,
    ),
    name: "Lorenzo Gianoni",
    title: "Incremental COBOL modernization with a Reconfigurable Interpreter",
    where : "Laurea Triennale in Informatica, Università degli Studi di Milano",
    score: 98
  ),
  (
    when: datetime(
      year: 2024,
      month: 4,
      day: 17,
    ),
    name: "Francesca Dasti",
    title: "How to train your Fault Tolerant Parser",
    where : "Laurea Magistrale in Matematica, Università degli Studi di Milano",
    score: 107
  )
)

#let students = {
  for(student) in student-list {
    entry(
      when: student.when.display("[day]/[month]/[year]"),
      what: student.name,
      details: (
        [*#student.title*],
        student.where,
        [Voto: *#student.score*]
      )
    )
  }
}