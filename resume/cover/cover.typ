#set page(
  paper: "us-letter",
  margin: 2cm
)

#let name = "Federico Bruzzone"
#let address = "Via F. Turati 75/F, Arluno, Milan, 20004"
#let phone = "+39 391 736 9214"
#let email = link("federico.bruzzone.i@gmail.com")
#let date = "Agust 29, 2025"

= Cover Letter

#v(1cm)
#rect[
  #text(name)
  
  #text(address)
  
  #text(phone)
  
  #text(email)
  
  #text(date)
]
#v(1cm)
  
I am writing to express my interest in the Principal Software Engineer position within the Languages, Runtimes, and Compilers Group at Microsoft. I hold a PhD in Computer Science with a focus on programming languages and compilers, and I have extensive experience in language tooling and open-source projects, which aligns closely with the requirements of this role.

The opportunity to contribute to AI-assisted development and enhance Python development experiences is particularly compelling. I have closely followed the work of the Languages, Runtimes, and Compilers Group, including your work on pylance and debugpy. As a maintainer of the Tide Compiler, an agnostic IR and compiler framework, I have gained in-depth knowledge of compiler construction, type systems, and static analysis—skills directly relevant to improving language services.

My contributions to the Rust compiler, focused on type systems and diagnostics, demonstrate my ability to address complex challenges in language tooling. Additionally, my work on the cross-platform tgt project and the tdlib-rs bindings, including the design of robust CI/CD pipelines, highlights my experience in delivering reliable tools and ensuring cross-platform compatibility.

I am actively involved in open-source communities, including contributions to the rustworkx graph library, and have been recognized as a top public contributor in Italy. My role as a reviewer for a Q1 journal and as a committee member for international conferences reflects my commitment to collaboration and engagement with the broader software engineering community.

I am eager to contribute my expertise in language tooling and compiler technologies to advance the developer tools at Microsoft. Thank you for your time and consideration. I have attached my curriculum vitae and would welcome the opportunity to discuss this position further.

#v(1cm)
Sincerely,

#text(name)

