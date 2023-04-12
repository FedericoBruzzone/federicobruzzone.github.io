import commoncode.*;

public class MazeGame_Builder {
    
  public Maze CreateMaze(MazeBuilder builder) {
    builder.BuildMaze();
    
    builder.BuildRoom(1);
    builder.BuildRoom(2);
    builder.BuildDoor(1, 2);
    
    return builder.GetMaze();
  }

}
