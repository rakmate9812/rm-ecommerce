# rm-ecommerce

## Project setup
```
npm install
```

Create firebaseConfig.js with the following data:
```
/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_APIKEY",
    authDomain: "YOUR_AUTHDOMAIN",
    projectId: "YOUR_PROCEJTID",
    storageBucket: "YOUR_STORAGEBUCKET",
    messagingSenderId: "730032594931",
    appId: "YOUR_APPID",
    databaseURL: "YOUR_FIREBASE_REALTIME_DATABASE_URL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getDatabase();
export default db;

```


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
