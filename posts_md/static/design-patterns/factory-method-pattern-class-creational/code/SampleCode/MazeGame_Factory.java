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
