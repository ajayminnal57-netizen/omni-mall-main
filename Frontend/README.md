## Omni Mall

Omni Mall is a home and lifestyle storefront built with Next.js. The home page introduces the collection, offers category browsing, and links to featured products. The collection supports search, category filtering, and sorting; product pages show details and customer reviews; and the cart supports quantity changes and removal.

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Product data

The storefront currently reads product data from the public DummyJSON products API. An internet connection is required to load the catalog.

### Checkout limitations

Checkout is a local demo flow. It does not charge a payment method, submit an order to a server, or persist order history. Connect a trusted payment provider and order API before accepting real orders. The login and signup pages are presentation-only until an authentication provider is configured.
