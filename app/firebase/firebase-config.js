import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCcRo37TkPH_VpDItJDpOwSCB0r1R8CCrc",
  authDomain: "sonny-ai-d4a1a.firebaseapp.com",
  projectId: "sonny-ai-d4a1a",
  storageBucket: "sonny-ai-d4a1a.appspot.com",
  messagingSenderId: "385903839581",
  appId: "1:385903839581:web:52b89ab811edc8b545c0b4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
export { db, storage, analytics };