---

author: Federico Bruzzone
title: Builder pattern pattern - Object Creational
date: 2023-01-13
draft: false
description: " " 
;description: "Separate the construction of a complex object from its representation so that the same construction process can create different representation."
;cover: "/Builder pattern pattern - Object Creational//cover.png"
tags: [programming, design-patterns, computer-science, object-oriented, clean-code]
categories: [programming, design-pattern]
math: true

---

<!-- # Builder pattern pattern - Object Creational -->

<!-- ## A summary of GoF Design Patters -->

![Cover](/design-pattern/Builder%20pattern%20-%20Object%20Creational/img/cover.png)

By **Dmitry Zhart** ([refactoring.guru](https://refactoring.guru/))

---

# Intent

Separate the construction of a complex object from its representation so that the same construction process can create different representation.

# Also Known As

...

# Motivation

![1](/design-pattern/Builder%20pattern%20-%20Object%20Creational/img/1.png)

A reader for the RTF (Rich Text Format) document exchange format should be able to convert RTF to many text formats. The problem is the number of possible conversions is open-ended.

A solution is to configure the RTFReader class with TextConverter object that converts RTF to another textual representation. As the RTFReader perses the RTF document, it uses the TextConverter to perform the conversion. Whenever the RTFReader recognizes an RTF token, it issues a request to the TextConverter to convert the token.

Subclasses of TextConverter specialize in different conversions and formats. For example, ASCIIConverter ignores requests to convert anything except plain text.

Each kind of converter class takes the mechanism for creating and assembling a complex object and puts it behind an abstract interface. The converter is separate from the reader.

The Builder pattern captures all these relationships. Each converter is called a **builder** in the pattern, and the reader is called the **director**. The Builder pattern separates the algorithm for interpreting a textual format from how a converted format gets created and represented.
:w

# Applicability 

Use the Builder pattern when

- the algorithm for creating a complex object should be independent of the parts that make up the object and how they are assembled.

- the construction process must allow different representations for the object that is constructed.

# Structure

![2](/design-pattern/Builder%20pattern%20-%20Object%20Creational/img/2.png)

# Participants

## Builder

*(TextConverter)*

- specifies an abstract interface for creating parts of a Product object.

## ConcreteBuilder

*(ASCIIConverter, TeXConverter, TextWidgetConverter)*

- constructs and assembles parts of the product by implementing the Builder interface.

- defines and keeps track of the representation it creates.

- provides an interface for retrieving the product.

## Director

*(RTFReader)*

- constructs an object using the Builder interface.

## Product

*(ASCIIText, TeXText, TextWidget)*

- represents the complex object under construction. ConcreteBuilder builds the product's internal representation and defines the process by which it is assembled.

- includes classes that define the constituent parts, including interface for assembling the parts into the final result.

# Collaborations

- The client creates the Director object and configures it with the desired Builder object.

- Director norifies the builder whenever a part of the product should be built.

- Builder handles requests from the director and adds parts to the product.

- The client retrieves the product from the builder.

![3](/design-pattern/Builder%20pattern%20-%20Object%20Creational/img/3.png)

# Consequences

Here are key consequences of the Builder pattern:

1. *It lets you vary a product's internal representation.* The Builder object provides the director with an abstract interface for constructing the product. The interface lets the builder hide the representation and internal structure of the product.

2. *It isolates code for construction and representation.* The Builder pattern improves modularity by encapsulating the way a complex object is constructed and represented. Clients needn't know anything about the classes that define the product's internal structure.

3. *It gives you finer control over the construction process.* Unlike creational patterns that constructed products in one shot, the Builder pattern constructs the product step by step under the director's control.

# Implementation

Typically there is an abstract Builder class that defines an operation for each component that a directory may ask it to create.

Here are other implementation issues to consider:

1. *Assemply and construction interface.* Builders construct their products in step-by-step fashion. A key design issue concerns the model for the construction and assembly process. A model where the results of construction requests are simply appended to the product is usually sufficient. But sometimes you might need access to part of the product constructed earlier.

2. *Why no abstract class for products?* In common case, the product produced by the concrete builders differ so greatly in their representation that there is little to gain form giving different products a common parent class.

3. *Empty methods as default in Builder.* They are defined as empty methods instead, letting clients override only the operation they are interested in.

# Sample Code

To better understand the following code and the classes used look 

[here🔗!](https://github.com/FedericoBruzzone/federicobruzzone.github.io/tree/main/static/design-pattern/commoncode)

We will define a variant of the [*CreateMaze*](https://github.com/FedericoBruzzone/federicobruzzone.github.io/tree/main/static/design-pattern/commoncode) member function that takes a builder of class *MazeBuilder* as an argument.

The *MazeBuilder* class defines the following interface for building mazes:

```Java
public class MazeBuilder {
    
  protected MazeBuilder() {}
    
  public void BuildMaze() {}

  public void BuildRoom(int room) {}

  public void BuildDoor(int roomFrom, int roomTo) {}
 
  public Maze GetMaze() { return null; }

}
```

This interface can create three thing: (1) the maze, (2) rooms with a particular room number and (3) doors between numbered rooms. The *GetMaze* operation returns the maze to the client. 

All the maze-building operations of *MazeBuilder* do nothing by default.

Given the *MazeBuilder* interface, we can change the *CreateMaze* member function to take this builder as a parameter.

```Java
public class MazeGame_Builder {
    
  public Maze CreateMaze(MazeBuilder builder) {
    builder.BuildMaze();
    
    builder.BuildRoom(1);
    builder.BuildRoom(2);
    builder.BuildDoor(1, 2);
    
    return builder.GetMaze();
  }

}
```

Compare this version of *CreateMaze* with the [original](https://github.com/FedericoBruzzone/federicobruzzone.github.io/blob/main/static/design-pattern/commoncode/MazeGame_First.java). Notice how the builder hides the internal representation of the Maze. This make it easier to change the way a maze is represented, since none of the clients of *MazeBuilder* has to be changed.

Like the other creational patterns, the Builder pattern encapsulates how objects get created. That means we can reuse *MazeBuilder* to build different kind of mazes.

Note that *MazeBuilder* does not create mazes itself; it main purpose is just to define an interface for creating mazes. It defines empty implementations primarily for convenience. Subclasses of *MazeBuilder* so the actual work.

The subclass *StandardMazeBuilder* is an implementation that builds simple mazes.

```Java
public class StandardMazeBuilder extends MazeBuilder {
    
  private Maze _currentMaze;

  public StandardMazeBuilder() {
    this._currentMaze = null;
  }

  @Override public void BuildMaze() {
    this._currentMaze = new Maze();
  }

  @Override public void BuildRoom(int n) {
    if (_currentMaze.RoomNo(n) != null) {
      Room room = new Room(n);
      this._currentMaze.AddRoom(room);

      room.SetSide(Direction.North, new Wall());
      room.SetSide(Direction.South, new Wall());
      room.SetSide(Direction.East,  new Wall());
      room.SetSide(Direction.West,  new Wall());
    }
  }

  @Override public void BuildDoor(int n1, int n2) {
    Room r1 = this._currentMaze.RoomNo(n1);
    Room r2 = this._currentMaze.RoomNo(n2);
    Door d = new Door(r1, r2);

    r1.SetSide(this.CommonWall(r1, r2), d);
    r2.SetSide(this.CommonWall(r2, r1), d);
  }

  private Direction CommonWall(Room r1, Room r2) { 
    return null;
  }

  @Override public Maze GetMaze() {
    return this._currentMaze;
  }

}
```

*CommonWall* is a utility operation that determines the direction of the common wall between two rooms.

Clients can now use *CreateMaze* in conjunction with *StandardMazeBuilder* to create a maze:

```Java
public class ClientBuilder {
  
  public static void main(String[] args) {
    Maze maze;
    MazeGame_Builder game = new MazeGame_Builder();
    StandardMazeBuilder builder = new StandardMazeBuilder();

    game.CreateMaze(builder);
    maze = builder.GetMaze();
  }

}
```

We could have put all the *StandardMazeBuilder* operations in *Maze* and let each *Maze* build itself. But making *Maze* smaller makes it easier to understand and modify, and *StandardMazeBuilder* is easy to separate from *Maze*.

# Known Uses

The RTF converter application is from ET++ [WGM88]. Its text building block uses a builder to process text sorted in the RTF format.

Builder is a common pattern in Smalltalk-80 [Par90]:

- The Parser class in the compiler subsystem is a Director that takes a ProgramNodeBuilder object as an argument.

- ClassBuilder is a builder that Classes use to create subclasses for themselves.

- ByteCodeStream is a builder that creates a compiled method as a byte array.

The Service Configurator framework from the Adaptive Communications Environment uses a builder to construct network service components that are linked into a server at run-time [SS94].

# Related Patterns

Abstract Factory is similar to Builder in that it too may construct complex object. The primary difference is that the Builder pattern focuses on constructing a complex object step by step. Abstract Factory's emphasis is on families of product objects. Builder returns the product as a final step, but as far as Abstract Factory pattern is concerned, the product gets returned immediately.

A Composite is what the builder often builds.
