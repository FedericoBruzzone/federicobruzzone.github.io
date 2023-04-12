import commoncode.*;

public class Creator {

  public Product Create(ProductId id) {
    if (id == ProductId.MINE)  return new MyProduct();
    if (id == ProductId.YOURS) return new YourProduct();
    // repeat for remaining products ...
    return null;
  }

}
