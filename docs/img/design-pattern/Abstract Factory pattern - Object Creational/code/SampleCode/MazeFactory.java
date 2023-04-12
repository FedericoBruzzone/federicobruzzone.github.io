import commoncode.*;

public class MazeFactory {

  public MazeFactory() {}

  public Maze MakeMaze() 
    { return new Maze(); }

  public Wall MakeWall() 
    { return new Wall(); }

  public Room MakeRoom(int n) 
    { return new Room(n); }

  public Door MakeDoor(Room r1, Room r2)
    { return new Door(r1, r2); }

}
