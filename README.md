# COMP3130 App Store

A mobile 'App Store' for use in COMP3130 Mobile App Development.  Students develop their apps and use the
App Store to 'publish' them and take part in reviews of other apps.

## Installation

Create a `.env` file in the project directory (apps/api and apps/app-store) with
our environment variables. You can copy the contents of the `.env.dist` files
and replace the values  with your own.

Install dependencies by running the command in the terminal (root folder)

```bash
npm install
```

### Local Database

You can either configure a remote MongoDB database with [MongoDB Atlas](https://cloud.mongodb.com/) or use a local database for development.   You can run a local
database using the docker-compose.yml file in `apps/api` by running:

```base
docker compose up -d
```

from inside that folder.  This should start a local MongoDB instance so you can
use the following database connection string in api/.env:

```bash
MONGO_DB=mongodb://root:example@localhost:27017/appstore?authSource=admin
```

(User is `root` password is `example`).  A web interface (mongodb-express)
to the database is also run on port 8080.

Run the following command in the root directory to start the application

```bash
npm run dev
```

Access the application in your dashboard at `http://127.0.0.1:5173/` and API `http://localhost:3001`

## Creating User Accounts

The API app has a script for creating user accounts from a CSV file. Create
a CSV file with the format:

```csv
email,password,name,role
user1@example.com,password123,User One,user
user2@example.com,securepass,User Two,user
admin@example.com,adminpass,Admin User,admin
```

The role column should be one of `user` or `admin`.  The admin user
gets access to the admin pages in the app.


## Build

To build a production-ready version of your application, run the command in the terminal (root folder):

```bash
npm run build
```

## License

The code in this repository is released under the MIT license as found in the [License file](LICENSE).

## Authors

This project is based on the [PineUI](https://github.com/kyooowe/PineUI) project template which provided
the basic structure and configuration for the project.   

- [@stevecassidy](https://www.github.com/stevecassidy)
- [@kyooowe](https://www.github.com/kyooowe)
