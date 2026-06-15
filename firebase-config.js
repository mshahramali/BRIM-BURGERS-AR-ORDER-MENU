// ============================================================
// BRIM BURGERS — FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyDdYglcfFJFknS8-PPad0yRh7hjHxdbIfk",
  authDomain: "brim-order-system-ar-menu.firebaseapp.com",
  databaseURL: "https://brim-order-system-ar-menu-default-rtdb.firebaseio.com",
  projectId: "brim-order-system-ar-menu",
  storageBucket: "brim-order-system-ar-menu.firebasestorage.app",
  messagingSenderId: "1095828636489",
  appId: "1:1095828636489:web:639499376a253acde25098"
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
