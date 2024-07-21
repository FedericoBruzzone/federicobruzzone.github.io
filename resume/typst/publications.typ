#import "cv.template.typ": cv, entry, papers
#import "students.typ": students
#import "peculiar.typ": splps


#show bibliography: none
#bibliography("publications.bib")
  
= Luca Favalli
== Elenco Pubblicazioni Scientifiche
#v(30pt, weak:true)

#papers(
  papers: (
    (label: "Favalli2020"),
    (label: "Cazzola2022b"),
    (label: "Bertolotti2022b"),
    (label: "Cazzola2023"),
    (label: "Cazzola2023b"),
    (label: "Bertolotti2023"),
  )
)

#cite(<Bertolotti2023b>) #splps(1, "")

#papers(
  papers: (
    (label: "Broccia2023"),
    (label: "Cazzola2023c"),
    (label: "Bertolotti2024"),
    (label: "Favalli2023"),
  )
)

#v(30pt, weak: true)
Milano, #datetime.today().display("[day]/[month]/[year]")