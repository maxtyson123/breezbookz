import axios from "axios";

export async function GetCart() {

    // Get the cart items from localStorage
    const cartItems = localStorage.getItem("cartItems");

    // If cartItems is not null, return the parsed cartItems
    if (cartItems !== null) {
        return JSON.parse(cartItems);
    }

    // Check if the user is logged in
    const sessionId = document.cookie.split(';').find((cookie) => cookie.includes('SessionCookieIdV2'));
    if (!sessionId) {
        return [];
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

    // Go through the cart items and add the recipeId to each item
    for (let i = 0; i < cart.products.length; i++) {
        const product = cart.products[i];
        product.recipeAmount = [{
            recipeId: -1,
            quantity: product.quantity,
        }]
    }

    // Save the cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cart));
    return cart;
}

export function UpdateCart(cart, recipeId) {

    // Get  the old cart items from localStorage
    let oldCart = localStorage.getItem("cartItems");

    const recipeIdConst = recipeId;

    // If the old cart items is not null, parse it
    if (oldCart !== null) {
        oldCart = JSON.parse(oldCart);

        // Go through the old cart items and update the recipeId
        for (let i = 0; i < oldCart.products.length; i++) {
            const product = oldCart.products[i];

            // Store the total old quantity
            let totalOldQuantity = 0;
            for (let j = 0; j < product.recipeAmount.length; j++) {
                totalOldQuantity += product.recipeAmount[j].quantity;
            }

            // Get the new product data from the cart
            const newProduct = cart.products.find((p) => p.productId === product.productId);

            // If the new product is not found, remove the product from the cart
            if (!newProduct) {
                oldCart.products.splice(i, 1);
                i--;
                continue;
            }

            // Store the total new quantity
            let newQuant = newProduct.quantity - totalOldQuantity;
            if(newQuant > 0) {
                product.recipeAmount.push({
                    recipeId: recipeId,
                    quantity: newQuant,
                });
            }

            // Set the new quantity
            product.quantity = newProduct.quantity;
        }

        // Add the new products to the cart
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];

            // Check if the product is already in the cart
            const oldProduct = oldCart.products.find((p) => p.productId === product.productId);

            // If the product is not in the cart, add it to the cart
            if (!oldProduct) {
                product.recipeAmount = [{
                    recipeId: recipeIdConst,
                    quantity: product.quantity,
                }];
                oldCart.products.push(product);
            }
        }

        // Save the updated cart items to localStorage
        localStorage.setItem("cartItems", JSON.stringify(oldCart));
        console.log(oldCart);
    }
}

export async function CheckInCart(itemID, recipeId) {

    // Get the cart
    const cart = await GetCart();


    // Check if the item is already in the cart
    const item = cart.products.find((p) => p.productId === itemID);

    // If the item is in the cart check if the recipeId is already in the cart
    if (item) {
        const recipe = item.recipeAmount.find((r) => r.recipeId === recipeId);
        console.log(recipe);
        return recipe !== undefined;
    }
    return false;
}