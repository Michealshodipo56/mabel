# OJUEWA beauty service catalogue and email booking

## Editing the service menu
Update `lib/catalog.ts`. Every treatment has a unique ID, category, display name, description, `priceNgn`, and `confirmed` flag. Prices are in whole Nigerian naira, not kobo. `null` means the rate is not provided and displays **Price to be confirmed**. Do not replace it with invented rates.

The initial studio brief confirms makeup, hairstyling, hair installation, manicure, nail styling, pedicure, and foot care. Braiding, gel manicure, nail art and lash services were requested as possible menu items but must be checked with the business; they display an availability disclaimer until `confirmed: true` is appropriate.

The Services page renders all treatments, while the Book page supports choosing multiple treatments, preferred date/time and contact details. The server **never trusts price values submitted by a browser**: it derives the quote from the catalogue.

## Email delivery
The bookings API uses the Resend HTTP API (no added npm dependency). Set these server-only Vercel environment variables:

- `RESEND_API_KEY`: secret API key from Resend.
- `OJUEWA_BOOKING_EMAIL`: the actual studio inbox (provided by the owner).
- `OJUEWA_FROM_EMAIL`: verified sending domain/address configured in Resend.

Once all are configured and the deployment is redeployed, `POST /api/appointments` emails the shop the visitor's name, phone, email, treatments, per-treatment prices, calculated subtotal/total or pending quote, preferred date/time in Nigeria, and notes.

Until configured, bookings respond with **503** and an explicit error rather than incorrectly claiming an email has been delivered. Date and time are preferred slots only. There is no calendar availability integration or payment processing yet.

Contact messages still use the separately configurable webhook described in `DEPLOYMENT.md`.

Before live use, implement rate limiting/bot prevention and consent/privacy notice, validate all final prices and services, and test actual delivery with the studio's inbox.
