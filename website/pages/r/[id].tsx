import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import styles from '../../styles/rec.module.css';

export default () => {
  const userURL = 'https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser';
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [prices, setPrices] = useState(null);
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
    let publicKey = await fetch(userURL);
    publicKey = await publicKey.json();
    setAccessToken(publicKey.access_token);

    // Create the array of product ids
    const productIds = recipeData.ingredients.map((ingredient) => ingredient.id);

    const payload = JSON.stringify({
      productIds,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicKey.access_token}`,
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
    if (unit === 'ea') {
      // If there is no vairable weight, return the amount
      const priceInfo = prices.find((price) => price.productId === ingredient.id);
      if (!priceInfo.variableWeight) {
        return [amount * price[0], amount, unit];
      }
      amount *= priceInfo.variableWeight.averageWeight;
      unit = 'g';
    }

    // Convert the amount to desired unit
    amount = convertUnit(amount, unit, price[2]);

    // Calculate the price per serving
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
            <button type="submit">Add To Cart</button>
            <Link href={`https://www.paknsave.co.nz/shop/product/${ingredient.id}`}><button type="button">View on website</button></Link>
          </div>
        ))}
      </div>
      <button className={styles.addAllButton}> Add All To Cart</button>
    </>
  );
};
