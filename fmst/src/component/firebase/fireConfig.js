import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";

const fireConfig = {
  apiKey: "AIzaSyD_lqlIS5Gu-Vck6i_mwVRoQjkEGai40ms",
  authDomain: "smart-vehicle-fleet-manager.firebaseapp.com",
  databaseURL: "https://smart-vehicle-fleet-manager.firebaseio.com",
  projectId: "smart-vehicle-fleet-manager",
  storageBucket: "smart-vehicle-fleet-manager.appspot.com",
  messagingSenderId: "35283794292",
  appId: "1:35283794292:web:8f57bd332e3993aa295421",
  measurementId: "G-2RDWV3B4X4",
};

firebase.initializeApp(fireConfig);

export const perf = firebase.performance();
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
