import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  currentUser: User | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  // ---- AUTH ----
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  waitForAuthReady(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // ---- FIRESTORE: generic helpers we'll reuse for gallery/services/offers ----
  async getAll(collectionName: string) {
    const snapshot = await getDocs(collection(this.db, collectionName));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  addItem(collectionName: string, data: any) {
    return addDoc(collection(this.db, collectionName), data);
  }

  updateItem(collectionName: string, id: string, data: any) {
    return updateDoc(doc(this.db, collectionName, id), data);
  }

  deleteItem(collectionName: string, id: string) {
    return deleteDoc(doc(this.db, collectionName, id));
  }
}