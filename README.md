# Freshers' Event Website

Welcome to the **Freshers' Event Website**! This project provides a seamless platform for college freshers to register, purchase passes, and attend the event with ease.

## Features

1. **User Authentication**
   - Secure login and signup functionality using JWT.

2. **Pass Purchase**
   - Users can buy passes for the event.
   - Payment is processed via QR code scanning in UPI apps.
   - Users enter the UTR (Unique Transaction Reference) number for admin verification.

3. **Admin Panel**
   - Admins can verify payments by checking the UTR number.
   - Once verified, tickets are generated automatically for the user.

4. **React Build Deployment**
   - The project uses the built React frontend to ensure a performant and production-ready user interface.

## Tech Stack

- **Frontend**: React.js along with tailwind
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **QR Code Scanning**: UPI-compatible integration

## Installation

Follow these steps to set up the project locally:

### Prerequisites
- Node.js installed
- MongoDB running locally or on a cloud service

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/redhunt777/freshers.git
   cd freshers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   G_USER=your_mail_id
   G_PASS=your_gmail_password
   UPI_ID=your_upi_id
   UPI_NAME=your_upi_name
   NODE_ENV = "production"
   ```

4. **Build React Project**
   react project is already in built state

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the website**
   Open your browser and navigate to `http://localhost:5000`.

## Project Structure

```
├── dist                   # React frontend
├── server                 # Express backend
├── models                 # MongoDB schemas
├── routes                 # API routes
├── middleware             # Authentication middleware
├── .env                   # Environment variables
├── package.json           # Backend dependencies
└── README.md              # Project documentation
```

## Usage

1. **Sign Up/Login**
   - Create an account or log in to your existing one.
   - There is a validation on email like you will use college_mail id(btechXXXXX.XX@bitmesra.ac.in)

2. **Purchase Pass**
   - Scan the provided QR code in your UPI app.
   - Complete the payment and note the UTR number.
   - Enter the UTR number on the website.

3. **Ticket Generation**
   - Wait for admin verification.
   - Once verified, your ticket will be generated automatically.

## Deploymen
2. **Backend Deployment**
   - Deploy the project on platforms Vercel.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.


## Contact

For questions or suggestions, feel free to reach out:
- Email: sarthak613singh@gmail.com
- GitHub: [redhunt777](https://github.com/redhunt777)

---
Thank you for using the Freshers' Event Website! We hope you have a great time at the event.

