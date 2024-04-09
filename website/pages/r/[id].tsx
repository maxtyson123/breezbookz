import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
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
            <p>$price</p>
            <button>Add To Cart</button>
          </div>
        ))}
      </div>
      <button className={styles.addAllButton}> Add All To Cart</button>
    </>
  );
};
