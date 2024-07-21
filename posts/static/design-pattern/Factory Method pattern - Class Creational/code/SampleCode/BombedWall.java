import commoncode.*;

public class BombedWall extends Wall {
  
  int wallDamage = 0;
  
  public BombedWall() {
    super();
  }  

  public void hitWall(int bombDamage) {
    this.wallDamage = bombDamage;
  }

}