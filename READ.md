# 🐦 Mini Tweet App

A simple full-stack web app that mimics basic Twitter functionality — built with **Node.js, Express, EJS**, and **MySQL**. Users can be created, edited, deleted, and viewed. Includes password protection for sensitive operations.

---

## 🚀 Features

- Add new users with content
- View all registered users
- Edit user info (username + content) after password verification
- Delete user securely with password validation
- Generates dummy users using `faker`
- Uses `method-override` for PATCH and DELETE support via forms

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Templating**: EJS
- **Database**: MySQL2
- **Styling**: Custom CSS via `/public`
- **Misc**: UUID, Faker.js, Method-Override

---

## 📁 Project Structure

├── views/
│ ├── home.ejs
│ ├── adduser.ejs
│ ├── showallusers.ejs
│ ├── edit.ejs
│ ├── successedit.ejs
│ ├── successeadd.ejs
│ ├── delete.ejs
│ ├── successdelete.ejs
│ └── wrongpassword.ejs
│ └── userexist.ejs
├── public/
│ └── (Static CSS/JS/Images)
├── app.js
└── package.json


---

## ⚙️ Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/mini-tweet-upgrade-version.git
   cd mini-tweet-app

# installing dependencies
npm install


# Configure MySQL Database:

Make sure MySQL is running

Create a DB named mini_tweet

Run the following query:

sql
Copy
Edit
CREATE TABLE user (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  content TEXT
);
# Run the App:

bash
Copy
Edit
node index.js
App will be live at: http://localhost:3000

# ✅ TODOs (Future Improvements)
 Add password hashing using bcrypt

 Move sensitive data to .env file

 Add flash messages for success/error feedback

 Modularize code (routes/controllers/models)

 Add REST API support

 Add unit tests

 # 👤 Author
Developed by Rayaan aka Ghouse
“Coding in silence, letting success be the noise.”