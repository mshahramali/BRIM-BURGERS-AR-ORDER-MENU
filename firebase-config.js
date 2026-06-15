// ============================================================
// BRIM BURGERS — FIREBASE CONFIG
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a project (e.g. "brim-burgers-orders")
// 3. Build > Realtime Database > Create Database
//    - Start in TEST MODE for the demo (locks down later)
// 4. Project settings > General > Your apps > Add app (Web "</>")
// 5. Copy the config object it gives you and paste below.
//
// Realtime Database rules for the demo (Database > Rules tab):
// {
//   "rules": {
//     "orders": {
//       ".read": true,
//       ".write": true
//     }
//   }
// }
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize (compat SDK loaded via CDN script tags in each HTML file)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================================
// Shared helper functions
// ============================================================

// Push a new order to Firebase
function submitOrder(order) {
  // order = { table, items: [{name, qty, price, variant}], total, status, createdAt }
  const ref = db.ref('orders').push();
  order.id = ref.key;
  order.status = 'received';
  order.createdAt = Date.now();
  return ref.set(order).then(() => order.id);
}

// Listen to a single order's status (used by customer page for the buzz)
function listenToOrder(orderId, callback) {
  db.ref('orders/' + orderId).on('value', (snapshot) => {
    callback(snapshot.val());
  });
}

// Listen to ALL orders (used by kitchen dashboard)
function listenToAllOrders(callback) {
  db.ref('orders').on('value', (snapshot) => {
    const orders = [];
    snapshot.forEach((child) => {
      orders.push(child.val());
    });
    // newest first
    orders.sort((a, b) => b.createdAt - a.createdAt);
    callback(orders);
  });
}

// Update an order's status (used by kitchen dashboard)
function updateOrderStatus(orderId, status) {
  return db.ref('orders/' + orderId).update({
    status: status,
    updatedAt: Date.now()
  });
}

// Build the WhatsApp deep link with order details
function buildWhatsAppLink(phone, order) {
  let msg = `*New Order — Table ${order.table}*\n\n`;
  order.items.forEach(it => {
    msg += `${it.qty}x ${it.name}${it.variant ? ' (' + it.variant + ')' : ''} — Rs.${it.price * it.qty}\n`;
  });
  msg += `\n*Total: Rs.${order.total}*`;
  msg += `\nOrder ID: ${order.id}`;
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${phone}?text=${encoded}`;
}
