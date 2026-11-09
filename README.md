# Omni Mall

Omni Mall is a Next.js storefront backed by an Express API. The storefront loads its full product catalog from DummyJSON; the API uses a local JSON file for customer accounts, carts, wishlists, stock, and order data. Checkout records an order but does not collect payment.

## Requirements

- Node.js 20 or newer

## Run locally

1. Install and configure the API:

	```powershell
	cd backend
	npm install
	Copy-Item .env.example .env
	```

	Set a random `JWT_SECRET` of at least 32 characters in `backend/.env`. To create an admin account, set `ADMIN_USERNAME` (defaults to `admin`), a unique `ADMIN_EMAIL`, and an `ADMIN_PASSWORD` of at least 8 characters.

2. The API's JSON store is `backend/data/store.json`. Optionally create the admin account from the environment settings:

	```powershell
	cd backend
	npm run seed
	```

	The seed command does not connect to MongoDB or fetch external data. The API's local user, cart, wishlist, and order data are stored in the JSON file. The storefront retrieves its product catalog directly from DummyJSON.

3. Start the API in one terminal:

	```powershell
	npm run dev
	```

4. In another terminal, start the frontend:

	```powershell
	cd Frontend
	npm install
	npm run dev
	```

	The default API URL is `http://localhost:4000/api/v1`. Set `NEXT_PUBLIC_API_URL` in `Frontend/.env.local` to override it. `FRONTEND_ORIGIN` on the backend must contain the allowed frontend origin or a comma-separated list of local origins. Data changes are written back to `backend/data/store.json`; run one API process at a time.

	The catalog uses INR. Seed prices start with the DummyJSON USD sample price, convert at USD 1 = INR 95.269051 (reference rate, 2026-10-27), then apply a category-specific India-market estimate and round to two decimal places. These estimates are starting points, not live competitor quotes; update prices through the admin catalog tools against current local benchmarks. If your database already contains the old USD catalog or a direct-converted INR catalog, back it up and run `npm run migrate:prices:inr` once from `backend`. Do not run that migration on an empty database or after a new seed import. The migration applies category estimates transactionally, converts historical USD order totals to INR only when needed, preserves historical market-estimated prices, and records completion so rerunning it is safe. Prices remain fixed in INR after conversion. For API compatibility, order properties ending in `Cents` now contain paise.

## API

All routes are prefixed with `/api/v1`. Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": { "message": ... } }`.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health |
| POST | `/auth/register` | Public | Create account and sign in |
| POST | `/auth/login` | Public | Sign in with username or email |
| POST | `/auth/logout` | Public | Clear the HttpOnly session cookie |
| GET, PATCH | `/auth/me` | Customer | Read/update profile |
| GET | `/products` | Public | Search, category/price filters, sort, pagination |
| GET | `/products/:id` | Public | Product details and reviews |
| GET | `/products/categories` | Public | Active categories |
| GET, PUT, POST, DELETE | `/cart` and `/cart/*` | Customer | Read, replace, merge, clear cart, remove item |
| GET, POST, DELETE | `/wishlist` and `/wishlist/:id` | Customer | Read and edit wishlist |
| POST, GET | `/orders` | Customer | Place order and list order history |
| GET, POST | `/orders/:id`, `/orders/:id/cancel` | Customer | Read or cancel a pending order |
| GET, POST, PATCH | `/admin/summary`, `/admin/products*`, `/admin/categories*`, `/admin/orders*` | Admin | Catalog and order management |

Authentication uses an HttpOnly, SameSite=Strict JWT cookie; bearer tokens are also accepted by the API. Passwords are bcrypt-hashed. Admin access is assigned only by the seed process, never by signup input. API rate limits, Helmet, CORS, Zod request validation, role checks, and centralized error responses are enabled.

## Tests

<<<<<<< HEAD
Run backend unit and API contract tests with `cd backend; npm test`. The API and tests do not require MongoDB.
=======
Run backend unit and API contract tests with `cd backend; npm test`. They do not require MongoDB. Database connectivity and seeded authenticated checkout require a configured MongoDB instance.
>>>>>>> 77346cf80669f40e7cdd4994e406d12c62e56b63
