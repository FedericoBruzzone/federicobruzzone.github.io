#import "cv.template.typ": cv, entry, papers
#import "students.typ": students

#show: body => cv(
  name: "Federico Cristiano Bruzzone",
  about: [PhD Student in Computer Science at ADAPT Lab #box(image("figs/logo-lab.svg", height: 1em)) (Università degli Studi di Milano), under the supervision of Prof. W. Cazzola. Programming Languages and Compilers enthusiast. Also, a Sound Engineer and Music Composer.],
  site_link: "https://federicobruzzone.github.io",
  site_name: "federicobruzzone.github.io",

  personal_info: (
    birth_place: "Magenta (MI), Italy",
    date_of_birth: [7th of *March 2000*],
    residence: "Via F. Turati 75/F, Arluno (MI), 20004",
    emails: ("mailto:federico.bruzzone@unimi.it",
             "mailto:federico.bruzzone.i@gmail.com"),
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

= Education
== Academic Titles
#entry(
  when: "2024-Present",
  what: "PhD Student in Computer Science",
  details: (
    [Since 2024, I have been a PhD student in Computer Science at the *ADAPT Lab* of the Università degli Studi di Milano, under the supervision of *Walter Cazzola*.],
    [My research interests include, but are not limited to, programming languages, compilers, software and language product lines and software maintenance.]
  )
)

#entry(
  when: "2022-2024 \n (15/07/2024)",
  what: "MSc in Computer Science",
  details: (
    [At *Università degli Studi di Milano* defending the thesis:],
    ["_Toward a Modular Approach for Type Systems and LSP Generation_"],
    [with final grade *110/110 cum laude*.],
    [Supervisor: *Walter Cazzola*, Università degli Studi di Milano],
    [Co-supervisor: *Luca Favalli*, Università degli Studi di Milano]
  )
)
#entry(
  when: "2019-2022 \n (13/10/2022)",
  what: "BSc in Musical Computer Science",
  details: (
    [At *Università degli Studi di Milano* defending the thesis:],
    ["_Intellectual Property and Digital Rights Management on Blockchain for the IEEE 1599 Standard_".],
    [Supervisor: *Andrea Visconti*, Università degli Studi di Milano],
    [Co-supervisor: *Luca Andrea Ludovico*, Università degli Studi di Milano]
  )
)
#entry(
  when: "2011-2019",
  what: "Conservatory of Music",
  details: (
       [From l'*I.S.S.M. Novara Conservatory "Guido Cantelli"* department of *Pianoforte and Music Composition*.]
  )
)
#entry(
  when: "2014-2019",
  what: "High School Diploma in Computer Science and Telecommunications",
  details: (
       [From l'*I.T.I.S. - Liceo Scientifico Scienze Applicate "E. Alessandrini"*]
  )
)

= Research Activities
== Reviews
I have reviewed papers for the following conferences and journals:
#entry(
  when: "2025",
  what: "Journal of Systems and Software",
  details: (
    [Publisher: *Elsevier*],
  )
)
== Volunteering
#entry(
  when: "2-7 Sep 2024",
  what: "ICFP 2024",
  details: (
    [The 29th ACM SIGPLAN International Conference on Functional Programming has been in Milan, Italy, in September 2024. After a selection process, I was chosen as a student volunteer.
     I helped the organization of the conference and the attendees during the event.]
  )
)
== Internships
#entry(
  when: "2022-2024",
  what: "Scientific Research at ADAPT Lab",
  details: (
    [Since 2022, at the *ADAPT Lab* of the Università degli Studi di Milano, I have been working on the development of a modular approach for type systems and LSP generation for the research project *Neverlang* (originally conceived by *Walter Cazzola*).
    During this period, I studied the compiler construction, programming languages design, software and language product lines and software maintenance.]
  )
)
#entry(
  when: "2021-2022",
  what: "Scientific Research at LIM Lab",
  details: (
    [From 2021 to 2022, at the *LIM Lab* of the Università degli Studi di Milano, I worked on the development of solutions for the integration of blockchain technology in the music industry, focusing on intellectual property and digital rights management for the *IEEE 1599* standard.]
  )
)

= Scientific Publications
== Articles in International Journals with Peer Review
#text(red)[This paper has been submitted to the special issue _Trends in Systems and Software Product Line Engineering_] \
#papers(
  papers: (
    (label: "TmpBruzzone2024", score: [*Journal Ranked Q1 on Scimago* - #link("https://www.scimagojr.com/journalsearch.php?q=19309&tip=sid&clean=0")[scimagojr.com/journal-of-systems-and-software]]),
  )
)

= Teaching Activities
== Thesis Supervision as Co-Advisor
#students // It is a function that generates the list of students
== Graduate Courses
#entry(
  when: "2025-2026",
  what: "Mathematical Logic (Art. 45)",
  details: (
    [I assisted the Professor *Stefano Aguzzoli* in the exams of "Mathematical Logic" for the Bachelor's Degree in Computer Science, Università degli Studi di Milano.]
  )
)
#entry(
  when: "2024-2025",
  what: "Mathematical Logic",
  details: (
    [I assisted the Professor *Stefano Aguzzoli* in the exams of "Mathematical Logic" for the Bachelor's Degree in Computer Science, Università degli Studi di Milano.]
  )
)
#entry(
  when: "2023-2024",
  what: "General Computer Science",
  details: (
    [I assisted the Professor *Alberto Davide Adolfo Momigliano * in the exams of "General Computer Science" for the Bachelor's Degree in Communication and Society, Università degli Studi di Milano.]

  )
)
#entry(
  when: "2023-2024",
  what: "Computer Science 1",
  details: (
    [I assisted the Professor *Andrea Trentini* in the course "Computer Science 1" for the Bachelor's Degree in Computer Science, Università degli Studi di Milano.]
  )
)
#entry(
  when: "2023-2024",
  what: "Programming in Python",
  details: (
    [I assisted the Professor *Mattia Monga* in the course "Programming in Python" for the Master's Degree in Chemistry, Università degli Studi di Milano.]
  )
)

== Additional Activities

#entry(
  when: "2023-Present",
  what: "Private Tutoring",
  details: (
    [Since 2023, I have been tutoring university students in Computer Science and high school students in Mathematics, Physics, and Computer Science.]
  )
)
#entry(
  when: "Nov 2024",
  what: "Bebras Challenge",
  details: (
    [In collaboration with ALaDDIn Lab of the Università degli Studi di Milano, I helped manage the Bebras Challenge, an international informatics competition for students.]
  )
)
#entry(
  when: "Jan-Jun 2024",
  what: "Computer Science Laboratories",
  details: (
    [In collaboration with ALaDDIn Lab and the Professor *Violetta Lonati* of the Università degli Studi di Milano, I have been responsible for the organization and management of the Computer Science Laboratories for the Bachelor's Degree in Computer Science.]
  )
)
#entry(
  when: "Jan-Jun 2024",
  what: "Workshops for schools",
  details: (
    [In collaboration with ALaDDIn Lab and the Professors *Violetta Lonati* and *Anna Morpurgo* of the Università degli Studi di Milano, I helped manage workshops for high school students on the topics of Computer Science.]
  )
)
#entry(
  when: "Nov 2023",
  what: "Bebras Challenge",
  details: (
    [In collaboration with ALaDDIn Lab of the Università degli Studi di Milano, I helped manage the Bebras Challenge, an international informatics competition for students.]
  )
)

= Dissemination Activities
#entry(
  when: "2024-Present",
  what: "Co-organizer of the MUSEMI",
  details: (
    [*Session Chair*, *Speaker* and *Co-organizer* of MUSEMI (Meet Us for SEminars \@uniMI).
MUSEMI is a series of seminars organized by and for PhD students and research fellows to *disseminate their scientific research* and *foster collaboration among different research groups* within the Department of Computer Science. Additionally, MUSEMI encourages the participation of Master's students interested in pursuing an academic career.]
  )
)

= Grants and Fellowships
#entry(
  when: "2024",
  what: "56th Top Github Contributor in Italy out of 958",
  details: (
    [I was awarded the 56th Top Github Contributor in Italy out of 958 according to this #link("https://github.com/gayanvoice/top-github-users/blob/main/markdown/public_contributions/italy.md")[classification].]
  )
)
#entry(
  when: "2023-2024",
  what: "Scholarship for the Master's Degree in Computer Science",
  details: (
    [I was awarded a scholarship for the Master's Degree in Computer Science at the Università degli Studi di Milano.]
  )
)
#entry(
  when: "2020-2024",
  what: "Exemption from university fees",
  details: (
    [I was awarded an exemption from university fees for the Bachelor's Degree in Musical Computer Science at the Università degli Studi di Milano.]
  )
)

= Other Activities
== Artistic Activities
#entry(
  when: "2021-Present",
  what: "Sound Engineer and Producer",
  details: (
    [Since 2021, I have been working as a sound engineer and producer, collaborating with various artists in the recording, mixing, and mastering of their music, realizing 100k+ streams on Spotify for some of them.],
    [I am a #link("https://www.siae.it/it/")[SIAE] member and #link("https://www.believe.com/italia")[Believe] distributed my music in all the main digital stores.]
  )
)
#entry(
  when: "2006-Present",
  what: "Pianist and Music Composer",
  details: (
    [Since 2006, I have been studying piano and music composition.],
    [I have composed music for various ensembles and soloists, and I have performed in various concerts and recitals.],
    [I have also participated in various national and international competitions, winning some of them.]
  )
)
#entry(
  when: "2019-Present",
  what: "Piano and Music Teacher",
  details: (
    [Since 2019, I have been teaching piano and music theory and composition to students of all ages and levels.],
    [I have also prepared students for various music exams and competitions.]
  )
)

== Sport Activities
#entry(
  when: "2012-2019",
  what: "Football",
  details: (
    [
        I practiced agonistic football for 7 years, playing in various regional championships.
        I played for most of the time for the #link("https://www.bustesecalcio.it/")[Bustese Calcio] team.
    ]
  )
)
#entry(
  when: "2004-2012",
  what: "Swimming",
  details: (
    [I practiced swimming for 8 years, participating in various regional competitions.],
  )
)

= Tongues
#entry(
    when: "Italian",
    details: ("Mother tongue")
)
#entry(
    when: "English",
    details: ("Level CEFR B2 (SLAM at Università degli Studi di Milano)")
)
#entry(
    when: "Spanish",
    details: ("Base (A1-A2)")
)

#v(50pt, weak: true)
Milan, #datetime.today().display("[day]/[month]/[year]")
