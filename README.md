# EmployWise Frontend Assignment

## Project Overview
EmployWise is a React-based frontend application that integrates with the Reqres API to manage user authentication, display a paginated list of users, and allow editing and deletion of user details.

## Features
### Level 1: Authentication
- Secure user login using credentials.
- Implements the Reqres API endpoint: `POST /api/login`.
- Stores authentication token upon successful login.
- Redirects users to the Users List page upon successful login.

### Level 2: User List
- Fetches and displays paginated users from the Reqres API.
- Uses the endpoint: `GET /api/users?page=1`.
- Displays user details such as first name, last name, and avatar.
- Supports pagination and lazy loading for seamless navigation.

### Level 3: User Management (Edit & Delete)
- **Edit User:**
  - Opens a pre-filled form for user modification.
  - Allows updating first name, last name, and email.
  - Uses `PUT /api/users/{id}` to submit changes.
- **Delete User:**
  - Removes a user from the list.
  - Uses `DELETE /api/users/{id}`.
- Displays success or error messages based on API responses.

## Tech Stack
- **Frontend Framework:** React.js (Hooks & Functional Components)
- **State Management:** React State
- **Networking:** Axios 
- **Styling:** Bootstrap 
- **Routing:** React Router for seamless navigation

## Getting Started
### Prerequisites
Ensure you have the following installed:
- npm or yarn

### Installation
1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd employwise-frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install  # or yarn install
   ```
3. **Run the development server:**
   ```sh
   npm start  # or yarn start
   ```
4. **Access the application:** Open `http://localhost:3000` in your browser.

## Assumptions & Considerations
- **Authentication is simulated** (Reqres API does not persist login state).
- **User modifications (edit, delete) are also simulated**, as Reqres API does not save changes.

## Bonus Features
- **Client-side search & filtering** for user data.
- **React Router for improved navigation.**
- **Live Deployment on a free hosting platform.**

## Useful Links
- **Live Demo:** [[Deployment URL](https://employ-wise-assignment-pink.vercel.app)]
- **GitHub Repository:** [[Repo URL](https://github.com/Hathim0001/Global-Groupware-Solutions-Limited-Hackathon-Assignment-)]

## Author
Developed by Mohammed Hathim J


