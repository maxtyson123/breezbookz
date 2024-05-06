import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles/rec.module.css';

export default () => {
  const userURL = 'https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser';
  const cartURL = 'https://api-prod.newworld.co.nz/v1/edge/cart';
  const productURL = 'https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts';
  const router = useRouter();

  // eslint-disable-next-line no-undef
  const [recipe, setRecipe] = useState < any > (null);
  // eslint-disable-next-line no-undef
  const [prices, setPrices] = useState < any > (null);
  const [accessToken, setAccessToken] = useState(null);
  const fetched = useRef(false);

  const dataFetch = async (id) => {
    // Load the json file with the id
    console.log('Fetching ID: ', id);

    // Fetch the recipe data
    let recipeData = await fetch(`/data/recpies/${id}.json`);
    recipeData = await recipeData.json();
    setRecipe(recipeData);
    console.log('Recipe: ', recipeData);

    // Get the public key
    const cookies = {
      eCom_STORE_ID: '529d66cc-60e3-432e-b8d1-efc9f2ec4919',
      STORE_ID_V2: '529d66cc-60e3-432e-b8d1-efc9f2ec4919|False',
      server_nearest_store_v2: '{"StoreId":"529d66cc-60e3-432e-b8d1-efc9f2ec4919","StoreLat":"-35.725958","StoreLng":"174.32475","UserLat":"-35.7665","UserLng":"174.3717","IsSuccess":true}',
    };
    const publicKey = await axios.get(userURL, {
      headers: {
        Cookie: Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; '),
      },
    });
    setAccessToken(publicKey.data.access_token);

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
        Authorization: `Bearer ${publicKey.data.access_token}`,
      },
      data: payload,
    };
    console.log('Config: ', config);

    const response = await axios(config);
    const apiPrices = response.data.products;
    setPrices(apiPrices);
    console.log('Prices: ', apiPrices);
  };

  useEffect(() => {
    // Get the id from the url
    const { id } = router.query;

    if (!id) {
      return;
    }

    console.log('ID: ', id);

    if (fetched.current) {
      return;
    }

    fetched.current = true;
    console.log('Fetching data');
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

  const addToCart = async (ingredient) => {
    // Get the ingredient
    const priceInfo = prices.find((price) => price.productId === ingredient.id);
    const item = {
      productId: priceInfo.productId,
      quantity: ingredient.amount.range ? (ingredient.amount.range[0] + ingredient.amount.range[1]) / 2 : ingredient.amount,
      sale_type: ingredient.unit ? 'WEIGHT' : 'UNITS',
    };

    const payload = JSON.stringify({
      products: [
        item,
      ],
    });

    console.log('Payload: ', payload);

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
  };

  return (
    <>
      <div>Id Page</div>
      <div>NAME: {recipe?.name}</div>
      <div>TOKEN: {accessToken}</div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className={styles.ingredients}>
        {recipe?.ingredients.map((ingredient, index) => (
          <div className={styles.ingredient} key={index}>
            <img src={`https://a.fsimg.co.nz/product/retail/fan/image/400x400/${ingredient.id.split('-')[0]}.png`} width={200} height={200} />
            <p>{ingredient.name}</p>
            <p>{!ingredient.amount?.range ? ingredient.amount : `${ingredient.amount.range[0]} - ${ingredient.amount.range[1]}`}</p>
            <div>
              <p>{printPrice(ingredient)}</p>
              <p>{printServings(ingredient)}</p>
            </div>
            <button type="submit" onClick={() => { addToCart(ingredient); }}>Add To Cart</button>
            <Link href={`https://www.paknsave.co.nz/shop/product/${ingredient.id}`}><button type="button">View on website</button></Link>
          </div>
        ))}
      </div>
      <button className={styles.addAllButton} type="submit"> Add All To Cart</button>
    </>
  );
};
