This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test Stripe payments, enable Stripe CLI listening on localhost:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```