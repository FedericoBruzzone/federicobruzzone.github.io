import commoncode.*;

public class MyCreator extends Creator {

    @Override public Product Create(ProductId id) {
        if (id == ProductId.YOURS)   return new MyProduct();
        if (id == ProductId.MINE)  return new YourProduct();
        // N.B.: switched YOURS and MINE
        
        if (id == ProductId.THEIRS) return new TheirProduct();
        
        return super.Create(id);
    }
}
