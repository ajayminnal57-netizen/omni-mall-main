# Omni Mall

Omni Mall is a Next.js storefront backed by an Express API and MongoDB. The API owns product data, customer accounts, carts, wishlists, stock, and order totals. Checkout records an order but does not collect payment.

## Requirements

- Node.js 20 or newer
- MongoDB 6 or newer (local or hosted)

## Run locally

1. Install and configure the API:

	```powershell
	cd backend
	npm install
	Copy-Item .env.example .env
	```

	Set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters in `backend/.env`. To create an admin during seeding, also set a unique `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters; both are optional for catalog-only seeding.

2. With MongoDB running, import the starter catalog and, if configured, create the admin account:

	```powershell
	cd backend
	npm run seed
	```

	The seed command imports the current catalog from DummyJSON only when the local product collection is empty. The app itself does not fetch catalog data from DummyJSON.

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

	The default API URL is `http://localhost:4000/api/v1`. Set `NEXT_PUBLIC_API_URL` in `Frontend/.env.local` to override it. `FRONTEND_ORIGIN` on the backend must contain the allowed frontend origin or a comma-separated list of local origins.

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

Authentication uses an HttpOnly, SameSite=Strict JWT cookie; Bearer tokens are also accepted by the API. Passwords are bcrypt-hashed. Admin access is assigned only by the seed process or trusted database administration, never by signup input. API rate limits, Helmet, CORS, Zod request validation, role checks, and centralized error responses are enabled.

## Tests

Run backend unit and API contract tests with `cd backend; npm test`. They do not require MongoDB. Database connectivity and seeded authenticated checkout require a configured MongoDB instance.

