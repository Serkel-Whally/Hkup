Customers can:
• Browse products or bundles
• Select an offer
• Enter their phone number
• Place an order
• Choose a payment method
• Contact the seller(Admin) through WhatsApp
• View order status

# xBundle: what's been built so far

A single-page shop for buying mobile data bundles in Ghana, covering MTN, Telecel and AirtelTigo.

## Look and feel
- Dark, near-black background with an electric-lime accent and an amber "Hot" highlight.
- Bold Unbounded headings with clean Manrope body text.
- Each network has its own colour: MTN yellow, Telecel red, AirtelTigo blue.
- Glowing buttons, soft glass panels, a floating phone image and a scrolling ticker.

## Page sections (top to bottom)
1. **Header**: xBundle logo, links to each section, and a "Buy data" button. It stays pinned at the top.
2. **Hero**: the headline "Data that moves at your speed.", a phone number box and a "Get data" button.
   - It detects the network as you type (for example 024 shows MTN).
   - Pressing "Get data" switches to that network's bundles and scrolls down to them.
   - Small cards show a "Just delivered 10GB" example and a "From GH₵4.50" price.
3. **Scrolling ticker**: MTN, Telecel, AirtelTigo, No expiry, Instant, Mobile Money, 24/7.
4. **Bundles**: tabs for each network, with 8 bundle cards per network.
   - Each card shows the size, price, validity, price per GB and a "Hot" tag on popular bundles.
   - Tapping a card opens checkout.
5. **How it works**: four steps (enter number, pick a bundle, pay with MoMo, get connected).
6. **Why xBundle**: speed (under 60 seconds), cheaper than USSD, no-expiry bundles and 24/7 support, plus a row of stats.
7. **FAQ**: five common questions that open and close.
8. **Footer**: a "Running low? Top up now." banner with a button, plus the logo and copyright.

## Checkout pop-up
- Shows the chosen bundle, the recipient number (filled in from the hero box), a choice of Mobile Money or Card, and the total.
- Checks the number:
  - It must be 10 digits.
  - It must belong to a known network.
  - It must match the bundle's network; for example, an MTN bundle can't go to a Telecel number.
- Pressing "Pay" shows a waiting screen, then a success screen with an order reference and a confirmation notice.

## Current prices (placeholders, awaiting your real list)
- MTN (no expiry): 1GB GH₵5.50, 2GB 10.50, 3GB 15, 5GB 24, 10GB 45, 15GB 66, 20GB 86, 50GB 205.
- Telecel (30 days): 2GB 11, 5GB 25, 10GB 46, 15GB 68, 20GB 89, 30GB 130, 40GB 170, 50GB 210.
- AirtelTigo (no expiry): 1GB 4.50, 2GB 9, 4GB 17, 5GB 21, 10GB 40, 15GB 59, 20GB 78, 50GB 190.

## Not real yet
- Payment is simulated: no money moves and no data is delivered.
- There are no customer accounts, no saved orders and no admin area.
- The stats (120K+ customers, 99.8% success and so on) and the support claims are placeholder text.

## Technical details
- One page in `src/routes/index.tsx`; the sections live in `src/components/xbundle/`.
- The design is defined in `src/styles.css` (colour, gradient, glow and animation settings).
- The bundle list, network prefixes and phone checks are in `src/lib/bundles.ts`, covered by 5 passing tests.
  - MTN: 024, 025, 053, 054, 055, 059.
  - Telecel: 020, 050.
  - AirtelTigo: 026, 027, 056, 057.
  - Numbers starting with +233 are accepted.
- There is no backend yet; everything runs in the browser.
