import java.lang.reflect.ParameterizedType;

public abstract class Creator3 {
    
  public abstract Product CreateProduct();

}

class StandardCreator<TheProduct extends Product> extends Creator3 {

  public TheProduct CreateProduct() {
    ParameterizedType superClass = (ParameterizedType) getClass().getGenericSuperclass();
    Class<TheProduct> type = (Class<TheProduct>) superClass.getActualTypeArguments()[0];
    try {
        return type.getConstructor().newInstance();
    } catch (Exception e) { throw new RuntimeException(e); }
  }

}

class Main {

  public static void main(String[] args) {
    StandardCreator<MyProduct> standardCreator;
  }

}