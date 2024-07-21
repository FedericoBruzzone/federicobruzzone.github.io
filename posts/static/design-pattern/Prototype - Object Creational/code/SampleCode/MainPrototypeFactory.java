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
  