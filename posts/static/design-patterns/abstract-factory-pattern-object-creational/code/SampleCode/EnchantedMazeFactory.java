import commoncode.*;

public class EnchantedMazeFactory extends MazeFactory {
 
  public EnchantedMazeFactory() {}  
 
  public Room MakeRoom(int n)
    { return new EnchatedRoom(n, CastSpell()); }  
 
  public Door MakeRoom(Room r1, Room r2)
    { return new DoorNeedingSpell(n, CastSpell()); }  

  protected Spell CastSpell() {}  

}
