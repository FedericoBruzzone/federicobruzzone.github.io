import commoncode.*;

public class RoomWithABomb extends Room {
  
  int bombDamage;

  public RoomWithABomb(int roomNo) {
    super(roomNo);
  }  

  public void setBombDamage(int bombDamage) {
    this.bombDamage = bombDamage;
  } 

}
