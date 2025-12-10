# User Manual
## Cloud-Based Event Ticketing Application

**Version:** 1.0  
**Last Updated:** December 10, 2025  
**Application Name:** Event Ticketing System

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Installation Guide](#3-installation-guide)
4. [Getting Started](#4-getting-started)
5. [User Roles](#5-user-roles)
6. [Buyer Guide](#6-buyer-guide)
7. [Promoter Guide](#7-promoter-guide)
8. [Admin Guide](#8-admin-guide)
9. [API Documentation](#9-api-documentation)
10. [Troubleshooting](#10-troubleshooting)
11. [FAQ](#11-faq)
12. [Support](#12-support)

---

## 1. Introduction

### 1.1 About the Application

The Event Ticketing Application is a comprehensive cloud-based platform designed for buying, selling, and managing event tickets. Built with modern web technologies, it provides a seamless experience for event promoters to list their events and for buyers to discover and purchase tickets.

### 1.2 Key Features

#### For Buyers:
- ✅ Browse and search events by category, date, and location
- ✅ Secure ticket purchasing with multiple payment options
- ✅ Digital ticket management and QR code generation
- ✅ Order history and ticket tracking
- ✅ Google Sign-In integration
- ✅ User profile management

#### For Promoters:
- ✅ Create and manage events
- ✅ Set multiple ticket types with different pricing
- ✅ Track ticket sales in real-time
- ✅ Check-in attendees with QR code scanning
- ✅ Sales analytics and reporting
- ✅ Event poster uploads

#### Technical Features:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time updates
- ✅ Secure authentication with JWT
- ✅ Cloud-hosted with auto-scaling
- ✅ RESTful API architecture

### 1.3 Technology Stack

- **Frontend:** React 19.2.0, React Router, Axios
- **Backend:** Node.js, Express 5.1.0
- **Database:** PostgreSQL 15
- **Authentication:** Firebase Authentication, JWT
- **Hosting:** Docker containers (can be deployed on AWS, GCP, or Azure)
- **Storage:** Firebase Storage

---

## 2. System Requirements

### 2.1 For End Users

#### Minimum Requirements:
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection:** 2 Mbps or faster
- **Screen Resolution:** 1024x768 or higher
- **Operating System:** Windows 7+, macOS 10.13+, Linux (any modern distro), iOS 12+, Android 8+

#### Recommended:
- **Browser:** Latest version of Chrome, Firefox, or Edge
- **Internet Connection:** 5 Mbps or faster
- **Screen Resolution:** 1920x1080 or higher

### 2.2 For Developers/Deployers

#### Required Software:
- **Node.js:** v18.0.0 or higher
- **npm:** v8.0.0 or higher
- **Docker:** v20.10.0 or higher
- **Docker Compose:** v2.0.0 or higher
- **PostgreSQL:** v15.0 or higher (if running locally)
- **Git:** v2.30.0 or higher

#### Cloud Provider Requirements:
- AWS Account (for AWS deployment) with EC2, RDS, S3 access
- GCP Account (for GCP deployment) with Compute Engine, Cloud SQL access
- Azure Account (for Azure deployment) with VM, Database access
- Firebase Project with Authentication and Storage enabled

---

## 3. Installation Guide

### 3.1 Quick Start with Docker (Recommended)

This is the fastest way to get the application running locally.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/mustafamadjid/tugas-besar_cloud_computing.git
cd tugas-besar_cloud_computing
```

#### Step 2: Configure Environment Variables

**Backend Configuration** (`backend/.env`):
```env
# Database Configuration
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tiketdb
DB_PORT=5432

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=8080

# Firebase Admin SDK (paste your service account JSON content here)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project"...}
```

**Frontend Configuration** (`frontend/.env`):
```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080/api

# Firebase Configuration (from Firebase Console)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Step 3: Initialize Database Schema
```bash
# Start only the database first
docker-compose up -d postgres

# Wait 10 seconds for database to be ready
# Then run the schema
docker exec -i tiket-postgres psql -U postgres -d tiketdb < backend/schema.sql
```

#### Step 4: Build and Start All Services
```bash
docker-compose up --build
```

#### Step 5: Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Database:** localhost:5432 (username: postgres, password: postgres)

### 3.2 Manual Installation (Without Docker)

#### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

#### Step 2: Set Up PostgreSQL Database

```bash
# Create database
createdb tiketdb

# Run schema
psql -U postgres -d tiketdb -f backend/schema.sql
```

#### Step 3: Configure Environment Variables
Create `.env` files as described in section 3.1, but use these values:
- Backend: `DB_HOST=localhost`
- Frontend: `REACT_APP_API_URL=http://localhost:8080/api`

#### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 3.3 Cloud Deployment

#### Option A: AWS Deployment

**Prerequisites:**
- AWS Account with billing enabled
- AWS CLI configured
- EC2 key pair created

**Steps:**
1. Launch EC2 instances (t3.small or larger)
2. Install Docker and Docker Compose
3. Set up RDS PostgreSQL instance
4. Configure security groups (ports 80, 443, 8080, 5432)
5. Clone repository and configure environment variables
6. Run `docker-compose up -d`
7. Set up Application Load Balancer
8. Configure Route 53 for domain

**Detailed AWS Guide:** See `docs/AWS_DEPLOYMENT.md` (create separately)

#### Option B: Google Cloud Platform Deployment

**Prerequisites:**
- GCP Account with billing enabled
- gcloud CLI installed

**Steps:**
1. Create GCP project
2. Enable Compute Engine and Cloud SQL APIs
3. Create Cloud SQL PostgreSQL instance
4. Create Compute Engine VM (e2-medium or larger)
5. Install Docker and Docker Compose
6. Configure firewall rules
7. Deploy application
8. Set up Cloud Load Balancing

**Detailed GCP Guide:** See `docs/GCP_DEPLOYMENT.md` (create separately)

#### Option C: Azure Deployment

**Prerequisites:**
- Azure Account with billing enabled
- Azure CLI installed

**Steps:**
1. Create Resource Group
2. Create Azure Database for PostgreSQL
3. Create Virtual Machines
4. Configure Network Security Groups
5. Install Docker and Docker Compose
6. Deploy application
7. Set up Azure Load Balancer

**Detailed Azure Guide:** See `docs/AZURE_DEPLOYMENT.md` (create separately)

### 3.4 Firebase Setup

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Click "Add Project"
   - Enter project name and follow wizard

2. **Enable Authentication:**
   - In Firebase Console, go to Authentication
   - Click "Get Started"
   - Enable "Google" sign-in method
   - Add authorized domains (your domain)

3. **Enable Storage:**
   - Go to Storage in Firebase Console
   - Click "Get Started"
   - Choose security rules (start in test mode for development)

4. **Get Configuration:**
   - Go to Project Settings
   - Scroll to "Your apps" and click web icon
   - Copy configuration values to frontend `.env`

5. **Generate Service Account:**
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download JSON file
   - Copy entire JSON content to backend `.env` `FIREBASE_SERVICE_ACCOUNT`

---

## 4. Getting Started

### 4.1 First Time Setup

#### Create Admin Account (Promoter)
Since the application doesn't have a public registration endpoint, you need to create an account directly in the database:

```sql
-- Connect to your database
psql -U postgres -d tiketdb

-- Create a promoter account
INSERT INTO users (name, email, password, role, provider)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere', -- use bcrypt to hash your password
  'PROMOTER',
  'local'
);
```

Or use Google Sign-In (automatic account creation with BUYER role by default).

#### Generate Password Hash
```bash
# In backend directory, create a script hash-password.js:
import bcrypt from 'bcrypt';
const password = 'your-password';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

```bash
# Run it:
node hash-password.js
```

### 4.2 Navigation Overview

#### Public Pages (No Login Required):
- **Landing Page** (`/`) - Home page with featured events
- **Browse Events** (`/events`) - Browse all available events
- **Event Detail** (`/events/:id`) - Detailed event information

#### Buyer Pages (Login Required):
- **My Tickets** (`/buyer/tickets`) - View purchased tickets
- **Profile** (`/buyer/profile`) - Manage account settings
- **Checkout** (`/checkout`) - Complete ticket purchase

#### Promoter Pages (Login Required):
- **Dashboard** (`/promoter/dashboard`) - Event management and analytics
- **Create Event** (within dashboard) - Add new events

### 4.3 User Interface Overview

#### Navbar Components:
- **Logo:** Click to return to home page
- **Browse Events:** Navigate to events listing
- **My Tickets:** (Buyers only) View your tickets
- **Dashboard:** (Promoters only) Manage events
- **Profile Icon:** Access profile or sign in
- **Sign Out:** Logout from account

---

## 5. User Roles

### 5.1 Buyer
**Description:** End users who browse and purchase event tickets.

**Permissions:**
- ✅ Browse all public events
- ✅ Purchase tickets
- ✅ View own tickets and order history
- ✅ Update own profile
- ❌ Cannot create events
- ❌ Cannot access promoter dashboard

### 5.2 Promoter
**Description:** Event organizers who create and manage events.

**Permissions:**
- ✅ Create new events
- ✅ Edit own events
- ✅ View ticket sales and analytics
- ✅ Check in attendees
- ✅ Upload event posters
- ❌ Cannot purchase tickets (use separate buyer account)
- ❌ Cannot view other promoters' private data

### 5.3 Admin (Future Enhancement)
**Description:** System administrators with full access.

**Permissions:**
- ✅ All promoter permissions
- ✅ Manage all users
- ✅ View all events and orders
- ✅ System configuration

---

## 6. Buyer Guide

### 6.1 Creating an Account

#### Method 1: Google Sign-In (Recommended)
1. Click "Sign In" button in navbar
2. Select "Sign in with Google"
3. Choose your Google account
4. Grant necessary permissions
5. You're automatically logged in!

#### Method 2: Local Registration (If Implemented)
1. Click "Sign Up" 
2. Enter name, email, and password
3. Click "Create Account"
4. Verify email (if email verification is enabled)
5. Login with credentials

### 6.2 Browsing Events

#### View All Events:
1. Click "Browse Events" in navbar or "Explore Events" on home page
2. Events are displayed in a grid/list view
3. Each event card shows:
   - Event poster image
   - Event name
   - Date and time
   - Location
   - Starting price
   - "View Details" button

#### Filter Events:
1. Use the filter sidebar (if available)
2. Filter options:
   - **Category:** Music, Sports, Conference, etc.
   - **Date Range:** Upcoming, This Week, This Month, Custom
   - **Location:** City or venue
   - **Price Range:** Free, Under $50, $50-$100, etc.
3. Click "Apply Filters"

#### Search Events:
1. Use the search bar at the top
2. Enter event name, artist, venue, or keywords
3. Press Enter or click search icon
4. Results update in real-time

### 6.3 Viewing Event Details

1. Click on any event card or "View Details" button
2. Event detail page displays:
   - **Event Information:**
     - Full event description
     - Date and time
     - Venue and location
     - Promoter information
   - **Ticket Types:**
     - Different ticket categories (VIP, Regular, Early Bird, etc.)
     - Price for each type
     - Available quantity
     - Sale start/end dates
   - **Purchase Section:**
     - Quantity selector for each ticket type
     - Total price calculator
     - "Add to Cart" or "Buy Now" button

### 6.4 Purchasing Tickets

#### Step 1: Select Tickets
1. On event detail page, choose ticket type
2. Select quantity using +/- buttons
3. Review total price
4. Click "Checkout" or "Buy Now"

#### Step 2: Review Order
1. Verify selected tickets
2. Check event details
3. Review total amount
4. Click "Proceed to Payment"

#### Step 3: Complete Payment
1. Select payment method:
   - Credit/Debit Card
   - Digital Wallet (if integrated)
   - Bank Transfer (with instructions)
2. Enter payment details
3. Review terms and conditions
4. Click "Complete Purchase"

#### Step 4: Confirmation
1. See success message with order number
2. Receive confirmation email (if email is configured)
3. Tickets are added to "My Tickets"
4. Digital tickets with QR codes are generated

### 6.5 Managing Your Tickets

#### View All Tickets:
1. Click "My Tickets" in navbar
2. See list of all purchased tickets:
   - Upcoming events
   - Past events
   - Pending payments

#### Ticket Details:
Each ticket shows:
- Event name and date
- Ticket type
- Unique ticket ID
- QR code for check-in
- Order number
- Purchase date
- Payment status

#### Download/Print Tickets:
1. Click on ticket to expand
2. Click "Download PDF" (if implemented)
3. Or click "Print" to print directly

#### QR Code for Check-In:
1. Open your ticket
2. Show QR code to event staff
3. Staff scans code for entry
4. Ticket is marked as "checked-in"

### 6.6 Order History

1. Go to Profile > Order History
2. View all past orders with:
   - Order number
   - Event name
   - Purchase date
   - Total amount
   - Payment status
   - Payment method

#### Track Order:
1. Click on order to view details
2. See itemized list of tickets
3. Check payment status
4. Download invoice (if implemented)

### 6.7 Profile Management

#### Update Personal Information:
1. Click profile icon > "Profile"
2. Edit fields:
   - Name
   - Email
   - Phone number
   - Profile picture
3. Click "Save Changes"

#### Change Password:
1. Go to Profile > Security
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Update Password"

#### Linked Accounts:
- View connected Google account
- Link/unlink social accounts

---

## 7. Promoter Guide

### 7.1 Promoter Dashboard Overview

Access your dashboard by clicking "Dashboard" in the navbar after logging in as a promoter.

#### Dashboard Sections:
1. **Overview Cards:**
   - Total Events
   - Total Ticket Sales
   - Total Revenue
   - Active Events

2. **Events List:**
   - All your events
   - Quick actions (Edit, View, Delete)
   - Status indicators (Active, Ended, Upcoming)

3. **Recent Sales:**
   - Latest ticket purchases
   - Buyer information
   - Payment status

4. **Analytics:**
   - Sales graphs
   - Popular ticket types
   - Revenue trends

### 7.2 Creating an Event

#### Step 1: Access Event Creation
1. Go to Promoter Dashboard
2. Click "Create New Event" button
3. Event creation form opens

#### Step 2: Fill Event Information
**Basic Information:**
- **Event Title:** Enter clear, descriptive name
- **Description:** Detailed event information (supports line breaks)
- **Date and Time:** Select event date and start time
- **Location:** Enter venue address and city
- **Category:** Select event type (Music, Sports, Conference, etc.)

**Event Poster:**
- Click "Upload Poster" button
- Select image file (JPG, PNG - max 5MB)
- Image is uploaded to Firebase Storage
- Preview displays

#### Step 3: Add Ticket Types
1. Click "Add Ticket Type"
2. For each ticket type, enter:
   - **Type Name:** (e.g., "VIP", "General Admission", "Early Bird")
   - **Price:** Ticket price (e.g., 50.00)
   - **Quantity:** Available tickets (e.g., 100)
   - **Sale Start Date:** When sales begin (optional)
   - **Sale End Date:** When sales end (optional)
3. Click "Add Another Ticket Type" for multiple types
4. Remove ticket types by clicking "X" icon

#### Step 4: Review and Publish
1. Preview your event details
2. Check all information is correct
3. Click "Create Event" or "Publish Event"
4. Event is now live and visible to buyers

#### Example Event Setup:
```
Event: Summer Music Festival 2025
Description: Join us for an unforgettable day of music...
Date: July 15, 2025, 2:00 PM
Location: Central Park, New York, NY
Category: Music

Ticket Types:
1. Early Bird - $75 - 200 tickets (Sale until June 1)
2. General Admission - $100 - 500 tickets
3. VIP - $250 - 50 tickets (Includes backstage access)
```

### 7.3 Managing Events

#### View All Events:
1. Dashboard shows all your events in a table/grid
2. Filter by:
   - Status (Active, Ended, Draft)
   - Date range
   - Category

#### Edit Event:
1. Click "Edit" button on event card
2. Modify any field (except past events)
3. Click "Save Changes"
4. Changes reflect immediately

**Note:** Cannot edit event date/time if tickets are sold. Contact support for assistance.

#### Delete Event:
1. Click "Delete" button on event card
2. Confirm deletion (warning about sold tickets)
3. Event is removed

**Warning:** Deleting an event with sold tickets will affect buyers. Consider marking as "Cancelled" instead.

#### Duplicate Event:
1. Click "Duplicate" button
2. Copy of event is created with "[Copy]" suffix
3. Edit details and publish

### 7.4 Ticket Sales Management

#### View Ticket Sales:
1. Click on event in dashboard
2. "Sales" tab shows:
   - Total tickets sold per type
   - Revenue per ticket type
   - Remaining inventory
   - Sold percentage

#### Sales Breakdown:
```
VIP Tickets: 25/50 sold (50%) - $6,250 revenue
General Admission: 350/500 sold (70%) - $35,000 revenue
Early Bird: 200/200 sold (100%) - $15,000 revenue
---
Total: 575/750 sold (77%) - $56,250 total revenue
```

#### Buyer List:
1. Go to Event > "Buyers" tab
2. See list of all ticket holders:
   - Buyer name
   - Email
   - Ticket type and quantity
   - Purchase date
   - Check-in status

#### Export Data:
1. Click "Export" button
2. Choose format: CSV or Excel
3. Download file with buyer data

### 7.5 Check-In Management

#### Check-In Process:
1. Go to Event > "Check-In" tab
2. Two methods:

**Method A: QR Code Scanner (Recommended)**
1. Click "Start Scanner"
2. Allow camera access
3. Scan buyer's QR code from their ticket
4. System validates ticket:
   - ✅ Valid: Shows green confirmation + buyer details
   - ❌ Invalid: Shows error (already used, fake, wrong event)
5. Click "Confirm Check-In"

**Method B: Manual Search**
1. Enter buyer name or ticket ID in search box
2. Select correct buyer from results
3. Verify identity
4. Click "Check In" button

#### Check-In Dashboard:
- Total attendees checked in
- Percentage of attendees
- Check-in rate graph (by time)
- No-show statistics

### 7.6 Analytics and Reports

#### Revenue Analytics:
1. Go to Dashboard > "Analytics" tab
2. View metrics:
   - **Total Revenue:** All-time and by event
   - **Revenue by Event:** Comparison chart
   - **Revenue by Ticket Type:** Pie chart
   - **Sales Timeline:** Line graph showing sales over time

#### Sales Reports:
- **Daily Sales:** Sales per day
- **Peak Sales Periods:** When most tickets sold
- **Conversion Rate:** View-to-purchase ratio

#### Export Reports:
1. Select report type
2. Choose date range
3. Click "Generate Report"
4. Download PDF or Excel

### 7.7 Event Marketing Tools

#### Share Event:
1. Click "Share" button on event
2. Copy event URL
3. Or click social media icons:
   - Share on Facebook
   - Share on Twitter
   - Share on LinkedIn
   - Email event link

#### Event URL:
```
https://your-app.com/events/123
```

#### Embed Code (Future Feature):
```html
<iframe src="https://your-app.com/embed/event/123"></iframe>
```

---

## 8. Admin Guide

### 8.1 Admin Access

Admins have full system access including:
- All promoter features
- User management
- System configuration
- Platform-wide analytics

**Note:** Admin features are planned for future releases. Currently, database-level access is required for admin tasks.

### 8.2 User Management (Database Level)

#### Promote User to Promoter:
```sql
UPDATE users 
SET role = 'PROMOTER' 
WHERE email = 'user@example.com';
```

#### View All Users:
```sql
SELECT id, name, email, role, provider, created_at 
FROM users 
ORDER BY created_at DESC;
```

#### Delete User:
```sql
-- This will cascade delete their orders and tickets
DELETE FROM users WHERE id = 123;
```

### 8.3 Event Moderation (Database Level)

#### View All Events:
```sql
SELECT e.id, e.title, e.date, e.location, u.name AS promoter
FROM events e
JOIN users u ON e.promoter_id = u.id
ORDER BY e.created_at DESC;
```

#### Delete Event:
```sql
DELETE FROM events WHERE id = 456;
```

### 8.4 System Configuration

#### Environment Variables:
Edit `.env` files to configure:
- Database connections
- JWT secret
- Firebase settings
- CORS allowed origins
- Payment gateway keys (when implemented)

#### Database Maintenance:
```sql
-- Vacuum database for performance
VACUUM ANALYZE;

-- Check database size
SELECT pg_size_pretty(pg_database_size('tiketdb'));

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 9. API Documentation

### 9.1 API Base URL

- **Local Development:** `http://localhost:8080/api`
- **Production:** `https://your-domain.com/api`

### 9.2 Authentication

Most API endpoints require authentication. Include JWT token in request headers:

```http
Authorization: Bearer <your-jwt-token>
```

#### Get Token:
1. Login via Google Auth endpoint
2. Receive JWT token in response
3. Store token in localStorage or secure cookie
4. Include in all authenticated requests

### 9.3 API Endpoints

#### Authentication Endpoints

**POST `/api/auth/google`**
- **Description:** Authenticate with Google Sign-In
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "idToken": "firebase-id-token"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "BUYER"
    }
  }
  ```

#### Event Endpoints

**GET `/api/events`**
- **Description:** Get all public events
- **Auth Required:** No
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `location` (optional): Filter by location
  - `date` (optional): Filter by date
- **Response:**
  ```json
  {
    "events": [
      {
        "id": 1,
        "title": "Summer Festival",
        "description": "Great event...",
        "date": "2025-07-15T14:00:00Z",
        "location": "Central Park, NY",
        "poster_url": "https://...",
        "promoter": {
          "id": 5,
          "name": "Event Organizer"
        },
        "tickets": [
          {
            "id": 10,
            "type": "VIP",
            "price": 250.00,
            "quantity": 50
          }
        ]
      }
    ]
  }
  ```

**GET `/api/events/:id`**
- **Description:** Get single event details
- **Auth Required:** No
- **Response:** Single event object (same structure as above)

**POST `/api/events`**
- **Description:** Create new event (Promoter only)
- **Auth Required:** Yes (Promoter role)
- **Request Body:**
  ```json
  {
    "title": "New Event",
    "description": "Event description",
    "date": "2025-08-20T18:00:00Z",
    "location": "Stadium, LA",
    "poster_url": "https://storage.../poster.jpg",
    "tickets": [
      {
        "type": "General",
        "price": 50.00,
        "quantity": 1000,
        "sale_start_date": "2025-06-01T00:00:00Z",
        "sale_end_date": "2025-08-20T00:00:00Z"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "message": "Event created successfully",
    "event_id": 123
  }
  ```

**PUT `/api/events/:id`**
- **Description:** Update event (Promoter only, own events)
- **Auth Required:** Yes (Promoter role)
- **Request Body:** Same as POST (partial updates allowed)
- **Response:**
  ```json
  {
    "message": "Event updated successfully"
  }
  ```

**DELETE `/api/events/:id`**
- **Description:** Delete event (Promoter only, own events)
- **Auth Required:** Yes (Promoter role)
- **Response:**
  ```json
  {
    "message": "Event deleted successfully"
  }
  ```

#### Buyer/Order Endpoints

**POST `/api/buyer/orders`**
- **Description:** Create new order (purchase tickets)
- **Auth Required:** Yes (Buyer role)
- **Request Body:**
  ```json
  {
    "items": [
      {
        "event_id": 1,
        "ticket_type": "VIP",
        "ticket_price": 250.00,
        "quantity": 2
      },
      {
        "event_id": 1,
        "ticket_type": "General",
        "ticket_price": 100.00,
        "quantity": 3
      }
    ],
    "payment_method": "credit_card",
    "total_price": 800.00
  }
  ```
- **Response:**
  ```json
  {
    "message": "Order created successfully",
    "order_id": 456,
    "payment_status": "PENDING"
  }
  ```

**GET `/api/buyer/orders`**
- **Description:** Get user's order history
- **Auth Required:** Yes (Buyer role)
- **Response:**
  ```json
  {
    "orders": [
      {
        "id": 456,
        "total_price": 800.00,
        "payment_status": "COMPLETED",
        "payment_method": "credit_card",
        "created_at": "2025-06-15T10:30:00Z",
        "items": [
          {
            "event": {
              "id": 1,
              "title": "Summer Festival",
              "date": "2025-07-15T14:00:00Z"
            },
            "ticket_type": "VIP",
            "quantity": 2,
            "ticket_price": 250.00,
            "checked_in": false
          }
        ]
      }
    ]
  }
  ```

**GET `/api/buyer/orders/:id`**
- **Description:** Get specific order details
- **Auth Required:** Yes (Buyer role, own orders only)
- **Response:** Single order object (same structure as above)

**GET `/api/buyer/tickets`**
- **Description:** Get all user's tickets
- **Auth Required:** Yes (Buyer role)
- **Response:**
  ```json
  {
    "tickets": [
      {
        "id": 789,
        "event": {
          "id": 1,
          "title": "Summer Festival",
          "date": "2025-07-15T14:00:00Z",
          "location": "Central Park, NY"
        },
        "ticket_type": "VIP",
        "quantity": 2,
        "order_id": 456,
        "checked_in": false,
        "qr_code": "data:image/png;base64,..."
      }
    ]
  }
  ```

**GET `/api/buyer/profile`**
- **Description:** Get user profile
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER",
    "provider": "google",
    "created_at": "2025-01-10T08:00:00Z"
  }
  ```

**PUT `/api/buyer/profile`**
- **Description:** Update user profile
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "John Updated",
    "email": "john.new@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```

### 9.4 Error Responses

All errors follow this format:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

#### Common Error Codes:
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Duplicate data (e.g., email already exists)
- **500 Internal Server Error:** Server error

#### Example Error Response:
```json
{
  "error": "Invalid authentication token",
  "code": "INVALID_TOKEN"
}
```

### 9.5 Rate Limiting

To prevent abuse, API endpoints are rate-limited:
- **Public endpoints:** 100 requests per minute per IP
- **Authenticated endpoints:** 200 requests per minute per user

When rate limit is exceeded:
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retry_after": 60
}
```

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Issue: Cannot Sign In with Google
**Symptoms:** "Sign in with Google" button doesn't work or shows error

**Solutions:**
1. **Check Firebase Configuration:**
   - Verify `REACT_APP_FIREBASE_*` variables in frontend `.env`
   - Ensure Firebase project has Google auth enabled
   - Check authorized domains in Firebase Console

2. **Clear Browser Cache:**
   - Clear cookies and cached data
   - Try incognito/private browsing mode

3. **Check Console Errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for Firebase or CORS errors

#### Issue: "Failed to Connect to Backend"
**Symptoms:** API requests fail, can't load events

**Solutions:**
1. **Verify Backend is Running:**
   ```bash
   # Check if backend container is running
   docker ps | grep tiket-backend
   
   # Check backend logs
   docker logs tiket-backend
   ```

2. **Check API URL:**
   - Verify `REACT_APP_API_URL` in frontend `.env`
   - Should be `http://localhost:8080/api` for local development

3. **Test API Directly:**
   ```bash
   # Test API is responding
   curl http://localhost:8080/api/events
   ```

4. **CORS Issues:**
   - Check backend logs for CORS errors
   - Verify `FRONTEND_URL` in backend `.env` includes your frontend URL

#### Issue: Database Connection Failed
**Symptoms:** Backend won't start, database errors in logs

**Solutions:**
1. **Check PostgreSQL is Running:**
   ```bash
   docker ps | grep postgres
   ```

2. **Verify Database Credentials:**
   - Check `DB_*` variables in backend `.env`
   - Default: user=postgres, password=postgres, db=tiketdb

3. **Initialize Database:**
   ```bash
   # Run schema script
   docker exec -i tiket-postgres psql -U postgres -d tiketdb < backend/schema.sql
   ```

4. **Check Database Logs:**
   ```bash
   docker logs tiket-postgres
   ```

#### Issue: Images Won't Upload
**Symptoms:** Event poster upload fails

**Solutions:**
1. **Check Firebase Storage:**
   - Verify Firebase Storage is enabled
   - Check storage rules in Firebase Console
   - Ensure bucket name is correct in config

2. **File Size:**
   - Maximum file size is 5MB
   - Compress large images before uploading

3. **File Format:**
   - Supported: JPG, JPEG, PNG, GIF
   - Other formats may fail

4. **Network Issues:**
   - Check internet connection
   - Verify firewall isn't blocking Firebase

#### Issue: Events Not Showing
**Symptoms:** Event list is empty or incomplete

**Solutions:**
1. **Check Database:**
   ```sql
   -- Connect to database and check events table
   SELECT COUNT(*) FROM events;
   ```

2. **Create Test Event:**
   - Login as promoter
   - Create a new event
   - Refresh event list

3. **Check Filters:**
   - Ensure no filters are applied
   - Clear all filters and search

4. **Backend Logs:**
   ```bash
   docker logs tiket-backend --tail 100
   ```

#### Issue: Tickets Not Generating
**Symptoms:** After purchase, tickets don't appear in "My Tickets"

**Solutions:**
1. **Check Order Status:**
   - Verify payment status is "COMPLETED"
   - Check order_items table for entries

2. **Database Integrity:**
   ```sql
   -- Check if order_items exist
   SELECT * FROM order_items WHERE order_id = your_order_id;
   ```

3. **Refresh Page:**
   - Sometimes a simple page refresh fixes display issues

4. **Clear Browser Cache:**
   - Cached data may show old state

### 10.2 Docker Issues

#### Issue: Containers Won't Start
```bash
# Check Docker status
docker ps -a

# View logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d
```

#### Issue: Port Already in Use
```bash
# Windows: Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
# Frontend: "3001:80" instead of "3000:80"
# Backend: "8081:8080" instead of "8080:8080"
```

#### Issue: Build Fails
```bash
# Clear Docker cache
docker-compose build --no-cache

# Remove old images
docker system prune -a
```

### 10.3 Performance Issues

#### Slow Page Load
**Solutions:**
1. **Enable Production Build:**
   ```bash
   # Frontend production build
   cd frontend
   npm run build
   ```

2. **Optimize Images:**
   - Compress event posters before upload
   - Use WebP format when possible

3. **Check Network:**
   - Slow internet connection affects API calls
   - Consider CDN for static assets

#### Database Performance
**Solutions:**
1. **Add Indexes:**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_events_date ON events(date);
   CREATE INDEX idx_events_promoter ON events(promoter_id);
   CREATE INDEX idx_orders_user ON orders(user_id);
   ```

2. **Vacuum Database:**
   ```sql
   VACUUM ANALYZE;
   ```

3. **Check Query Performance:**
   ```sql
   -- Enable query timing
   \timing
   
   -- Explain query plan
   EXPLAIN ANALYZE SELECT * FROM events WHERE date > NOW();
   ```

### 10.4 Security Issues

#### Suspected Unauthorized Access
**Solutions:**
1. **Change JWT Secret:**
   - Update `JWT_SECRET` in backend `.env`
   - All users will need to re-login

2. **Check User Accounts:**
   ```sql
   SELECT id, email, role, created_at 
   FROM users 
   ORDER BY created_at DESC 
   LIMIT 20;
   ```

3. **Review Recent Orders:**
   ```sql
   SELECT * FROM orders 
   ORDER BY created_at DESC 
   LIMIT 50;
   ```

4. **Enable Logging:**
   - Add request logging in backend
   - Monitor for suspicious patterns

---

## 11. FAQ

### General Questions

**Q: Is this application free to use?**
A: The software is open-source, but you'll need to pay for cloud hosting and Firebase services.

**Q: Can I customize the application?**
A: Yes! The code is fully customizable. You can modify features, add new ones, or change the design.

**Q: What browsers are supported?**
A: All modern browsers (Chrome, Firefox, Safari, Edge) from the last 2 years.

**Q: Is there a mobile app?**
A: Currently, it's a responsive web application that works on mobile browsers. Native apps are planned for future releases.

### Buyer Questions

**Q: How do I get my tickets after purchase?**
A: Tickets appear instantly in "My Tickets" section. You'll also receive a confirmation email (if configured).

**Q: Can I cancel or refund a ticket?**
A: Currently, cancellations must be processed by contacting the event promoter directly. Automated refunds are planned for future releases.

**Q: What if I lose my ticket?**
A: Login to your account and go to "My Tickets". All purchased tickets are stored there.

**Q: Can I transfer my ticket to someone else?**
A: Ticket transfer feature is planned for future releases. Contact the event promoter for assistance.

**Q: What payment methods are accepted?**
A: Payment integration is in development. Current version stores payment references for manual processing.

### Promoter Questions

**Q: How do I become a promoter?**
A: Contact the administrator to upgrade your account to promoter status.

**Q: Is there a fee to list events?**
A: Platform fees can be configured by the administrator. Default setup has no fees.

**Q: Can I edit an event after tickets are sold?**
A: Yes, but some fields (like ticket prices) may require extra care to avoid confusion.

**Q: How do I get paid for ticket sales?**
A: Payment processing must be set up separately. The system tracks sales for accounting purposes.

**Q: Can I see who bought tickets?**
A: Yes, the dashboard shows buyer information for check-in purposes, in compliance with privacy regulations.

### Technical Questions

**Q: What hosting is recommended?**
A: AWS, GCP, or Azure all work well. GCP offers the best Firebase integration. See Cost Analysis Report for details.

**Q: How do I backup my data?**
A: Database backups can be automated through your cloud provider. PostgreSQL also supports pg_dump for manual backups.

**Q: Can I use a different database?**
A: The application is designed for PostgreSQL. MySQL or other SQL databases would require code modifications.

**Q: How do I scale the application?**
A: Use Docker orchestration (Kubernetes) or cloud auto-scaling groups. See deployment guides for each cloud provider.

**Q: Is SSL/HTTPS required?**
A: SSL is required for production, especially for payment processing and security. Use Let's Encrypt for free certificates.

---

## 12. Support

### 12.1 Getting Help

#### Documentation
- **This User Manual:** Comprehensive guide for all features
- **Cost Analysis Report:** Infrastructure and pricing details
- **API Documentation:** Full API reference (Section 9)
- **Deployment Guides:** Cloud-specific deployment instructions

#### Community Support
- **GitHub Issues:** https://github.com/mustafamadjid/tugas-besar_cloud_computing/issues
  - Report bugs
  - Request features
  - Ask questions

- **GitHub Discussions:** https://github.com/mustafamadjid/tugas-besar_cloud_computing/discussions
  - General questions
  - Show and tell
  - Community help

### 12.2 Reporting Bugs

When reporting a bug, please include:
1. **Clear Description:** What happened vs. what should happen
2. **Steps to Reproduce:**
   - Step 1: Go to...
   - Step 2: Click on...
   - Step 3: See error
3. **Environment:**
   - Browser and version
   - Operating system
   - Deployment environment (local, AWS, GCP, etc.)
4. **Screenshots:** If applicable
5. **Console Errors:** Copy errors from browser DevTools
6. **Logs:** Backend logs if relevant

**Example Bug Report:**
```
Title: Cannot upload event poster in Chrome

Description:
When trying to upload an event poster image, I get an error message 
"Upload failed" and the image doesn't appear.

Steps to Reproduce:
1. Login as promoter
2. Go to Dashboard > Create Event
3. Fill in event details
4. Click "Upload Poster"
5. Select a JPG image (2MB)
6. Error appears

Environment:
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Deployment: Local Docker

Screenshots: [Attached]
Console Error: "Firebase Storage: unauthorized (storage/unauthorized)"
```

### 12.3 Feature Requests

We welcome feature suggestions! Please provide:
1. **Use Case:** Why this feature is needed
2. **Detailed Description:** How it should work
3. **Examples:** Similar features in other apps
4. **Priority:** Nice-to-have vs. critical

**Example Feature Request:**
```
Title: Add email notifications for ticket purchases

Use Case:
Buyers should receive email confirmation when they purchase tickets.
This provides a backup in case they lose access to their account.

Description:
- Send email immediately after successful purchase
- Include order details, tickets, and QR codes
- Option to resend email from "My Tickets" page

Examples:
- Eventbrite sends email receipts
- Ticketmaster includes PDF tickets in email

Priority: High - Expected feature for ticketing platforms
```

### 12.4 Contributing

We welcome contributions! Here's how:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/mustafamadjid/tugas-besar_cloud_computing.git
   cd tugas-besar_cloud_computing
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Thoroughly**
   - Test your changes locally
   - Ensure no existing features break
   - Add unit tests if applicable

4. **Submit Pull Request**
   - Describe your changes
   - Reference related issues
   - Include screenshots if UI changes

### 12.5 Contact Information

- **Repository:** https://github.com/mustafamadjid/tugas-besar_cloud_computing
- **Issues:** https://github.com/mustafamadjid/tugas-besar_cloud_computing/issues
- **Email:** [Add your email if you want to provide support]

---

## Appendix A: Keyboard Shortcuts

| Action | Shortcut | Notes |
|--------|----------|-------|
| Search Events | Ctrl/Cmd + K | Focus search bar |
| Open Profile | Ctrl/Cmd + P | Quick profile access |
| Go to Dashboard | Ctrl/Cmd + D | Promoters only |
| Refresh | F5 | Standard browser refresh |

---

## Appendix B: Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT,
  provider VARCHAR(20) NOT NULL DEFAULT 'local',
  google_uid VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'BUYER',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  poster_url TEXT,
  promoter_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_price NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  ticket_type VARCHAR(100) NOT NULL,
  ticket_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Appendix C: Environment Variables Reference

### Backend `.env`
```env
# Database
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=tiketdb
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=8080
NODE_ENV=production

# CORS
FRONTEND_URL=https://yourdomain.com

# Firebase
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### Frontend `.env`
```env
# Backend API
REACT_APP_API_URL=https://api.yourdomain.com/api

# Firebase
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Appendix D: Glossary

- **API:** Application Programming Interface - allows frontend and backend to communicate
- **Authentication:** Process of verifying user identity
- **Authorization:** Process of verifying user permissions
- **Buyer:** User role for purchasing tickets
- **CDN:** Content Delivery Network - distributes content globally for faster access
- **Check-in:** Process of validating tickets at event entry
- **Docker:** Platform for containerizing applications
- **Firebase:** Google's backend-as-a-service platform
- **JWT:** JSON Web Token - secure way to transmit information between parties
- **PostgreSQL:** Open-source relational database
- **Promoter:** User role for creating and managing events
- **QR Code:** Quick Response code - 2D barcode for ticket validation
- **REST API:** Representational State Transfer API - standard for web services
- **SSL/TLS:** Secure Sockets Layer/Transport Layer Security - encryption for web traffic

---

## Appendix E: Changelog

### Version 1.0 (December 10, 2025)
- Initial release
- Core features: Event listing, ticket purchasing, promoter dashboard
- Google Sign-In authentication
- Docker containerization
- PostgreSQL database
- Firebase integration

### Planned Future Releases

#### Version 1.1 (Q1 2026)
- Email notifications
- Payment gateway integration
- Ticket refund/cancellation
- Enhanced analytics

#### Version 1.2 (Q2 2026)
- Mobile app (iOS/Android)
- Ticket transfer feature
- Social media integration
- Advanced search filters

#### Version 2.0 (Q3 2026)
- Admin panel
- Multiple payment methods
- Promo codes and discounts
- Internationalization (i18n)

---

**End of User Manual**

For the latest version of this manual, visit:
https://github.com/mustafamadjid/tugas-besar_cloud_computing

**Document Version:** 1.0  
**Last Updated:** December 10, 2025  
**Next Review:** March 10, 2026
