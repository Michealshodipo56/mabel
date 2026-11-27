# OJUEWA — The Art of Becoming

An editorial, mobile-responsive beauty studio website built with **Next.js 15, React 19 and TypeScript**.

## Getting started

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

For a typecheck and production build:

```bash
npm run typecheck
npm run build
```

## Pages and features

- Home: large editorial hero, interactive service explorer, beauty story, image gallery, mirror color-grade demonstration and bridal feature
- Services: makeup, hair, manicures and pedicures with service-specific request links
- Gallery: categories and full-size preview
- About and Contact
- Book: guided multistep appointment request

The current images are **editorial references**, not verified OJUEWA projects or clients. The comparison slider demonstrates changes in image grading — **it is not a real before-and-after transformation**. Only replace these images with approved business photography.

## Production setup: booking and contact

The site **must not** claim to save customer submissions on ephemeral hosting. A local SQLite database is supported only in development, while production requires a durable and secure delivery integration.

Set these environment variables in your deployment platform (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `OJUEWA_SUBMISSION_WEBHOOK_URL` | HTTPS endpoint that securely receives and persists requests |
| `OJUEWA_SUBMISSION_WEBHOOK_TOKEN` | Secret token of 24+ characters, validated by your receiver |

A booking request arrives at the endpoint as a JSON object with `kind: "appointment"`, `name`, `phone`, `email`, `services`, `details`, `date`, `time` and `notes`. Contact messages use `kind: "contact"`, `name`, `email`, `message`. The app sends `Authorization: Bearer <token>` and expects a **2xx** HTTP response only after the receiving service has durably accepted the submission. Do not store or print the secret in frontend code, logs or screenshots.

On production without valid webhook configuration, both forms return an explicit **503** response rather than a false success. The webhook receiver is not included: it must be implemented or configured before going live. Add rate limiting, privacy/retention policies and spam controls at the edge or receiver.

`GET /api/health` returns application status and whether delivery is configured, without exposing secrets.

## Quality checks

GitHub Actions runs a TypeScript check and production build on pull requests and pushes to `main`.

## Before going live

1. Add **real**, consent-cleared beauty and studio photographs; verify portfolio items.
2. Confirm actual services, founder story, booking policies, opening hours and contact channels.
3. Connect the secure submission receiver and test delivery end-to-end.
4. Verify mobile, keyboard and screen reader behaviour on deployed pages.
5. Verify production build and browser console, and set the final domain and SEO metadata.

The site is a beauty-services platform, not an online shop. Appointment times shown are **preferences**, not real-time confirmed availability.
