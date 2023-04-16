import commoncode.*;

public class MazePrototypeFactory extends MazeFactory {
    
    private Maze _prototypeMaze = null;
    private Room _prototypeRoom = null;
    private Wall _prototypeWall = null;
    private Door _prototypeDoor = null;

    public MazePrototypeFactory(Maze m, Wall w, Room r, Door d) {
        this._prototypeMaze = m;
        this._prototypeWall = w;
        this._prototypeRoom = r;
        this._prototypeDoor = d;
    }

    @Override
    public Maze MakeMaze() {
        return _prototypeMaze.clone();
    }

    @Override
    public Wall MakeWall() {
        return _prototypeWall.clone();
    }

    @Override
    public Room MakeRoom(int n) {
        Room room = _prototypeRoom.clone();
        room.initializer(n);
        return room;
    }

    @Override
    public Door MakeDoor(Room r1, Room r2) {
        Door door =  _prototypeDoor.clone();
        door.initializer(r1, r2);
        return door;
    }
}
