---

author: Federico Bruzzone
title: Factory Method pattern - Class Creational
date: 2023-02-03
draft: false
tags: [programming, design-patterns, computer-science, object-oriented, clean-code]
categories: [programming, design-pattern]

summary: "Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses."

mathjax: true

---

<!-- # Factory Method pattern - Class Creational -->

<!-- ## A summary of GoF Design Patters -->

![Cover](/design-pattern/Factory%20Method%20pattern%20-%20Class%20Creational/img/cover.png)

By **Dmitry Zhart** ([refactoring.guru](https://refactoring.guru/))

## Intent

Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

## Also Known As

Virtual Constructor

## Motivation

![1](/design-pattern/Factory%20Method%20pattern%20-%20Class%20Creational/img/1.png)


Framework use abstract classes to define and maintain relationship between objects. A framework is often responsible for creating these objects as well. 

Consider a framework for applications that can present multiple documents to the user. Two key abstractions in this framework are the classes Application and the Document. Both classes are abstract, and clients have to subclass them to realize their application-specific implementations. The Application class is responsible for managing Documents and will create them as required.

Because the particular Document subclass to instantiate is application-specific, the Application class can't predict the subclass of Document to instantiate - the Application class only knows *when* a new document should be created, not *what kind* of Document to create.

The Factory Method pattern offers a solution. It encapsulates the knowledge of which Document subclass to create and moves this knowledge out of the framework.

Application subclass redefine an abstract CreateDocument operation on Application to return the appropriate Document subclass. Once an Application subclass is instantiated, it can then instantiate application-specific Documents without knowing their class. We call CreateDocument a **factory method** because it is responsible for "manufacturing" an object.

## Applicability

Use the Factory Method pattern when

- a class can't anticipate the class of obejcts it must create.

- a class wants its subclasses to specify the objects it creates.

- classes delegate responsibility to one of several helper subclasses, and you want to localize the knowledge of which helper subclass is the delegate.

## Structure

![2](/design-pattern/Factory%20Method%20pattern%20-%20Class%20Creational/img/2.png)

## Participants

### Product

*(Document)*

- defines the interface of objects the factory method creates. 

### ConcreteProduct

*(MyDocument)*

- implements the Product interface

### Creator

*(Application)*

- declares the factory method, which returns an object of type Product. Creator may also define a default implementation of the factory method that returns a default ConcreteProduct object.

- may call the factory method to create a Product object.

### ConcreteCreator

*(MyApplication*)

- overrides the factory method to return an instance of a ConcreteProduct.

## Collaborations

- Creator relies on its subclasses to define the factory method so that it returns an instance of the appropriate ConcreteProduct.

## Consequences

Factory methods eliminate the need to bind application-specific classes into your code. The code only deals with the Product interface; therefore it can wok with any user-defined ConcreteProduct classes.

A potential disadvantage of factory methods is that clients might have to subclass a Creator classes just to create a particular ConcreteProduct object.

Here are two additional consequences of the Factory Method pattern:

1. *Provides hooks for subclasses*. Creating objects inside a class with a factory method is always more flexible than crating an object directly. Factory method gives subclasses a hook for providing an extend version of an object.

2. *Connects parallel class hierarchies*. Parallel class hierarchies result when a class delegates some of its responsibilities to a separate class. Consider graphical figures that can be manipulated interactively; that is, thay can be stretched, moved, or rotated using the mouse. Implementing suh interactions ins't always easy. It often requires storing and updating information records the state of the manipulation. This state is needed only during manipulation.

With this constraints, it's better to use separate Manipulator object that implements the interaction and keeps track of any manipulation-specific state that's needed.

![3](/design-pattern/Factory%20Method%20pattern%20-%20Class%20Creational/img/3.png)

The Figure class provides a CreateManipulator factory method that lets client create a Figure's corresponding Manipulator. Figure subclasses override this method to return an instance of the Manipulator subclass that's right for them. Alternatively, the Figure class may implement CreateManipulator to return a default Manipulator instance, and Figure subclasses may simply inherit default. 

Notice how the factory method defines the connection between the two class hierarchies. It localize knowledge of which classes belong together.

## Implementation

1. *The two varieties*. The two main variations of the Factory Method pattern are (1) the case when the Creator class is an abstract class and does not provide an implementation for the factory method it declares, and (2) the case when the Creator is a concrete class and provide a default implementation for the factory method. The first case *requires* subclasses to define an implementation, because there is no reasonable default. In the second case, the concrete Creator uses the factory method primarily for flexibility.

2. *Parameterized factory methods*. Another variation on the pattern lets the factory method create *multiple* kinds of products. The factory method takes a parameter that identifies the kind of object to create. All objects the factory method creates will share the Product interface.

3. *Language-specific variants and issues*. Different languages lend themselves to other interesting variations and caveats. Smalltalk programs often use a method that returns the class of the object to be instantiated. A Creator factory method can use this value to create a product, and a ConcreteCreator may store or even compute this value. The result is an even later binding for the type of ConcreteProduct to be instantiated.

4. *Using templates to avoid subclassing*. Another potential problem with factory methods is that they might force you to subclass just to create the appropriate Product objects. Another way to get around this in C++ is to provide a template subclass of Creator that's parameterized by the Product class.

5. *Naming conventions*. It's good practice to use naming conventions that make it clear you're using factory methods.

## Sample Code

To better understand the following code and the classes used look 

[here🔗!](https://github.com/FedericoBruzzone/federicobruzzone.github.io/blob/main/static/design-pattern/commoncode)

The function [*CreateMaze*](https://github.com/FedericoBruzzone/federicobruzzone.github.io/blob/main/static/design-pattern/commoncode/MazeGame_First.java) builds and returns a maze. One problem with this function is that it hard-codes the classes of maze, rooms, doors, and walls.We'll introduce factory methods to let subclasses choose these components.

First we'll define factory methods in *MazeGame* for creating the maze,room,wall, and door objects:

```Java
import commoncode.*;

public class MazeGame_Factory {
  
  public MazeGame_Factory() {}
  
  public Maze MakeMaze() 
    { return new Maze(); }
  
  public Wall MakeWall() 
    { return new Wall(); }
  
  public Room MakeRoom(int n) 
    { return new Room(n); }
  
  public Door MakeDoor(Room r1, Room r2)
    { return new Door(r1, r2); }
  
  public Maze CreateMaze() {
    Maze aMaze   = this.MakeMaze();
    Room r1      = this.MakeRoom(1);
    Room r2      = this.MakeRoom(2);
    Door theDoor = this.MakeDoor(r1, r2);

    r1.SetSide(Direction.North, this.MakeWall());
    r1.SetSide(Direction.East,  theDoor);
    r1.SetSide(Direction.South, this.MakeWall());
    r1.SetSide(Direction.West,  this.MakeWall());

    r2.SetSide(Direction.North, this.MakeWall());
    r2.SetSide(Direction.East,  this.MakeWall());
    r2.SetSide(Direction.South, this.MakeWall());
    r2.SetSide(Direction.West,  theDoor);

    aMaze.AddRoom(r1);
    aMaze.AddRoom(r2);

    return aMaze;
  }

} 
```

Each factory method returns a maze component of a given type. *MazeGame* provides default implementations that return the simplest kinds of maze, rooms, walls, and doors. 

Now we have to rewrite *CreateMaze* to use these factory methods.

## Known Uses

Factory methods pervade toolkits and frameworks.The preceding document example is a typical use in MacApp and ET++ [WGM88]. The manipulator example is from Unidraw.

Class View in the Smalltalk-80 Model/View/Controller framework has a method defaultController that creates a controller, and this might appear to be a factory method [Par90]. But subclasses of Viewspecify the class of their default controller by defining defaultControllerClass, which returns the class from which defaultController creates instances. So defaultControllerClass is the real factory method, tKat is, the method that subclasses should override.

## Related Patterns

Abstract Factory is often implemented with factory methods. 

Factory methods are usually called within Template Methods. 

Prototypes don't require subclassing Creator. However, they often require an Initialize operation on the Product class. Creator uses Initialize to initialize the object. Factory Method doesn't require such an operation.
