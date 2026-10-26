const CART_STORAGE_KEY = 'omni-mall-cart';
const CART_CHANGE_EVENT = 'omni-mall-cart-change';

export const getCartSnapshot = () => {
    if (typeof window === 'undefined') return '[]';
    return window.localStorage.getItem(CART_STORAGE_KEY) || '[]';
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