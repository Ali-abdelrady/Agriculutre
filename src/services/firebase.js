// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB8-8UnFN0ZDbLnZcNiwf8-cQJ4iGpvMd0",
    authDomain: "esp32-led-798cc.firebaseapp.com",
    databaseURL: "https://esp32-led-798cc-default-rtdb.firebaseio.com/",
    projectId: "esp32-led-798cc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set }