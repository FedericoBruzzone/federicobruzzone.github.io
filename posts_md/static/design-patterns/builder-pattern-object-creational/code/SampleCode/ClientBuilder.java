import commoncode.*;

public class ClientBuilder {
  
  public static void main(String[] args) {
    Maze maze;
    MazeGame_Builder game = new MazeGame_Builder();
    StandardMazeBuilder builder = new StandardMazeBuilder();

    game.CreateMaze(builder);
    maze = builder.GetMaze();
  }

}
