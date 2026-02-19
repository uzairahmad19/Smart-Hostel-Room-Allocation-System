# Smart Hostel Room Allocation System

This repository contains the complete source code for the Smart Hostel Room Allocation System. The application allows users to manage hostel rooms and automatically allocates the most optimal room to students based on specific facility requirements and capacity constraints.

## 🚀 Live Links & Deliverables
* **Frontend Deployment (Vercel):** [https://smart-hostel-room-allocation-system-taupe.vercel.app/]
* **Backend API (Render):** [https://smart-hostel-room-allocation-system.onrender.com]
## 🛠️ Technology Stack
* **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide-React.
* **Backend:** Java 17+, Spring Boot 3, Spring Web, Spring Data JPA, Lombok.
* **Database:** H2 In-Memory Database (Chosen for zero-config, immediate cloud deployment testing).
* **Deployment Platforms:** Vercel (Frontend) & Render (Backend).

## 🧠 Core Allocation Algorithm Explanation
The assignment requires allocating the *smallest possible room* that satisfies the student capacity and facility conditions (AC and Washroom), while returning "No room available" if none exist.

**How it works:**
1. **Database Query Optimization:** Instead of fetching all rooms and filtering them in memory, the Spring Data JPA repository uses the method `findByCapacityGreaterThanEqualAndHasACAndHasAttachedWashroomAndIsAllocatedFalseOrderByCapacityAsc`.
2. **Strict Filtering:** The query strictly filters for rooms where `capacity >= requested_students`, `hasAC == requested_AC`, `hasAttachedWashroom == requested_washroom`, and `isAllocated == false`.
3. **Sorting at the DB Level:** The `OrderByCapacityAsc` clause ensures the database sorts the matching rooms from smallest to largest capacity.
4. **Optimal Selection & Locking:** The backend selects the very first room in the returned list (guaranteeing it is the smallest valid fit), updates its `isAllocated` flag to `true` to prevent double-booking, and saves it back to the database.
5. **Graceful Degradation:** If the resulting list is empty, a specific JSON response triggers the exact "No room available" message on the frontend UI.

## 💻 Local Setup Instructions

### 1. Run the Spring Boot Backend
1. Navigate to the `backend` directory: `cd backend`
2. Ensure you have Maven and Java installed.
3. Run the application: `./mvnw spring-boot:run` (or use your IDE).
4. The API will start on `http://localhost:8080`.
5. *Note: As H2 is an in-memory database, data will reset upon server restart.*

### 2. Run the Next.js Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The UI will be available at `http://localhost:3000`.

## 🛡️ Error Handling Implemented
* **Frontend:** Prevents blank room numbers, negative capacities, and negative student counts before making API calls.
* **Backend:** Checks for duplicate `roomNo` primary keys during room creation and returns a `409 Conflict` status, which the frontend catches and displays as a user-friendly alert.
