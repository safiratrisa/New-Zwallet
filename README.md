<h1 align="center">Backend - Zwallet</h1>

Zwallet is a banking application built with the implementation of VueJs, NodeJs with Express framework, and MySQL. It is an application that allows you to transfer your money to another user that is registered in the database.
## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. <a href="https://www.getpostman.com/">Postman</a>
3. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name note, and Import file [note.sql](note.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.
8. You can see all the end point [here](#end-point)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
DB_HOST=[your_database_host]
DB_PORT=[your_database_port]
DB_USER=[your_database_username]
DB_PASS=[your_database_pass]
DB_NAME=kebon_id

EMAIL=[email_for_send_forgot_password_otp]
EMAIL_PASS=[your_email_password]

BASE_URL=http://localhost:8080/
PORT=8080

SECRET=[jwt_secret_key]
```

## End Point

**1. Auth**
  * **POST** `/api/v1/auth/register`
  * **POST** `/api/v1/auth/login`
  * **POST** `/api/v1/auth/forgot`
  * **POST** `/api/v1/auth/reset`
  * **PUT**  `/api/v1/auth/update`


**2. Cart**
  * **POST** `/api/v1/cart/`
  * **GET** `/api/v1/cart/:id`
  * **DELETE** `/api/v1/cart/:id`
  * **PUT** `/api/v1/cart/:id`

**3. Customers**
  * **PUT** `/api/v1/customers/:id`
  * **PUT** `/api/v1/customers/editPhoto/:id`
  * **GET** `/api/v1/customers/:id`

**4. Message**
  * **GET** `/api/v1/message/:id`
  * **POST** `/api/v1/message/`

**5. Product**
  * **GET** `/api/v1/product/`
  * **GET** `/api/v1/product/:id`
  * **POST** `/api/v1/product/`
  * **PATCH** `/api/v1/product/:id`
  * **DELETE** `/api/v1/product/:id`

**6. Store**
  * **GET** `/api/v1/store/`
  * **GET** `/api/v1/store/:id`
  * **POST** `/api/v1/store/`
  * **PATCH** `/api/v1/store/:id`
  * **DELETE** `/api/v1/store/:id`

**7. Transaction**
  * **GET** `/api/v1/transaction/:id`
  * **GET** `/api/v1/transaction/latest/:id`
  * **POST** `/api/v1/transaction/`
  * **DELETE** `/api/v1/transaction/:id`

**8. Wishlist**
  * **POST** `/api/v1/wishlist/`
  * **GET** `/api/v1/wishlist/:id`
  * **GET** `/api/v1/wishlist/`
  * **DELETE** `/api/v1/wishlist/:id`


## Related Project

- [`Frontend-Kebonid`](https://github.com/AdmiralYuuShi/Frontend-Kebonid)
