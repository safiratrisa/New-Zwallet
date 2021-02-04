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
5. Create a database with the name zwallet3, and Import file [zwallet3.sql](https://drive.google.com/file/d/1AmZEFv80fkl84suY21zm_NY__omJU1mf/view?usp=sharing) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.
8. You can see all the end point [here](#end-point)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :

PORT = 5000
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = ""
DB_NAME = zwallet3
BASE_URL = http://localhost:5000
FRONTEND_URL = http://localhost:8080
SECRET_KEY = cuX3oIxvBPd1U29Kf5AR1OxPm8b9Tyot
EMAIL_USERNAME = cobaemailweb5@gmail.com
EMAIL_PASSWORD = HaloHaloBandung

```
DB_HOST=[your_database_host]
DB_USER=[your_database_username]
DB_PASSWORD=[your_database_pass]
DB_NAME=zwallet3
BASE_URL=http://localhost:5000
FRONTEND_URL = http://localhost:8080
SECRET_KEY=[jwt_secret_key]
EMAIL_USERNAME = [email_for_send_forgot_password_otp]
EMAIL_PASSWORD = [your_email_password]
```

## End Point

**1. USERS INFORMATION**
  * **POST** `/users/register`
  * **POST** `/users/login`
  * **PUT** `/users/verify/:sendid`
  * **PUT** `/users/reset`
  * **PUT** `/users/resetpassword`
  * **PUT**  `/users/:id/updatepassword`
  * **PUT**  `/users/:id/updatepin`
  * **PUT**  `/users/:id/updatefirstname`
  * **PUT**  `/users/:id/updatephone`
  * **PUT**  `/users/:id/updatelastname`
  * **PUT**  `/users/:id/updateemail`
  * **PUT**  `/users/:id/updateimage`
  * **GET**  `/users/:id/profile`
  * **GET**  `/users/:id/balance`
  * **GET**  `/users/:id/friends`
  * **GET**  `/users/:id/transactions-history`
  * **GET**  `/phone/:id/user`
  * **POST** `/phone`
  * **DELETE** `/phone/:id`

**2. USERS TRANSFER**
  * **POST** `/users/gotransfer/:idsend/:idrec`
  * **POST** `/users/gotopup/:idrec`
  * **GET** `/transactions/status`
  * **GET** `/transactions/:id`



## Related Project

- [`Frontend-Zwallet`](https://github.com/safiratrisa/Zwallet-Vue)
