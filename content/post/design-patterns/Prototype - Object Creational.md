---

author: Federico Bruzzone
title: Prototype - Class Creational
date: 2023-04-16
draft: true
tags: [programming, design-patterns, computer-science, object-oriented, clean-code]
categories: [programming, design-pattern]
summary: "Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype."

mathjax: true

---

<!-- # Prototype - Class Creational -->

<!-- ## A summary of GoF Design Patters -->

![Cover](/design-pattern/Prototype%20-%20Object%20Creational/img/cover.png)

By **Dmitry Zhart** ([refactoring.guru](https://refactoring.guru/))

## Intent

Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.

## Also Known As

...

## Motivation

![1](/design-pattern/Prototype%20-%20Object%20Creational/img/1.png)


You could build an editor for music scores by customizing a general framework for graphical editors and adding new objects that represent notes, rests, and staves. The editor framework may have a palette of tools for adding these music objects to the score.

Let's assume the framework provides an abstract Graphic class for graphical components, like notes and staves. Moreover, it'll provide an abstract Tool class for defining tools like those in the palette. The framework also predefines a Graphic-Tool subclass for tools that create instances of graphical objects and add them to the document.

But GraphicTool presents a problem to the framework designer. The classes for notes and staves are specific to our application, but the GraphicTool class belongs to the framework. GraphicTool doesn't know how to create instances of our music classes to add to the score.

The solution lies in making GraphicTool create a new Graphic by copying or "cloning" an instance of a Graphic subclass. We call this instance a **prototype**. GraphicTool is parameterized by the prototype it should clone and add to the document. 

We can use the Prototype pattern to reduce the number of classes even further. We have separate classes for whole notes and half notes, but that's probably unnecessary. Instead they could be instances of the same class initialized with different bitmaps and durations.

## Applicability

Use the Prototype pattern when a system should be independent of how its
products are created, composed, and represented; *and*

- when the classes to instantiate are specified at run-time, for example, by dynamic loading; *or*

- to avoid building a class hierarchy offactories that parallels the class hierarchy of products; *or*

- when instances of a class can have one of only a few different combinations
of state. It may be more convenient to install a corresponding number of
prototypes and clone them rather than instantiating the class manually, each
time with the appropriate state.

## Structure

![2](/design-pattern/Prototype%20-%20Object%20Creational/img/2.png)

## Collaborations

### Prototype

*(Graphic)*

- declares an interface for cloning itself.

### ConcretePrototype

*(Staff, WholeNote, HalfNote)*

- implements an operation for cloning itself.

### Client

*(GraphicTool)*

- creates a new object by asking a prototype to clone itself.

## Consequences

A client asks a prototype to clone itself.

## Implementation

## Sample Code

## Known Uses

## Related Patterns
