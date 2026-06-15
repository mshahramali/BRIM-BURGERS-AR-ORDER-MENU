# Brim Burgers — QR-to-Kitchen Ordering System

## What's in this package
- `index.html` — your AR menu, now with a cart, table detection, "Send Order" (WhatsApp + live dashboard), and a status screen that buzzes the phone when food is ready.
- `dashboard.html` — kitchen/counter screen showing live orders by table with Start / Ready / Served buttons.
- `firebase-config.js` — shared connection settings + order logic (edit this, used by both pages).

## 1. Set up Firebase (5 minutes, free)
1. Go to https://console.firebase.google.com → "Add project" → name it (e.g. `brim-burgers`).
2. Build → Realtime Database → Create Database → start in **test mode**.
3. In Database → Rules, paste:
```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    }
  }
}
```
4. Project settings (gear icon) → General → scroll to "Your apps" → Add app → Web (`</>`) → register, no hosting needed.
5. Copy the `firebaseConfig` object it shows you.
6. Open `firebase-config.js` and replace the placeholder `firebaseConfig` object at the top with the one you copied.

## 2. Deploy
Put all three files (`index.html`, `dashboard.html`, `firebase-config.js`) in the same folder/repo as your existing GitHub Pages site (replacing the current `index.html`). Push — GitHub Pages serves both pages automatically.

- Customer menu: `https://mshahramali.github.io/BRIM-BURGERS-AR-ORDER-MENU/?table=07`
- Kitchen dashboard: `https://mshahramali.github.io/BRIM-BURGERS-AR-ORDER-MENU/dashboard.html`

## 3. QR codes per table
Each table needs its own QR pointing to:
```
https://mshahramali.github.io/BRIM-BURGERS-AR-ORDER-MENU/?table=01
https://mshahramali.github.io/BRIM-BURGERS-AR-ORDER-MENU/?table=02
...
```
Generate these at https://www.qr-code-generator.com or via the same `api.qrserver.com` URL pattern used in the page (just change `table=07` to the table number).

## 4. WhatsApp number
The WhatsApp deep link is set to `923300353329` (+92 330 0353329) in `index.html`. To change it, edit the `BRIM_WHATSAPP` constant near the top of the `<script>` section.

Note: `wa.me` opens a chat with that number and pre-fills the order text — the customer still has to tap "Send" in WhatsApp. This is the part that needs no backend at all and works as a guaranteed fallback even if Firebase is down.

## 5. How the demo flows
1. Scan the table's QR → AR menu opens, "TABLE 07" shows in the header.
2. Customer taps items/sizes → cart bar appears at the bottom.
3. Tap "View Order" → review cart, adjust quantities.
4. Tap "Send Order to Kitchen":
   - Order is pushed to Firebase (instantly visible on the dashboard, grouped by table).
   - WhatsApp opens with a pre-filled order summary as backup.
   - Customer sees a live status screen ("Sent to the kitchen").
5. On the kitchen dashboard, tap **Start** → customer's screen updates to "Cooking it up".
6. Tap **Ready** → customer's phone **vibrates + plays a buzzer sound** and the screen turns green with "Order Ready!".
7. Tap **Served** to clear it from the active view.

## 6. Demo tips
- Keep the customer's phone screen on and the tab open during the demo — the buzz fires via the open page (works on Android Chrome reliably; iOS Safari may need the tab in foreground).
- Open the dashboard on a laptop/tablet next to you so Brim's team can see the "counter view" live while you trigger statuses from your phone.
- For the real AR models, replace the placeholder `Astronaut.glb` URLs in `index.html` with your actual burger `.glb`/`.usdz` model files — currently every item points to the same demo model.

## 7. Known limitations to mention to Brim (be upfront in the demo)
- The buzz works while the order-status page is open. For a true "buzzes even if phone is locked/app closed" experience like a physical pager, the menu would need to become an installable PWA with push notification permission — a follow-on step, not needed for this demo.
- WhatsApp messages land in Brim's normal WhatsApp inbox; a fuller version could use the WhatsApp Cloud API to auto-log messages into the dashboard too, removing the manual "tap send" step.
- Firebase free tier (Spark plan) comfortably covers a single restaurant's order volume for this kind of use.
