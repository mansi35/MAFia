import React, { useEffect, useState } from "react";
import "../../css/Checkout.css";
import SharedBasketProduct from './SharedBasketProduct';
import db from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import Subtotal from "./Subtotal";

function SharedFriendBasket({key, userId, name}) {
    const {currentUser} = useAuth();
    const [items, setItems] = useState([]);
    const [length, setLength] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (currentUser) {
            db.collection("users").doc(userId).get().then(docc => {
                const data = docc.data();
                setTotal(data.subtotal);
                setLength(data.noItems);
            })
        }
    })
    

    useEffect(() => {
        db.collection("users").doc(currentUser.uid).collection("friends").doc(userId).collection("basketItems")
          .onSnapshot((snapshot) => 
            setItems(snapshot.docs.map((doc) => ({
                id: doc.id,
                item: doc.data()
            })))
        );
    // eslint-disable-next-line
    }, [])

    if (items.length === 0) {
      return (
        <div></div>
      )
    }
    return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />

        <div>
          <h2 className="checkout__title">{name}'s shopping Basket</h2>
          {items.map(({ id, item }) => (
              <SharedBasketProduct 
                key = {id}
                productId = {id}
                title = {item.itemName}
                price = {item.itemPrice}
                image = {item.itemImage}
                rating = {item.itemRating}
                setLength = {setLength}
                setTotal = {setTotal}
              />
          ))}
        </div>
      </div>
     <div className="checkout__right">
			<Subtotal
				length = {length}
				total = {total}
			/>
          </div>
    </div>
  );
}

export default SharedFriendBasket;