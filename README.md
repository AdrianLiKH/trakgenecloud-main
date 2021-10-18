# Getting Started

This project involves MERN (MongoDB, Express.js, React.js, Node.js) stack

## Tools needed

NodeJS:\
Download latest LTS version https://nodejs.org/en/ based on your platform.

MongoDB server (Community Edition):\
Download https://www.mongodb.com/try/download/community based on your platform

## Local Setup

In the project the root directory contains the React components and `backend` directory contains the express server codebase.

### Install dependencies
Type `npm i` in project's root directory to install dependencies for react.\
Open second terminal and type `cd backend/ && npm i` in project's root directory to install dependencies for express server.

### Create .env
Create a .env in /backend/ and paste the following into the .env file.
`ATLAS_URI=mongodb://localhost:27017/trakgene-app?retryWrites=true&w=majority
USER_SECRET=01BD3F35C24055C689F8F982C939EC7FF6140238A2B451BD63B72DB6A9621FED
LINK_TOKEN_SECRET=99B5460140C1A937EFF5F98E17E2A624674DF5E1620A25003F1E499FE6FCE4EC
Family_ID=601e9b3b1a24e32eb0a5e6d9
LOGIN_SECRET=51169005269DEEBEBFA1920C34DFE9F1367EB704D5D45408BF3A398803F8A65A`

### Start MongoDB server
Start the MongoDB server on your local environment.\
Refer the `README` file of the mongo db server you have installed which is specific to the OS.

### Restore dump 
type `unzip dump.zip`. Make sure your MongoDB is working and type `mongorestore dump && systemctl restart mongod`.

### Start Express server
Open Terminal and go to the `backend` directory, `cd backend/`\
Type `npm start`.

You will see message "MongoDB connection established successfully" at the end, provided your mongodb server is running.

### Start React app

Type `npm start` in project's root directory to start the react app.\
By default the app starts on port 3000 and opens the localhost URL in the browser.

## Creating a new user

When visting for the first time, you need admin user access.\
To create a new user we will use CURL. Copy & Paste below command in your Terminal
```
curl --location --request POST 'http://localhost:5000/api/createUser' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userData": {
        "email": "admin@example.com",
        "password": "admin",
        "userType": "admin"
    }
}'
```
This will create a new user will email: `admin@example.com` and password `admin` in your local database.





## Learn More about React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
