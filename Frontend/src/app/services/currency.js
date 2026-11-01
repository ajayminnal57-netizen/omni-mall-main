export const USD_TO_INR_RATE = 95.269051;

export const usdToInr = (usd) => Math.round(Number(usd) * USD_TO_INR_RATE * 100) / 100;

const INDIA_MARKET_CATEGORY_FACTORS = {
    beauty: 0.45,
    fragrances: 0.8,
    furniture: 0.75,
    groceries: 0.35,
    "home-decoration": 0.5,
    "kitchen-accessories": 0.5,
    laptops: 0.9,
    "mens-shirts": 0.5,
    "mens-shoes": 0.75,
    "mens-watches": 0.8,
    "mobile-accessories": 0.55,
    motorcycle: 0.85,
    "skin-care": 0.45,
    smartphones: 0.9,
    "sports-accessories": 0.5,
    sunglasses: 0.6,
    tablets: 0.9,
    tops: 0.5,
    vehicle: 0.9,
    "womens-bags": 0.6,
    "womens-dresses": 0.6,
    "womens-jewellery": 0.55,
    "womens-shoes": 0.5,
    "womens-watches": 0.8,
};

const getIndiaMarketFactor = (category) => {
    const factor = INDIA_MARKET_CATEGORY_FACTORS[category];
    if (factor === undefined) {
        throw new RangeError(`No India-market pricing factor is configured for category "${category}".`);
    }
    return factor;
};

export const indiaMarketPriceFromInr = (price, category) => {
    const value = Number(price);
    if (!Number.isFinite(value) || value < 0) {
        throw new RangeError("Product price must be a non-negative finite number.");
    }
    return Math.round(value * getIndiaMarketFactor(category) * 100) / 100;
};

export const indiaMarketPriceFromUsd = (price, category) => (
    indiaMarketPriceFromInr(usdToInr(price), category)
);

export const restoreInrFromLegacyMarketEstimate = (price, category) => {
    const value = Number(price);
    if (!Number.isFinite(value) || value < 0) {
        throw new RangeError("Product price must be a non-negative finite number.");
    }
    return Math.round(value / getIndiaMarketFactor(category) * 100) / 100;
};

export const SHIPPING_THRESHOLD_INR = Math.round(10000 * USD_TO_INR_RATE) / 100;
export const SHIPPING_FEE_INR = Math.round(895 * USD_TO_INR_RATE) / 100;

export const formatInr = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(Number(amount) || 0);

export const formatInrPaise = (paise) => formatInr(Number(paise) / 100);
