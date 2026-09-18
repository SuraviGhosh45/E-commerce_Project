import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("vendora_cart");

    if (!storedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(storedCart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to restore cart:", error);
      localStorage.removeItem("vendora_cart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "vendora_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) {
      return;
    }

    const stock = Number(product.stock || 0);
    const requestedQuantity = Number(quantity);

    if (stock <= 0 || requestedQuantity <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        const newQuantity = Math.min(
          Number(existingItem.quantity) + requestedQuantity,
          stock
        );

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                stock,
                price: Number(product.price),
                image: product.image,
                name: product.name,
                category: product.category,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          price: Number(product.price),
          stock,
          quantity: Math.min(
            requestedQuantity,
            stock
          ),
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const stock = Number(item.stock || 0);

        return {
          ...item,
          quantity: Math.min(
            Number(item.quantity) + 1,
            stock
          ),
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: Number(item.quantity) - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const requestedQuantity = Number(quantity);

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const stock = Number(item.stock || 0);

        const newQuantity = Math.max(
          1,
          Math.min(
            requestedQuantity,
            stock
          )
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  // FIX:
  // Keep the clearCart function reference stable
  // so OrderSuccess useEffect does not run endlessly.
  const clearCart = useCallback(() => {
    setCartItems((currentItems) => {
      if (currentItems.length === 0) {
        return currentItems;
      }

      return [];
    });
  }, []);

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const isCartEmpty = cartItems.length === 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartEmpty,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};

export { CartProvider, useCart };
