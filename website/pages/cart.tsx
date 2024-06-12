'use client'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../styles';
import {Footer, InsightCard, Navbar, TitleText, TypingText} from "../components";
import {motion} from "framer-motion";
import {fadeIn, staggerContainer} from "../utils/motion";
import {NotificationContainer, Notification} from "../components/Notification";
import { GetCart, RemoveFromLocalStorageCart} from "../constants/cart";


export default function Page() {


  const [recipe, setRecipe] = useState < any > (null);
  const [cart, setCart] = useState<any>([]);

  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  // Notifications state
  const [notifications, setNotifications] = useState<any>([]);


  const dataFetch = async () => {
    setLoadingMessage('Loading...');

    // Get the cart
    const cart = await GetCart();

    // Set the cart
    setCart(cart);

    // Clear the loading message
    setLoadingMessage('');

  };

  useEffect(() => {

    dataFetch().then(() => { console.log('Data fetched'); });
  }, []);


  const addNotification = (text, type = 'success') => {
    const notification = {
        id: Math.random(),
        text,
        type,
    }
    setNotifications(prevState =>
        [...prevState, notification]
      );

    // set timeout to remove
    setTimeout(() => {
        setNotifications(prevState =>
            prevState.filter((notification) => notification.id !== notification.id)
        );
    }, 3000);
  }

  const buyItem = async (item) => {

    // Open the PaknSave website
    window.open('https://www.paknsave.co.nz/shop/shopping-cart', '_blank');

    // Reload the page
    location.reload();

  }

  const removeItem = async (item) => {


    setLoadingMessage('Removing ' + item.name  +' from Cart...');


    // Get the ingredient
    const ritem = {
      productId: item.productId,
      quantity: 0,
      sale_type: item.sale_type,
    };

    const payload = JSON.stringify({
      products: [
        ritem,
      ],
    });

    // Check if the user is logged in
    const sessionId = document.cookie.split(';').find((cookie) => cookie.includes('SessionCookieIdV2'));
    if (!sessionId) {

      // Make sure the user is logged in
      addNotification('ERROR: Please login to remove items from your cart');
      setLoadingMessage('');
      return;

    }
    const sessionCookie = sessionId.split('=')[1];
    const data = JSON.stringify({
      idCookie: sessionCookie,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/key',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    // Get the cookies from the login
    const response = await axios(config);
    const token = response.data.token;

    const Rconfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-prod.newworld.co.nz/v1/edge/cart',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };

    const Rresponse = await axios(Rconfig);
    console.log('Response: ', Rresponse.data);
    setLoadingMessage('');

    // Remove the item from the cart
    RemoveFromLocalStorageCart(item.productId);

    setCart(await GetCart());
    addNotification('Item removed from cart', 'success');
  };

  // @ts-ignore
  return (

    <>

      {/* Loading Overlay */}
      {loadingMessage &&
          <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.9)',
                zIndex: 1000,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2rem',

            }}
          >
            <img src="/book-loading.gif" alt="Loading" style={{width: '100px', height: '100px'}}/>
            <p> {loadingMessage} </p>
          </div>
      }

      {/* Primary Page Layout */}
      <div className="bg-primary-black overflow-hidden">
        <Navbar itemAmount={cart.products?.length}/>
        <div className="relative">
          <section className={`${styles.paddings} relative z-10`}>
            <motion.div
                //@ts-ignore
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{once: false, amount: 0.25}}
                className={`${styles.innerWidth} mx-auto flex flex-col`}
                key={cart.products?.length}
            >
              <motion.div
                  variants={fadeIn('up', 'spring', (0.1) * 0.5, 1)}
                  className="flex justify-center mt-[50px] gap-[30px] w-full p-10"
                  style={{marginTop: '-50px', marginBottom: '20px'}}
              >
                <img src="/paknsave.webp" alt="login" className="w-[40%] object-contain"/>
              </motion.div>
              <TitleText title={"Your Cart"} textStyles="text-center"/>
              <TypingText
                  title={"| " + cart.products?.length + " Items in Cart, Total: $" + (cart?.subtotal / 100).toFixed(2)}
                  textStyles="text-center"/>
              <motion.div
                  variants={fadeIn('up', 'spring', (0.1) * 0.5, 1)}
                  className="flex justify-center mt-[50px] gap-[30px] w-full p-10"
              >
                <button onClick={buyItem} type="button"
                        className="flex items-center h-fit py-4 px-6 rounded-[32px] gap-[12px]"
                        style={{background: 'linear-gradient(90deg, #94C47D 0%, #94C47D 25%, #fed600 50%, #fed600 100%)'}}>
                  <img
                      src="/cart.svg"
                      alt="headset"
                      className="w-[24px] h-[24px] object-contain"
                  />
                  <span className="font-normal text-[16px] text-black"> Buy Now </span>
                </button>
              </motion.div>
              <div className="mt-[50px] flex flex-col gap-[30px]">
                {cart.products?.length === 0 && <InsightCard
                    title="Your cart is empty"
                    subtitle="Add items to your cart to see them here"
                    imgUrl="/Logo White Transparent.png"
                    clickCallBack={() => {
                    }}
                    alreadyInCart={false} index={undefined} isCart={undefined}                />}
                {cart?.products?.map((item, index) => (
                    <InsightCard
                        key={`insight-${index}`}
                        index={index}
                        title={item.name}
                        subtitle={item.quantity + " for: $" + (item.price / 100).toFixed(2)}
                        imgUrl={`https://a.fsimg.co.nz/product/retail/fan/image/400x400/${item.productId.split('-')[0]}.png`}
                        clickCallBack={() => removeItem(item)}
                        isCart
                        alreadyInCart={false}
                    />
                ))}
              </div>
              <motion.div
                  variants={fadeIn('up', 'spring', (recipe?.ingredients.length + 1) * 0.5, 1)}
                  className="flex justify-center mt-[50px] gap-[30px] w-full p-10"
              >
                <button onClick={buyItem} type="button"
                        className="flex items-center h-fit py-4 px-6 rounded-[32px] gap-[12px]"
                        style={{background: 'linear-gradient(90deg, #94C47D 0%, #94C47D 25%, #fed600 50%, #fed600 100%)'}}>
                  <img
                      src="/cart.svg"
                      alt="headset"
                      className="w-[24px] h-[24px] object-contain"
                  />
                  <span className="font-normal text-[16px] text-black"> Buy Now </span>
                </button>
              </motion.div>
            </motion.div>
          </section>
          <div className="gradient-04 z-0"/>
        </div>
        <NotificationContainer position={"bottom"}>
          {notifications &&
              notifications.map((notification) => (
                  <Notification
                      key={notification.id}
                      notification={notification}
                      notifications={notifications}
                      setNotifications={setNotifications}
                  />
              ))}
        </NotificationContainer>
        <Footer/>
      </div>
    </>
  )
};
