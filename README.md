 Digital Restaurant Order Manager

 Project Overview

A web-based restaurant order management system that demonstrates the use of fundamental data structures (Queue, Map, and Array) for efficient order processing. The system allows staff to create orders, manage kitchen queues, track order statuses, and maintain order history with search functionality.

 Features

- Order Creation: Create orders for dine-in tables or takeout with multiple items
- Kitchen Queue Management: FIFO (First-In-First-Out) processing using Queue data structure
- Order Tracking: Real-time status updates (Received → Preparing → Ready → Delivered)
- Fast Order Lookup: O(1) lookup using Map data structure for order IDs
- Undo Functionality: Stack-based undo system for recent actions
- Order History: Complete history with search and filtering capabilities
- Menu Management: Dynamic menu with availability toggling
- Data Persistence: Local storage for data persistence across sessions
- Responsive UI: Clean, intuitive interface for restaurant staff

 Technologies Used

- HTML5: Structure and layout
- CSS3: Styling and responsive design
- JavaScript (ES6+): Core logic and data structure implementations
- Data Structures: Custom Queue, Map, and Array implementations

 Data Structures Implemented

1. Queue: Manages kitchen order processing in FIFO order
2. Map: Provides O(1) lookup for orders by ID
3. Array: Stores active orders and history, sorted by creation time
4. Stack: Implements undo functionality for operations

 How to Run

1. Clone or download the project files
2. Open `index.html` in any modern web browser
3. The application will load with sample menu items
4. Start creating orders using the interface

 File Structure

/
├── index.html           Main HTML file
├── style.css            CSS stylesheets
├── script.js            Main JavaScript logic
├── user_guide.md        User guide documentation
├── project_report.md    Project report
├── project_deliverables.md   Project deliverables
├── README.md            This file
├── img/                 Menu item images
│   ├── garlic-bread.jpg
│   ├── beef-steak.jpg
│   └── ... (other menu images)
└── backup/              Backup files
    ├── backup-css.txt
    ├── backup-index.txt
    └── backup-script.txt


 Key Algorithms

- Order ID Generation: Uses timestamp and random number for unique IDs
- Total Computation: Array reduce for summing order totals
- History Filtering: String matching for search functionality
- Status Management: State transitions with validation
- Undo System: Stack-based reversal of operations

 Authors

 [Analiza B. Minulas, 2411156],
 [Pia Jane R. Lastrollo, 2410977],
 [Mark Andrew B. Llagas, 2411506],
 [Vincent L. Hermoso, 2410962],
 [Angelo Jay P. Mondejar, 2411018].

 Subission Date

 Date: December 16, 2025

 License

This project is for educational purposes as part of a Data Structures and Algorithms course.

