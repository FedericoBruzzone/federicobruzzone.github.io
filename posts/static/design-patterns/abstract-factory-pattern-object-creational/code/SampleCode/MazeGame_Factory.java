import commoncode.*;

public class MazeGame_Factory {

  public Maze CreateMaze(MazeFactory factory) {
    Maze aMaze   = factory.MakeMaze();
    Room r1      = factory.MakeRoom(1);
    Room r2      = factory.MakeRoom(2);
    Door theDoor = factory.MakeDoor(r1, r2);

    r1.SetSide(Direction.North, factory.MakeWall());
    r1.SetSide(Direction.East,  theDoor);
    r1.SetSide(Direction.South, factory.MakeWall());
    r1.SetSide(Direction.West,  factory.MakeWall());

    r2.SetSide(Direction.North, factory.MakeWall());
    r2.SetSide(Direction.East,  factory.MakeWall());
    r2.SetSide(Direction.South, factory.MakeWall());
    r2.SetSide(Direction.West,  theDoor);

    aMaze.AddRoom(r1);
    aMaze.AddRoom(r2);

    return aMaze;
  }     
  
}
