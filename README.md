# Elevate Sports KE — website starter

A responsive, static storefront concept for Elevate Sports KE. It includes a product grid with category filters, a persistent shopping bag, and an order-summary handoff to WhatsApp.

## Preview

Open `index.html` in a browser, or serve this folder with any static web server. No build step or dependencies are required.

## Before launch

- Replace the demo products, KSh prices, product copy, and Unsplash images in `script.js` with the actual catalog. The product content is illustrative, not confirmed inventory.
- Set `WHATSAPP_NUMBER` in `script.js` to the business WhatsApp number in international format without `+` or spaces (for example, `2547XXXXXXXX`). Until configured, checkout displays a setup reminder.
- Confirm delivery options, fees, sizing, returns, and payment details with the business and add them to the customer-facing copy.
- The included Google Fonts and Unsplash photos are loaded externally; replace or self-host assets if preferred.

## Files

- `index.html` — storefront structure and content
- `styles.css` — responsive visual design
- `script.js` — starter catalog, filtering, local cart, and WhatsApp order link

This front end does not process payments or send/store orders on a server. WhatsApp checkout opens a prefilled message for the customer to confirm with the business.
