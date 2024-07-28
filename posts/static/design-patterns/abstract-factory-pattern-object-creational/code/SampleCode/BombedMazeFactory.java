import commoncode.*;

public class BombedMazeFactory extends MazeFactory {
     
  public Wall MakeWall() 
    { return new BombedWall(); }

  public Room MakeRoom(int n) 
    { return new RoomWithABomb(n); }

}
