import commoncode.*;;

public class EnchantedMazeGame extends MazeGame_Factory {
  
  public EnchantedMazeGame() {}

  public Room MakeRoom(int n) 
    { return new EnchantedRoom(n, CastSpell()); }

  public Door MakeDoor(Room r1, Room r2) 
    { return new DoorNeedingSpell(r1, r2); }

  protected Spell CastSpell() {}

}
