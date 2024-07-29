import commoncode.*;

public class Creator2 {
    
  private Product _product;
    
  public Product GetProduct() {
    if (_product == null) {
        _product = CreateProduct();
    }
    return _product;
  }

  protected Product CreateProduct() { 
    return null; 
  }

}
