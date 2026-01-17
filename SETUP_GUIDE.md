# ☁️ MongoDB Atlas (Cloud) Setup Guide

Since you cannot install MongoDB locally, follow these steps to use the free **Cloud Database**.

## Phase 1: Create the Account & Cluster
1.  **Go to**: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2.  **Sign Up**: You can use "Sign up with Google" for speed.
3.  **Questionnaire**: Skip the questions if asked (or just select "Learning").
4.  **Choose Plan**: Select **M0 Sandbox** (Free Tier).
5.  **Provider**: Keep default (AWS) and Region (e.g., N. Virginia or Mumbai).
6.  Click **"Create Deployment"** (Green Button).

## Phase 2: Security Setup (Crucial!)
*You will see a "Security Quickstart" popup.*

1.  **Username & Password**:
    *   Username: `admin`
    *   Password: `password123` (or choose your own, **remember it!**).
    *   Click **"Create Database User"**.
2.  **IP Address**:
    *   **IMPORTANT**: Click the button **"Allow Access from Anywhere"** (or type `0.0.0.0/0`).
    *   *If you don't do this, your laptop cannot connect to the cloud.*
    *   Click **"Add IP Entry"**.
3.  Click **"Finish and Close"**.

## Phase 3: Get the Connection String
1.  You should now see your "Database Deployment" dashboard.
2.  Click the **"Connect"** button (next to your Cluster name).
3.  Select **"Drivers"** (Python, Node, etc.).
4.  You will see a string like this:
    `mongodb+srv://admin:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
5.  **Copy this string**.

## Phase 4: Configure Your Project
1.  Open VS Code.
2.  Open the file `backend/.env`.
3.  Paste the string you copied.
4.  **Replace** `<db_password>` with your real password (e.g., `password123`).
    *   *Remove the brackets `< >` too!*

**Correct Example:**
```env
MONGO_URI=mongodb+srv://admin:password123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

**Incorrect Example:**
```env
MONGO_URI=mongodb+srv://admin:<password123>@cluster0...
```
*(Note the `< >` brackets are bad).*

## Phase 5: Test
1.  Save the `.env` file (`Ctrl+S`).
2.  Your running Python server should restart and say:
    `✅ MongoDB Connected Successfully!`
