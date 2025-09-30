# Employee Attendance

Employee attendance application for maintain employee and attendance data. with FCM Messaging and RabbitMQ Data stream. Using Nest.js for backend and Next.js for frontend system. For database using postgresql.

## Backend Installation

Backend server application is build up with Nest.js framework. using Postgresql for database.

Please use .env.example as a guide for environment file to installation backend server.

Make sure Firebase Admin Key and RabbitMQ environment file is setting up to use FCM and Data Stream.

Setting up with :

```

$ npm install

```

to install package need for the application to run.

For data seeder for generate sample user run this function :

```bash

$  npm  run  seed



this  will  create  one  user  :

email  :  usertest@mail.com

password  :  12345678

is_admin  :  true

```

Notice when user with is_admin value is true, the user can be used to logged in for employee and admin portal. if the is_admin value is false then user only can logged in to employee portal.

```bash
# development
$  npm  run  start

# watch mode
$  npm  run  start:dev

# production mode
$  npm  run  start:prod
```

## Frontend Admin Portal

Frontend admin portal application is build with Next.js framework using tailwind and primereact as styling framework.

Setting up environment file, use .env.example file for environment file guide. since admin portal using FCM , you need to configure

```

firebase-messaging-sw.js

```

Located in public folder with firebase configuration value.

Install package :

```bash

$  npm  install

```

To run on development environment :

```bash

$  npm  run  dev

```

Make sure Next.js CLI is already installed.

## Frontend Employee Portal

Frontend admin portal application is build with Next.js framework using tailwind and primereact as styling framework.

Setting up environment file, use .env.example file for environment file guide.

Install package :

```bash

$  npm  install

```

To run on development environment :

```bash

$  npm  run  dev

```

Make sure Next.js CLI is already installed.
