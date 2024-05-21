'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles';
import {Footer, InsightCard, Navbar, TitleText, TypingText} from "../../components";
import {About, Explore, Feedback, GetStarted, Hero, Insights, WhatsNew} from "../../sections";
import {motion} from "framer-motion";
import {fadeIn, staggerContainer} from "../../utils/motion";
import {insights} from "../../constants";
import {NotificationContainer, Notification} from "../../components/Notification";
import {CheckCartInCart, CheckInCart, GetCart, UpdateCart} from "../../constants/cart";


export default function Page() {
  const userURL = 'https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser';
  const cartURL = 'https://api-prod.newworld.co.nz/v1/edge/cart';
  const productURL = 'https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts';
  const router = useRouter();

  const [recipe, setRecipe] = useState < any > (null);
  const [prices, setPrices] = useState < any > (null);
  const [accessToken, setAccessToken] = useState(null);
  const fetched = useRef(false);
  const [cart, setCart] = useState(0);

  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  // Notifications state
  const [notifications, setNotifications] = useState<any>([]);

  const logUserIn = async () => {

    // Check if the session id cookie is present
    const sessionId = document.cookie.split(';').find((cookie) => cookie.includes('SessionCookieIdV2'));
    if (sessionId) {
      return sessionId.split('=')[1];
    }

    // Redirect to login page
    window.location.href = '/login?returnUrl=/r/' + router.query.id;
  };

  const getKey = async (cookie) => {
    const data = JSON.stringify({
      idCookie: cookie,
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
    return response.data.token;

  }

  const dataFetch = async (id) => {
    // Load the json file with the id
    console.log('Fetching ID: ', id);

    // Fetch the recipe data
    setLoadingMessage('Fetching Recipe Data...');
    let recipeData = await fetch(`/data/recpies/${id}.json`);
    recipeData = await recipeData.json();
    recipeData.id = id;

    // Store if the item is in the cart or not
    for (let i = 0; i < recipeData.ingredients.length; i++) {
        recipeData.ingredients[i].inCart =  await CheckInCart(recipeData.ingredients[i].id, recipeData.id);
      }

    setRecipe(recipeData);
    console.log('Recipe: ', recipeData);

    // Log the user in
    setLoadingMessage('Logging User In...');
    let cookie = await logUserIn();
    console.log('Cookie: ', cookie);
    addNotification('Logged in successfully');

    // Get the access token
    const token = await getKey(cookie);
    console.log('Token: ', token);
    setAccessToken(token);

    // Create the array of product ids
    // @ts-ignore
    const productIds = recipeData.ingredients.map((ingredient) => ingredient.id);

    const payload = JSON.stringify({
      productIds,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: productURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };

    // Fetch the prices
    setLoadingMessage('Fetching Prices...');
    const response = await axios(config);
    const apiPrices = response.data.products;
    setPrices(apiPrices);
    console.log('Prices: ', apiPrices);

    // Set the store
    setLoadingMessage('Storing Cart...');
    const store = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-prod.newworld.co.nz/v1/edge/cart/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    // Get the cart
    setLoadingMessage('Getting Cart...');

    // Clear the loading message
    setLoadingMessage("");
  };

  useEffect(() => {
    // Get the id from the url
    const { id } = router.query;

    if (!id) {
      return;
    }

    if (fetched.current) {
      return;
    }

    fetched.current = true;

    dataFetch(id).then(() => { console.log('Data fetched'); });
  }, [router.query]);

  const calculatePrice = (ingredient) => {
    if (!prices) { return [-1, 'Loading...', '']; }

    // Find the price information for the ingredient
    const priceInfo = prices.find((price) => price.productId === ingredient.id);

    // If the price information is not found, return
    if (!priceInfo) {
      return [-1, 'Price not found', ''];
    }

    // Calculate the price
    let cents = 0;
    let quantityPer = 0;
    let unit = '';

    if (priceInfo.singlePrice.comparativePrice) {
      const price = priceInfo.singlePrice.comparativePrice;
      cents = price.pricePerUnit;
      quantityPer = price.unitQuantity;
      unit = price.unitQuantityUom;
    } else if (priceInfo.variableWeight) {
      cents = priceInfo.singlePrice.price;
      quantityPer = 1;
      unit = 'kg';
    } else {
      cents = priceInfo.singlePrice.price;
      quantityPer = 1;
      unit = 'ea';
    }

    return [cents, quantityPer, unit];
  };

  const convertUnit = (amount, source, dest) => {
    let converted = amount;

    // Convert the amount to grams
    switch (source) {
      case 'kg':
        converted *= 1000;
        break;
      case 'g':
        break;
      case 'ml':
        converted *= 1;
        break;
      case 'l':
        converted *= 1000;
        break;
      default:
        console.log('Invalid unit');
    }

    // Convert the converted to the desired unit
    switch (dest) {
      case 'kg':
        converted /= 1000;
        break;
      case 'g':
        break;
      case 'ml':
        converted *= 1;
        break;
      case 'l':
        converted /= 1000;
        break;
      default:
        console.log('Invalid unit');
    }

    return converted;
  };

  const calculateServings = (ingredient) => {
    let { amount } = ingredient;
    if (ingredient.amount.range) {
      amount = (ingredient.amount.range[0] + ingredient.amount.range[1]) / 2;
    }
    let { unit } = ingredient;
    const price = calculatePrice(ingredient);

    // If the price is not found, return the amount
    if (price[0] === -1) {
      return price;
    }

    // If it is an ea unit, return the amount
    if (unit === 'ea' && prices) {
      // If there is no vairable weight, return the amount
      const priceInfo = prices.find((pricei) => pricei.productId === ingredient.id);
      if (priceInfo.variableWeight) {
        amount *= priceInfo.variableWeight.averageWeight;
        unit = 'g';
      } else {
        amount *= priceInfo.displayName.split('g')[0];
        unit = 'g';
      }
    }

    // Convert the amount to desired unit
    amount = convertUnit(amount, unit, price[2]);

    // Calculate the price per serving
    // @ts-ignore
    const pricePerServing = price[0] / price[1];

    // Calculate the price for the amount
    const priceForAmount = pricePerServing * amount;

    return [priceForAmount, amount, unit];
  };

  const printPrice = (ingredient) => {
    const price = calculatePrice(ingredient);

    if (price[0] === -1) {
      return price[1];
    }

    const [cents, quantityPer, unit] = price;
    // @ts-ignore
    return `$${(cents / 100).toFixed(2)} per ${quantityPer}${unit}`;
  };

  const printServings = (ingredient) => {
    const servings = calculateServings(ingredient);

    if (servings[0] === -1) {
      return servings[1];
    }

    const [priceForAmount, amount, unit] = servings;
    return `$${(priceForAmount / 100).toFixed(2)} for ${amount}${unit}`;
  };

  const addToCart = async (ingredient, mass = false) => {

    setLoadingMessage('Adding ' + ingredient.name  +' to Cart...');

    // Get the cart
    const currentCart = await GetCart();

    // Check if the item is already in the cart
    const itemInCart = currentCart.products.find((item) => item.productId === ingredient.id);
    let addQuantity = 0;
    if(itemInCart){
        const itemInCartThis = itemInCart.recipeAmount.find((item) => item.recipeId === recipe.id);
        if(itemInCartThis){
            setLoadingMessage('');
            addNotification(ingredient.name + ' already in cart');
            return;
        }

        // Otherwise add the quantity
        addQuantity = itemInCart.quantity;
    }


    // Get the ingredient
    const priceInfo = prices.find((price) => price.productId === ingredient.id);
    const item = {
      productId: priceInfo.productId,
      quantity: (ingredient.amount.range ? (ingredient.amount.range[0] + ingredient.amount.range[1]) / 2 : ingredient.amount) + addQuantity,
      sale_type: ingredient.unit == "ea" ? 'UNITS' : 'WEIGHT',
    };

    const payload = JSON.stringify({
      products: [
        item,
      ],
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: cartURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: payload,
    };

    const response = await axios(config);
    console.log('Response: ', response.data);
    setCart(response.data.products.length);
    setLoadingMessage('');
    UpdateCart(response.data, recipe.id)

    // Find the ingredient and update the inCart value
    let updatedRecipe = {...recipe};
    for (let i = 0; i < updatedRecipe.ingredients.length; i++) {
        if(updatedRecipe.ingredients[i].id === ingredient.id){
            updatedRecipe.ingredients[i].inCart = true;
        }
    }
    setRecipe(updatedRecipe);

    if(!mass){
      addNotification(ingredient.name + ' added to cart');
    }

  };

  const addAllToCart = async () => {

      for (let i = 0; i < recipe.ingredients.length; i++) {
          await addToCart(recipe.ingredients[i], true);
      }
    addNotification('All items added to cart');
  }

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
        <Navbar itemAmount={cart}/>
        <div className="relative">
          <section className={`${styles.paddings} relative z-10`}>
            <motion.div
                //@ts-ignore
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{once: false, amount: 0.25}}
                className={`${styles.innerWidth} mx-auto flex flex-col`}
                key={recipe?.ingredients.length}
            >
              <TitleText title={recipe?.name} textStyles="text-center"/>
              <TypingText title="| The Hungry Scholars Survival Handbook" textStyles="text-center"/>
              <motion.div
                  variants={fadeIn('up', 'spring', (0.1) * 0.5, 1)}
                  className="flex justify-center mt-[50px] gap-[30px] w-full p-10"
              >
                <button onClick={addAllToCart} type="button"
                        className="flex items-center h-fit py-4 px-6 bg-[#94c47d] rounded-[32px] gap-[12px]">
                  <img
                      src="/cart.svg"
                      alt="headset"
                      className="w-[24px] h-[24px] object-contain"
                  />
                  <span className="font-normal text-[16px] text-white"> Add All To Cart </span>
                </button>
              </motion.div>
              <div className="mt-[50px] flex flex-col gap-[30px]">
                {recipe?.ingredients.map((item, index) => (
                    <InsightCard
                        key={`insight-${index}`}
                        index={index}
                        title={item.name}
                        subtitle={printPrice(item) + " | " + printServings(item)}
                        imgUrl={`https://a.fsimg.co.nz/product/retail/fan/image/400x400/${item.id.split('-')[0]}.png`}
                        clickCallBack={() => addToCart(item)}
                        alreadyInCart={item.inCart}
                    />
                ))}
              </div>
              <motion.div
                  variants={fadeIn('up', 'spring', (recipe?.ingredients.length + 1) * 0.5, 1)}
                  className="flex justify-center mt-[50px] gap-[30px] w-full p-10"
              >
                <button onClick={addAllToCart} type="button"
                        className="flex items-center h-fit py-4 px-6 bg-[#94c47d] rounded-[32px] gap-[12px]">
                  <img
                      src="/cart.svg"
                      alt="headset"
                      className="w-[24px] h-[24px] object-contain"
                  />
                  <span className="font-normal text-[16px] text-white"> Add All To Cart </span>
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
