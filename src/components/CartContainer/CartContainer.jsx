import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartContext } from "../../context/cartContext.jsx";
import Button from "../Button/Button.jsx";
import FormCheckout from "../CartContainer/FormCheckout.jsx";
import "./CartContainer.css";
import { createOrder } from "../../services/firestore";




function CartContainer() {
  const navigateTo = useNavigate();
  const context = useContext(cartContext);
  const { cart, getPriceInCart, removeItemFromCart, clearCart } = context;

  const handleCheckout = (userData) => {
    const order = {
      items: cart,
      buyer: userData,
      total: getPriceInCart(),
      date: new Date(),
    };
    createOrder(order).then((orderId) => {
      // limpiar el carrito después de crear la orden
      clearCart();
      // redirigir a la página de checkout con el id de la orden
      navigateTo(`/checkout/${orderId}`);
    });
  };



  return (
    <div className="cartContainer">
      <h1>Carrito de compras</h1>
      {cart.length > 0 ? (
        <>
          <div className="cartItemsContainer">
            {cart.map((item) => (
              <div className="cartItem" key={item.id}>
                <img src={item.pictureUrl} alt={item.title} />
                <div className="cartItemData">
                  <h2>{item.title}</h2>
                  <p>Cantidad: {item.count}</p>
                  <p>Precio: ${item.price}</p>
                  <Button color="#c63224" onPress={() => removeItemFromCart(item.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="cartTotal">
            <p>Total: ${getPriceInCart()}</p>
            <Button onPress={clearCart}>Limpiar Carrito</Button>
            <FormCheckout onCheckout={handleCheckout} />
          </div>
        </>
      ) : (
        <div className="emptyCart">
          <h2>Tu carrito está vacío</h2>
          <p>Vuelve al Home para agregar productos</p>
          <Link to="/">
            <Button>Volver al Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartContainer;
