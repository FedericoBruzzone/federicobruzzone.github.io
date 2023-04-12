import commoncode.*;

public class StandardMazeBuilder extends MazeBuilder {
    
  private Maze _currentMaze;

  public StandardMazeBuilder() {
    this._currentMaze = null;
  }

  @Override public void BuildMaze() {
    this._currentMaze = new Maze();
  }

  @Override public void BuildRoom(int n) {
    if (_currentMaze.RoomNo(n) != null) {
      Room room = new Room(n);
      this._currentMaze.AddRoom(room);

      room.SetSide(Direction.North, new Wall());
      room.SetSide(Direction.South, new Wall());
      room.SetSide(Direction.East,  new Wall());
      room.SetSide(Direction.West,  new Wall());
    }
  }

  @Override public void BuildDoor(int n1, int n2) {
    Room r1 = this._currentMaze.RoomNo(n1);
    Room r2 = this._currentMaze.RoomNo(n2);
    Door d = new Door(r1, r2);

    r1.SetSide(this.CommonWall(r1, r2), d);
    r2.SetSide(this.CommonWall(r2, r1), d);
  }

  private Direction CommonWall(Room r1, Room r2) { 
    return null;
  }

  @Override public Maze GetMaze() {
    return this._currentMaze;
  }

}
