import axios from "axios";

export async function GetCart() {


    // Check if the user is logged in
    const sessionId = document.cookie.split(';').find((cookie) => cookie.includes('SessionCookieIdV2'));
    if (!sessionId) {
        return {
            products: [],
            subtotal: 0,
        };
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

    // Get the cart items from the API
    const cartConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api-prod.newworld.co.nz/v1/edge/cart',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const cartResponse = await axios(cartConfig);

    let cart = cartResponse.data;

    // Go through the local storage and make sure the cart is up to date
    let localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
    localStorageCart.forEach((cartItem) => {

        // Check if the item is in the cart
        const index = cart.products.findIndex((product) => product.productId === cartItem.productId);

        // If the item is not in the remote cart remove it from the local storage
        if (index === -1) {
            localStorageCart = localStorageCart.filter((item) => item.productId !== cartItem.productId);
        }
    });

    // Update the local storage
    localStorage.setItem('cart', JSON.stringify(localStorageCart));

    return cart;
}

export function AddToLocalStorageCart(id, recpieId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex((cartItem) => cartItem.productId === id && cartItem.recipeId === recpieId);
    if (index === -1) {
        cart.push({ productId: id, recipeId: recpieId });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function RemoveFromLocalStorageCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the items from the cart
    const cartUpdated = cart.filter((cartItem) => cartItem.productId !== id);
    localStorage.setItem('cart', JSON.stringify(cartUpdated));
}

export function CheckLocalStorageCart(id, recpieId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex((cartItem) => cartItem.productId === id && cartItem.recipeId === recpieId);
    return index !== -1;
}