// =============================================
// Project: Digital Restaurant Order Manager
// Analiza B. Minulas, 2411156
// Pia Jane R. Lastrollo, 2410977
// Mark Andrew B. Llagas, 2411506
// Vincent L. Hermoso, 2410962
// Angelo Jay P. Mondejar, 2411018
// Date: December 16, 2025
// Description: Web-based restaurant order system using Queue, Map, and Array data structures for order management.
// =============================================

// ========== DATA STRUCTURES ==========
/**
 * Array to store active orders that are currently being processed.
 * Orders are sorted by creation time for FIFO display.
 */
const activeOrders = [];

/**
 * Array to store completed or cancelled orders for history tracking.
 * Used for reporting and searching past orders.
 */
const history = [];

/**
 * Queue class for FIFO (First-In-First-Out) order processing in the kitchen.
 * Used to manage the sequence of orders being prepared.
 */
class Queue {
  constructor() {
    this.items = [];
  }

  /**
   * Adds an item to the end of the queue.
   * @param {*} item - The item to enqueue.
   */
  enqueue(item) {
    this.items.push(item);
  }

  /**
   * Removes and returns the item at the front of the queue.
   * @returns {*} The dequeued item, or undefined if empty.
   */
  dequeue() {
    return this.items.shift();
  }

  /**
   * Returns the item at the front of the queue without removing it.
   * @returns {*} The front item, or undefined if empty.
   */
  peek() {
    return this.items[0];
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} True if empty, false otherwise.
   */
  isEmpty() {
    return this.items.length === 0;
  }
}
const kitchenQueue = new Queue();

/**
 * Map for fast lookup of orders by ID.
 * Key: order ID (string), Value: order object.
 */
const ordersMap = new Map();

/**
 * Stack for undo functionality.
 * Stores actions to allow reversal of recent operations.
 */
const undoStack = [];

// MENU with pictures + availability (your menu)
const MENU = [
  // Starters
  { id: "garlic_bread", name: "Garlic Bread", price: 80, image: "img/garlic-bread.jpg", available: true, category: "Starters" },
  { id: "caesar_salad", name: "Caesar Salad", price: 150, image: "img/caesar-salad.jpg", available: true, category: "Starters" },
  { id: "chicken_soup", name: "Chicken Soup", price: 120, image: "img/chicken-soup.jpg", available: true, category: "Starters" },

  // Main Dishes
  { id: "grilled_chicken_rice", name: "Grilled Chicken with Rice", price: 180, image: "img/grilled-chicken-rice.jpg", available: true, category: "Main" },
  { id: "beef_steak", name: "Beef Steak (Sirloin)", price: 250, image: "img/beef-steak.jpg", available: true, category: "Main" },
  { id: "pork_bbq_platter", name: "Pork BBQ Platter", price: 200, image: "img/pork-bbq.jpg", available: true, category: "Main" },

  // Pasta
  { id: "spag_bolo", name: "Spaghetti Bolognese", price: 160, image: "img/spaghetti-bolognese.jpg", available: true, category: "Pasta" },
  { id: "carbonara", name: "Carbonara", price: 170, image: "img/carbonara.jpg", available: true, category: "Pasta" },
  { id: "pesto_pasta", name: "Pesto Pasta", price: 180, image: "img/pesto-pasta.jpg", available: true, category: "Pasta" },

  // Burgers & Sandwiches
  { id: "classic_beef_burger", name: "Classic Beef Burger", price: 120, image: "img/classic-beef-burger.jpg", available: true, category: "Burgers" },
  { id: "chicken_sandwich", name: "Chicken Sandwich", price: 110, image: "img/chicken-sandwich.jpg", available: true, category: "Burgers" },
  { id: "bacon_cheeseburger", name: "Bacon Cheeseburger", price: 150, image: "img/bacon-cheeseburger.jpg", available: true, category: "Burgers" },

  // Drinks
  { id: "iced_tea", name: "Iced Tea", price: 40, image: "img/iced-tea.jpg", available: true, category: "Drinks" },
  { id: "softdrinks", name: "Softdrinks", price: 35, image: "img/softdrinks.jpg", available: true, category: "Drinks" },
  { id: "fresh_lemonade", name: "Fresh Lemonade", price: 60, image: "img/fresh-lemonade.jpg", available: true, category: "Drinks" },

  // Desserts
  { id: "choco_cake_slice", name: "Chocolate Cake Slice", price: 90, image: "img/choco-cake-slice.jpg", available: true, category: "Desserts" },
  { id: "mango_float", name: "Mango Float", price: 85, image: "img/mango-float.jpg", available: true, category: "Desserts" },
  { id: "icecream_scoop", name: "Ice Cream (1 scoop)", price: 35, image: "img/icecream-scoop.jpg", available: true, category: "Desserts" },

  // Pinoy Ulam
  { id: "adobo", name: "Adobo (Chicken/Pork)", price: 120, image: "img/adobo.jpg", available: true, category: "Ulam" },
  { id: "sinigang_baboy", name: "Sinigang na Baboy", price: 140, image: "img/sinigang-baboy.jpg", available: true, category: "Ulam" },
  { id: "kare_kare", name: "Kare-Kare", price: 180, image: "img/kare-kare.jpg", available: true, category: "Ulam" },
  
  // Silog Meals
  { id: "tapsilog", name: "Tapsilog", price: 95, image: "img/tapsilog.jpg", available: true, category: "Silog Meals" },
  { id: "longsilog", name: "Longsilog", price: 85, image: "img/longsilog.jpg", available: true, category: "Silog Meals" },
  { id: "tocilog", name: "Tocilog", price: 85, image: "img/tocilog.jpg", available: true, category: "Silog Meals" },

  // Extras (separate category)
  { id: "plain_rice", name: "Plain Rice", price: 20, image: "img/plain-rice.jpg", available: true, category: "Extras" },
  { id: "garlic_rice", name: "Garlic Rice", price: 25, image: "img/garlic-rice.jpg", available: true, category: "Extras" },
  { id: "egg", name: "Egg", price: 15, image: "img/egg.jpg", available: true, category: "Extras" }
];

// ========== UI ELEMENTS ==========
const tableNoSelect = document.getElementById("tableNo");
const itemSelect = document.getElementById("itemSelect");
const qtyInput = document.getElementById("qty");
const modifierSelect = document.getElementById("modifier");
const addItemBtn = document.getElementById("addItemBtn");
const currentItemsText = document.getElementById("currentItemsText");
const orderForm = document.getElementById("orderForm");
const activeOrdersList = document.getElementById("activeOrdersList");
const kitchenQueueList = document.getElementById("kitchenQueueList");
const historyList = document.getElementById("historyList");
const processNextBtn = document.getElementById("processNextBtn");
const undoBtn = document.getElementById("undoBtn");
const activeCountBadge = document.getElementById("activeCountBadge");
const summaryBar = document.getElementById("summaryBar");
const totalOrdersSpan = document.getElementById("totalOrdersSpan");
const deliveredSpan = document.getElementById("deliveredSpan");
const cancelledSpan = document.getElementById("cancelledSpan");
const totalOrdersPopup = document.getElementById("totalOrdersPopup");
const closeTotalPopup = document.getElementById("closeTotalPopup");
const totalOrdersList = document.getElementById("totalOrdersList");
const deliveredPopup = document.getElementById("deliveredPopup");
const closeDeliveredPopup = document.getElementById("closeDeliveredPopup");
const deliveredOrdersList = document.getElementById("deliveredOrdersList");
const cancelledPopup = document.getElementById("cancelledPopup");
const closeCancelledPopup = document.getElementById("closeCancelledPopup");
const cancelledOrdersList = document.getElementById("cancelledOrdersList");
const menuGrid = document.getElementById("menuGrid");
const historySearch = document.getElementById("historySearch");
const dailySummary = document.getElementById("dailySummary");

// Temporary items for current order
let tempItems = [];

// ========== HELPERS ==========
/**
 * Generates a unique order ID using timestamp and random number.
 * Format: ORD-[base36 timestamp]-[random 3-digit number]
 * @returns {string} Unique order ID.
 */
function generateOrderID() {
  return "ORD-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1000);
}

/**
 * Returns the current time in locale string format.
 * @returns {string} Current timestamp.
 */
function getTimestamp() {
  return new Date().toLocaleTimeString();
}

/**
 * Returns today's date in ISO format (YYYY-MM-DD).
 * @returns {string} Today's date string.
 */
function getTodayDateString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * Computes the total price of order items.
 * Uses array reduce to sum up price * quantity for each item.
 * @param {Array} items - Array of order items with itemID and qty.
 * @returns {number} Total price.
 */
function computeTotal(items) {
  return items.reduce((sum, it) => {
    const menuItem = MENU.find(m => m.id === it.itemID);
    return sum + (menuItem ? menuItem.price * it.qty : 0);
  }, 0);
}

/**
 * Sorts active orders by creation time (FIFO order).
 * Uses array sort with date comparison.
 */
function sortActiveOrders() {
  activeOrders.sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Updates the summary bar with total, delivered, and cancelled order counts.
 * Filters history array to count statuses.
 */
function updateSummary() {
  const total = history.length;
  const delivered = history.filter(o => o.status === "Delivered").length;
  const cancelled = history.filter(o => o.status === "Cancelled").length;
  totalOrdersSpan.textContent = `Total orders: ${total}`;
  deliveredSpan.textContent = `Delivered: ${delivered}`;
  cancelledSpan.textContent = `Cancelled: ${cancelled}`;
  updateDailySummary();
}

/**
 * Updates the daily summary with today's order count and total revenue.
 * Iterates through history to sum today's orders.
 */
function updateDailySummary() {
  const today = getTodayDateString();
  let count = 0;
  let total = 0;

  history.forEach(order => {
    if (order.date === today) {
      count++;
      total += computeTotal(order.items);
    }
  });

  dailySummary.innerHTML = `<span class="small-text">Today: ${count} orders • ₱${total} total</span>`;
}

// ========== RENDER ==========
function renderTempItems() {
  if (tempItems.length === 0) {
    currentItemsText.textContent = "No items added yet.";
    return;
  }
  const text = tempItems
    .map(it => {
      const menuItem = MENU.find(m => m.id === it.itemID);
      return `${it.qty}x ${menuItem ? menuItem.name : it.itemID}`;
    })
    .join(", ");
  currentItemsText.textContent = "Current items: " + text;
}

function renderActiveOrders() {
  activeCountBadge.textContent = `${activeOrders.length} active`;
  activeOrdersList.innerHTML = "";
  activeOrders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const statusClass =
      order.status === "Received"
        ? "status-received"
        : order.status === "Preparing"
        ? "status-preparing"
        : order.status === "Ready"
        ? "status-ready"
        : "status-delivered";

    const itemsText = order.items
      .map(it => {
        const menuItem = MENU.find(m => m.id === it.itemID);
        return `${it.qty}x ${menuItem ? menuItem.name : it.itemID}`;
      })
      .join(", ");

    card.innerHTML = `
      <div class="order-header">
        <div>
          <span class="small-text">OrderID:</span> <strong>${order.id}</strong><br>
          <span>Table ${order.table || "Takeout"}</span>
        </div>
        <span class="order-status ${statusClass}">${order.status}</span>
      </div>
      <div class="order-items">${itemsText}</div>
      <div class="order-footer">
        <span>₱${computeTotal(order.items)} • ${order.timestamp}</span>
        <div class="order-actions">
          <button class="btn secondary" data-action="setReady" data-id="${order.id}">Ready</button>
          <button class="btn danger" data-action="cancel" data-id="${order.id}">Cancel</button>
        </div>
      </div>
    `;
    activeOrdersList.appendChild(card);
  });
}

function renderKitchenQueue() {
  kitchenQueueList.innerHTML = "";
  kitchenQueue.items.forEach(order => {
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
      <div class="order-header">
        <div>
          <span class="small-text">OrderID:</span> <strong>${order.id}</strong><br>
          <span>Table ${order.table || "Takeout"}</span>
        </div>
        <span class="order-status status-received">Queued</span>
      </div>
      <div class="order-items small-text">
        ${order.items
          .map(it => {
            const menuItem = MENU.find(m => m.id === it.itemID);
            return `${it.qty}x ${menuItem ? menuItem.name : it.itemID}`;
          })
          .join(", ")}
      </div>
    `;
    kitchenQueueList.appendChild(div);
  });
}

function getFilteredHistory() {
  const query = historySearch.value.trim().toLowerCase();
  if (!query) return history;

  return history.filter(order => {
    const id = order.id.toLowerCase();
    const tableText = (order.table ? `table ${order.table}` : "takeout").toLowerCase();
    const typeText = (order.modifier || (order.isTakeout ? "takeout" : "dine-in")).toLowerCase();
    return (
      id.includes(query) ||
      tableText.includes(query) ||
      typeText.includes(query)
    );
  });
}

function renderHistory() {
  const data = getFilteredHistory();
  historyList.innerHTML = "";
  data
    .slice()
    .reverse()
    .forEach(order => {
      const div = document.createElement("div");
      div.className = "order-card";
      const statusClass =
        order.status === "Delivered"
          ? "status-delivered"
          : order.status === "Cancelled"
          ? "status-delivered"
          : "status-ready";

      const showPickupButton = order.isTakeout && order.status === "Ready" && !order.pickedUp;

      div.innerHTML = `
        <div class="order-header">
          <div>
            <span class="small-text">OrderID:</span> <strong>${order.id}</strong><br>
            <span>Table ${order.table || "Takeout"}</span>
          </div>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>
        <div class="order-footer">
          <span>₱${computeTotal(order.items)} • ${order.timestamp}</span>
          <span class="small-text">${order.statusNote || ""}</span>
        </div>
        ${
          showPickupButton
            ? `<div style="margin-top:6px; text-align:right;">
                 <button class="btn secondary" data-history-action="pickup" data-id="${order.id}">
                   Mark as Picked Up
                 </button>
               </div>`
            : ""
        }
      `;
      historyList.appendChild(div);
    });
}

function initMenuCards() {
  // Render menu grouped by category in a compact layout
  menuGrid.innerHTML = "";
  const categoryOrder = ["Starters", "Main", "Pasta", "Burgers", "Drinks", "Desserts", "Ulam", "Silog Meals", "Extras"];

  categoryOrder.forEach(cat => {
    const items = MENU.filter(m => m.category === cat);
    if (items.length === 0) return;

    const section = document.createElement('div');
    section.className = 'menu-section';
    section.innerHTML = `<div class="menu-section-title">${cat}</div>`;

    const grid = document.createElement('div');
    grid.className = 'menu-grid menu-grid-compact';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card compact' + (item.available ? '' : ' unavailable');

      const statusBadgeClass = item.available ? 'menu-status-available' : 'menu-status-unavailable';
      const statusText = item.available ? 'Available' : 'Unavailable';
      const disabledAttr = item.available ? '' : 'disabled';

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-card-body">
          <div class="menu-card-name-row">
            <div class="menu-card-name">${item.name}</div>
            <span class="menu-status-badge ${statusBadgeClass}">${statusText}</span>
          </div>
          <div class="menu-card-price">₱${item.price}</div>
          <div class="menu-card-actions">
            <button class="btn menu-card-btn" data-id="${item.id}" ${disabledAttr}>${item.available ? 'Add' : 'Unavailable'}</button>
            <button class="btn small" data-toggle="${item.id}">${item.available ? 'Mark Unavailable' : 'Mark Available'}</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
    menuGrid.appendChild(section);
  });

  refreshMenuDropdown();
}

// Dropdown options respect availability
function refreshMenuDropdown() {
  // Build optgroups by category for clearer selection
  itemSelect.innerHTML = "";
  const categories = Array.from(new Set(MENU.map(m => m.category)));
  categories.forEach(cat => {
    const group = document.createElement('optgroup');
    group.label = cat;
    MENU.filter(m => m.category === cat).forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.name} (₱${item.price})${item.available ? '' : ' - Unavailable'}`;
      if (!item.available) opt.disabled = true;
      group.appendChild(opt);
    });
    itemSelect.appendChild(group);
  });
}

// ========== CORE OPERATIONS ==========
function createOrder(tableNo, items, modifier) {
  const orderID = generateOrderID();
  const now = new Date();
  const isTakeout = modifier === "Takeout";
  const today = getTodayDateString();

  const order = {
    id: orderID,
    table: isTakeout ? null : tableNo,
    items: items.slice(),
    status: "Received",
    timestamp: getTimestamp(),
    createdAt: now,
    date: today,
    modifier: modifier || "",
    isTakeout: isTakeout,
    pickedUp: false
  };

  if (modifier && modifier !== "Takeout") {
    order.items.push({ itemID: "modifier", qty: 1, note: modifier });
  }

  activeOrders.push(order);
  kitchenQueue.enqueue(order);
  ordersMap.set(orderID, order);

  undoStack.push({
    type: "CREATE_ORDER",
    payload: { orderID }
  });

  sortActiveOrders();
  saveToLocalStorage();
  renderActiveOrders();
  renderKitchenQueue();
}

function cancelOrder(orderID) {
  const order = ordersMap.get(orderID);
  if (!order) return;

  order.status = "Cancelled";
  order.statusNote = "Cancelled by staff";

  const index = activeOrders.findIndex(o => o.id === orderID);
  if (index !== -1) {
    activeOrders.splice(index, 1);
  }

  const qIndex = kitchenQueue.items.findIndex(o => o.id === orderID);
  if (qIndex !== -1) {
    kitchenQueue.items.splice(qIndex, 1);
  }

  history.push(order);

  undoStack.push({
    type: "CANCEL_ORDER",
    payload: { order }
  });

  updateSummary();
  saveToLocalStorage();
  renderActiveOrders();
  renderKitchenQueue();
  renderHistory();
}

function setOrderReady(orderID) {
  const order = ordersMap.get(orderID);
  if (!order) return;

  const previousStatus = order.status;
  order.status = "Ready";
  order.statusNote = "Marked ready";

  undoStack.push({
    type: "SET_READY",
    payload: { orderID, previousStatus }
  });

  kitchenQueue.items = kitchenQueue.items.filter(o => o.id !== orderID);

  if (order.isTakeout) {
    const index = activeOrders.findIndex(o => o.id === orderID);
    if (index !== -1) {
      activeOrders.splice(index, 1);
    }
    history.push(order);
    updateSummary();
  }

  renderActiveOrders();
  renderKitchenQueue();
  renderHistory();
  saveToLocalStorage();
}

function deliverOrder(orderID) {
  const order = ordersMap.get(orderID);
  if (!order) return;

  order.status = "Delivered";
  order.statusNote = "Delivered to table";

  const index = activeOrders.findIndex(o => o.id === orderID);
  if (index !== -1) {
    activeOrders.splice(index, 1);
  }

  history.push(order);
  updateSummary();
  saveToLocalStorage();
  renderActiveOrders();
  renderHistory();
}

function processNextKitchenOrder() {
  if (kitchenQueue.isEmpty()) {
    alert("No orders in the kitchen queue.");
    return;
  }
  const order = kitchenQueue.dequeue();
  order.status = "Preparing";
  order.statusNote = "Kitchen started preparing";

  undoStack.push({
    type: "PROCESS_NEXT",
    payload: { orderID: order.id }
  });

  renderActiveOrders();
  renderKitchenQueue();
  saveToLocalStorage();
  return order;
}

// ========== UNDO ==========
function undoLastAction() {
  if (undoStack.length === 0) {
    alert("Nothing to undo.");
    return;
  }
  const last = undoStack.pop();

  switch (last.type) {
    case "CREATE_ORDER": {
      const { orderID } = last.payload;
      const order = ordersMap.get(orderID);
      if (!order) break;

      const index = activeOrders.findIndex(o => o.id === orderID);
      if (index !== -1) activeOrders.splice(index, 1);

      kitchenQueue.items = kitchenQueue.items.filter(o => o.id !== orderID);

      ordersMap.delete(orderID);
      break;
    }
    case "CANCEL_ORDER": {
      const { order } = last.payload;
      order.status = "Received";
      order.statusNote = "";

      activeOrders.push(order);
      kitchenQueue.enqueue(order);
      ordersMap.set(order.id, order);

      const histIndex = history.findIndex(o => o.id === order.id);
      if (histIndex !== -1) history.splice(histIndex, 1);
      break;
    }
    case "SET_READY": {
      const { orderID, previousStatus } = last.payload;
      const order = ordersMap.get(orderID);
      if (order) {
        order.status = previousStatus;
        order.statusNote = "";
        kitchenQueue.enqueue(order);
      }
      break;
    }
    case "PROCESS_NEXT": {
      const { orderID } = last.payload;
      const order = ordersMap.get(orderID);
      if (order) {
        order.status = "Received";
        order.statusNote = "";
        kitchenQueue.items.unshift(order);
      }
      break;
    }
  }

  sortActiveOrders();
  updateSummary();
  saveToLocalStorage();
  renderActiveOrders();
  renderKitchenQueue();
  renderHistory();
}

// ========== LOCAL STORAGE ==========
function saveToLocalStorage() {
  const data = {
    activeOrders,
    history,
    kitchenQueue: kitchenQueue.items,
    ordersMap: Array.from(ordersMap.entries()),
    menuAvailability: MENU.map(m => ({ id: m.id, available: m.available }))
  };
  localStorage.setItem("restaurantOrders", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem("restaurantOrders");
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    activeOrders.splice(0, activeOrders.length, ...(data.activeOrders || []));
    history.splice(0, history.length, ...(data.history || []));
    kitchenQueue.items = data.kitchenQueue || [];
    ordersMap.clear();
    (data.ordersMap || []).forEach(([id, order]) => {
      ordersMap.set(id, order);
    });

    if (data.menuAvailability) {
      data.menuAvailability.forEach(saved => {
        const item = MENU.find(m => m.id === saved.id);
        if (item) item.available = saved.available;
      });
    }
  } catch (e) {
    console.error("Failed to load saved data", e);
  }
}

// ========== EVENTS ==========
// Limit qty 1–20
qtyInput.addEventListener("input", () => {
  let val = parseInt(qtyInput.value || "1", 10);
  if (isNaN(val) || val < 1) val = 1;
  if (val > 20) val = 20;
  qtyInput.value = val;
});

addItemBtn.addEventListener("click", () => {
  const itemID = itemSelect.value;
  let qty = parseInt(qtyInput.value, 10) || 1;
  if (!itemID) return;
  const menuItem = MENU.find(m => m.id === itemID);
  if (!menuItem || !menuItem.available) {
    alert("This item is currently unavailable.");
    return;
  }
  if (qty < 1) qty = 1;
  if (qty > 20) qty = 20;

  const existing = tempItems.find(it => it.itemID === itemID);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 20);
  } else {
    tempItems.push({ itemID, qty });
  }
  renderTempItems();
});

// Menu cards: Add + Toggle availability
menuGrid.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const menuId = btn.getAttribute("data-id");
  const toggleId = btn.getAttribute("data-toggle");

  // Add
  if (menuId) {
    const item = MENU.find(m => m.id === menuId);
    if (!item || !item.available) {
      alert("This item is currently unavailable.");
      return;
    }
    const existing = tempItems.find(it => it.itemID === menuId);
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 20);
    } else {
      tempItems.push({ itemID: menuId, qty: 1 });
    }
    renderTempItems();
  }

  // Toggle availability
  if (toggleId) {
    const item = MENU.find(m => m.id === toggleId);
    if (!item) return;
    item.available = !item.available;
    saveToLocalStorage();
    initMenuCards();
  }
});

// Takeout: disable table select
modifierSelect.addEventListener("change", () => {
  if (modifierSelect.value === "Takeout") {
    tableNoSelect.value = "";
    tableNoSelect.disabled = true;
  } else {
    tableNoSelect.disabled = false;
  }
});

orderForm.addEventListener("submit", e => {
  e.preventDefault();
  const modifier = modifierSelect.value;
  const tableNo = modifier === "Takeout" ? null : tableNoSelect.value;

  if (modifier !== "Takeout" && !tableNo) {
    alert("Please select a table number.");
    return;
  }
  if (tempItems.length === 0) {
    alert("Please add at least one item.");
    return;
  }

  createOrder(tableNo, tempItems, modifier);

  tempItems = [];
  renderTempItems();
  orderForm.reset();
  qtyInput.value = 1;
  tableNoSelect.disabled = false;
});

processNextBtn.addEventListener("click", () => {
  const order = processNextKitchenOrder();
  if (order && order.status === "Preparing") {
    setTimeout(() => {
      setOrderReady(order.id);
    }, 3000);
  }
});

activeOrdersList.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const order = ordersMap.get(id);

  if (action === "cancel") {
    cancelOrder(id);
  } else if (action === "setReady") {
    if (order.status === "Received") {
      alert("Order is still waiting in queue. Process in kitchen first.");
      return;
    } else if (order.status === "Preparing") {
      setOrderReady(id);
    } else if (order.status === "Ready") {
      if (order.isTakeout) {
        alert("This is a takeout order. Mark pickup from History.");
        return;
      }
      deliverOrder(id);
    }
  }
});

// History: pickup button for takeout
historyList.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-history-action");
  const id = btn.getAttribute("data-id");
  if (action === "pickup") {
    const order = history.find(o => o.id === id);
    if (!order) return;
    order.pickedUp = true;
    order.status = "Delivered";
    order.statusNote = "Picked up by customer";
    updateSummary();
    saveToLocalStorage();
    renderHistory();
  }
});

// Search in history
historySearch.addEventListener("input", () => {
  renderHistory();
});

function renderOrderList(container, orders) {
  container.innerHTML = "";
  if (orders.length === 0) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }
  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "popup-order-item";
    orderDiv.innerHTML = `
      <div><strong>Order ID:</strong> ${order.id}</div>
      <div><strong>Amount:</strong> ₱${computeTotal(order.items)}</div>
      <div><strong>Time:</strong> ${order.timestamp}</div>
      <div><strong>Type:</strong> ${order.isTakeout ? "Take-out" : "Dine-in"}</div>
    `;
    container.appendChild(orderDiv);
  });
}

// Popup for Total Orders
totalOrdersSpan.addEventListener("click", () => {
  renderOrderList(totalOrdersList, history);
  totalOrdersPopup.style.display = "flex";
});

closeTotalPopup.addEventListener("click", () => {
  totalOrdersPopup.style.display = "none";
});

// Close popup when clicking outside
totalOrdersPopup.addEventListener("click", (e) => {
  if (e.target === totalOrdersPopup) {
    totalOrdersPopup.style.display = "none";
  }
});

// Popup for Delivered
deliveredSpan.addEventListener("click", () => {
  const deliveredOrders = history.filter(o => o.status === "Delivered");
  renderOrderList(deliveredOrdersList, deliveredOrders);
  deliveredPopup.style.display = "flex";
});

closeDeliveredPopup.addEventListener("click", () => {
  deliveredPopup.style.display = "none";
});

// Close popup when clicking outside
deliveredPopup.addEventListener("click", (e) => {
  if (e.target === deliveredPopup) {
    deliveredPopup.style.display = "none";
  }
});

// Popup for Cancelled
cancelledSpan.addEventListener("click", () => {
  const cancelledOrders = history.filter(o => o.status === "Cancelled");
  renderOrderList(cancelledOrdersList, cancelledOrders);
  cancelledPopup.style.display = "flex";
});

closeCancelledPopup.addEventListener("click", () => {
  cancelledPopup.style.display = "none";
});

// Close popup when clicking outside
cancelledPopup.addEventListener("click", (e) => {
  if (e.target === cancelledPopup) {
    cancelledPopup.style.display = "none";
  }
});

// Undo
undoBtn.addEventListener("click", undoLastAction);

// ========== INIT ==========
function initTableOptions() {
  for (let i = 1; i <= 15; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = "Table " + i;
    tableNoSelect.appendChild(opt);
  }
}

initTableOptions();
loadFromLocalStorage();
initMenuCards();
updateSummary();
renderTempItems();
sortActiveOrders();
renderActiveOrders();
renderKitchenQueue();
renderHistory();
