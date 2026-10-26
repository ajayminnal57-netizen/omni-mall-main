## Omni Mall

Omni Mall is a home and lifestyle storefront built with Next.js. The home page introduces the collection, offers category browsing, and links to featured products. The collection supports search, category filtering, and sorting; product pages show details and customer reviews; and the cart supports quantity changes and removal.

### Run locally

```bash
npm install
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000). Configure and start the API first; setup instructions and API routes are in the repository [README](../README.md).

### API URL

The frontend defaults to `http://localhost:4000/api/v1`. Set `NEXT_PUBLIC_API_URL` in `.env.local` to use another API origin.

### Checkout

Checkout requires an account and records orders using server-verified prices and stock. It does not process payments; configure a trusted payment provider before accepting payment details or treating orders as paid.
