---

author: Federico Bruzzone
title: Prototype - Class Creational
date: 2023-05-08
draft: false
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

## Collaborations

A client asks a prototype to clone itself.

## Consequences

Prototype has many of the same consequences that Abstract Factory and Builder have: It hides the concrete product classes from the client. Moreover, these patterns let a client work with application-specific classes without modification.

Additional benefits of the Prototype pattern:

1. *Adding and removing products at run-time*: Prototypes let you incorporate a new concrete product class into a system simply by registering a prototypical instance with the client.

2. *Specifying new objects by varying values*: Highly dynamic systems let you define new behavior through object composition by specifying values for an object's variables. You effectively define new kinds of objects by instantiating existing classes andregistering the instances as prototypes of client objects. A client can exhibit new behavior by delegating responsibility to the prototype.

3. *Specifying new objects by varying structure*: Many applications build objects from parts and subparts.

4. *Reduced subclassing*: Factory Method often produces a hierarchy of Creator classes that parallels the product class hierarchy. The Prototype pattern lets you clone a prototype instead of asking a factory method to make a new object.

5. *Configuring an application with classes dynamically*: Some run-time environments let you load classes into an application dynamically. An application that wants to create instances of a dynamically loaded class won't be able to reference its constructor statically. Instead, the run-time environment creates an instance of each class automatically when it's loaded, and it registers the instance with a prototype manager

## Implementation

Prototype is particularly useful with static languages like C++, where classes are not objects, and little or no type information is available at run-time.

Consider the following issues when implementing prototypes:

1. *Using a prototype manager*: When the number of prototypes in a system in not fixed, keep the registry of available prototypes. A prototype manager is an associative store that returns the prototype matching a given key.

2. *Implementing the Clone operation*:  The hardest part of the Prototype pattern is implementing the Clone operation correctly. Most languages provide some support for cloning objects, but using inheritance or copy-constructor don't solve the "shallow copy versus deep copy" problem. A shallow copy is simple and often sufficient, but cloning prototypes with complex structures usually requires a deep copy. If objects in the system provide Save and Load operations, then you can use them to provide a default implementation of Clone.

3. *Initializing clones*: You generally can't pass these values in the Clone operation, because their number will vary between classes of prototypes. It might be the case that your prototype classes already define operations for (re)setting key pieces of state.

## Sample Code

To better understand the following code and the classes used look 

[here🔗!](https://github.com/FedericoBruzzone/federicobruzzone.github.io/blob/main/static/design-pattern/commoncode)

We'll define a *MazePrototypeFactory* subclass of the *MazeFactory* class.  MazePrototypeFactory will be initialized with prototypes of the objects it will create so that we don't have to subclass it just to change the classes of walls or rooms it creates.

- *MazePrototypeFactory* augments the *MazeFactory* interface with a constructor that takes the prototypes as arguments.

- The new constructor simply initializes its prototypes.

- The member functions for creating walls, rooms, and doors are similar: Each clones a prototype and then initializes it. Here are the definitions of *MakeWall* and *MakeDoor*:

```Java
import commoncode.*;

public class MazePrototypeFactory extends MazeFactory {
    
    private Maze _prototypeMaze = null;
    private Room _prototypeRoom = null;
    private Wall _prototypeWall = null;
    private Door _prototypeDoor = null;

    public MazePrototypeFactory(Maze m, Wall w, Room r, Door d) {
        this._prototypeMaze = m;
        this._prototypeWall = w;
        this._prototypeRoom = r;
        this._prototypeDoor = d;
    }

    @Override
    public Maze MakeMaze() {
        return _prototypeMaze.clone();
    }

    @Override
    public Wall MakeWall() {
        return _prototypeWall.clone();
    }

    @Override
    public Room MakeRoom(int n) {
        Room room = _prototypeRoom.clone();
        room.initializer(n);
        return room;
    }

    @Override
    public Door MakeDoor(Room r1, Room r2) {
        Door door =  _prototypeDoor.clone();
        door.initializer(r1, r2);
        return door;
    }
}
```

We can use *MazePrototypeFactory* to create a prototypical or default maze just by initializing it with prototypes of basic maze components.


```Java
import commoncode.*;

public class MainPrototypeFactory {
    public static void main(String[] args) {
        MazeGame_Factory game;
    
        MazePrototypeFactory simpleMazeFactory = new MazePrototypeFactory(
            new Maze(), 
            new Wall(), 
            new Room(1), 
            new Door(1, 2));

        Maze maze = game.CreateMaze(simpleMazeFactory);
      } 
}
```

## Known Uses

The first widely known application of the pattern in an object- oriented language was in ThingLab, where users could form a composite object and then promote it to a prototype by installing it in a library of reusable objects

The first widely known application of the pattern in an object-oriented language was in ThingLab, where users could form a composite object and then promote it to a prototype by installing it in a library of reusable objects

## Related Patterns
Prototype and Abstract Factory are competing patterns in some ways, as we discuss at the end of this chapter. They can also be used together, however. An Abstract Factory might store a set of prototypes from which to clone and return product objects.

Designs that make heavy use of the Composite and Decorator patterns often can benefit from Prototype as well.
