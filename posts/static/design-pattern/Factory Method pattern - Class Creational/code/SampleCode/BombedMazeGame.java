import commoncode.*;;

public class BombedMazeGame extends MazeGame_Factory {
  
  public BombedMazeGame() {}

  public Wall MakeWall()
    { return new BombedWall(); }

  public Room MakeRoom(int n) 
    { return new RoomWithABomb(n); }  
}
