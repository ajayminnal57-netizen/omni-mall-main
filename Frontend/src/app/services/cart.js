import {
    indiaMarketPriceFromInr,
    indiaMarketPriceFromUsd,
} from "./currency";

const CART_STORAGE_KEY = 'omni-mall-cart';
const CART_OWNER_KEY = 'omni-mall-cart-owner';
const CART_CHANGE_EVENT = 'omni-mall-cart-change';
const CART_CURRENCY_VERSION_KEY = 'omni-mall-cart-currency-version';
const CART_CURRENCY_VERSION = 'india-market-v3';

export const getCartSnapshot = () => {
    if (typeof window === 'undefined') return '[]';
    let snapshot = window.localStorage.getItem(CART_STORAGE_KEY) || '[]';
    const storedCurrencyVersion = window.localStorage.getItem(CART_CURRENCY_VERSION_KEY);
    if (storedCurrencyVersion !== CART_CURRENCY_VERSION) {
        try {
            const cart = JSON.parse(snapshot);
            if (Array.isArray(cart)) {
                snapshot = JSON.stringify(cart.map((item) => ({
                    ...item,
                    price: storedCurrencyVersion === 'india-market-v2'
                        ? item.price
                        : storedCurrencyVersion === 'inr-v1' || storedCurrencyVersion === 'inr-v2'
                            ? indiaMarketPriceFromInr(item.price, item.category)
                            : indiaMarketPriceFromUsd(item.price, item.category),
                })));
                window.localStorage.setItem(CART_STORAGE_KEY, snapshot);
            }
            window.localStorage.setItem(CART_CURRENCY_VERSION_KEY, CART_CURRENCY_VERSION);
        } catch (error) {
            console.error("Unable to migrate saved cart prices to the India-market estimates.", error);
        }
    }
    return snapshot;
};

export const parseCartSnapshot = (snapshot) => {
    try {
        const cart = JSON.parse(snapshot);
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
};

export const subscribeToCart = (callback) => {
    window.addEventListener(CART_CHANGE_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(CART_CHANGE_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
};

export const readCart = () => {
    return parseCartSnapshot(getCartSnapshot());
};

export const getCartOwner = () => (
    typeof window === 'undefined' ? null : window.localStorage.getItem(CART_OWNER_KEY)
);

export const setCartOwner = (userId) => {
    if (typeof window === 'undefined') return;
    if (userId) window.localStorage.setItem(CART_OWNER_KEY, userId);
    else window.localStorage.removeItem(CART_OWNER_KEY);
};

const writeCart = (cart) => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    return cart;
};

export const addToCart = (product) => {
    const cart = readCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        return writeCart(cart.map((item) => (
            item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, item.stock ?? Infinity) }
                : item
        )));
    }

    return writeCart([...cart, { ...product, quantity: 1 }]);
};

export const setCartItemQuantity = (productId, quantity) => {
    const cart = readCart();

    if (quantity <= 0) {
        return writeCart(cart.filter((item) => item.id !== productId));
    }

    return writeCart(cart.map((item) => (
        item.id === productId
            ? { ...item, quantity: Math.min(quantity, item.stock ?? Infinity) }
            : item
    )));
};

export const removeFromCart = (productId) => (
    writeCart(readCart().filter((item) => item.id !== productId))
);

export const clearCart = () => writeCart([]);

export const replaceCart = (cart) => writeCart(cart);