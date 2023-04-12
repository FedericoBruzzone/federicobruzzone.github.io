public class MainAbstractFactory {

  public static void main(String[] args) {
    MazeGame_Factory game = new MazeGame_Factory();

    MazeFactory factory = new MazeFactory();
    BombedMazeFactory bombedFactory = new BombedMazeFactory();

    game.CreateMaze(bombedFactory /* factory */);
  }  
  
}
