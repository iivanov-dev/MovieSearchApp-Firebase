import { db } from "./firebase.js";
import { v4 as uuidv4 } from "uuid";

import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
export class Storage {
  constructor(key) {
    this.key = key;
    this.db = db;
    this.documentsId = [];
  }
  async pullFilmsFromStorage() {
    const querySnapshot = await getDocs(collection(this.db, this.key));
    const films = [];

    querySnapshot.forEach((doc) => {
      films.push({
        id: doc.id,
        Poster: doc.data().Poster,
        Title: doc.data().Title,
        Type: doc.data().Type,
        Year: doc.data().Year,
        imdbID: doc.data().imdbID,
      });
    });

    return films;
  }

  async pushFilmsToStorage(films) {
    if (!films || !films.length) {
      throw new Error("pushFilmsToStorage: массив фильмов пуст");
    }

    try {
      const batch = writeBatch(this.db);

      films.forEach((film) => {
        const idDocument = this._handleGenerateUUID();
        const ref = doc(this.db, this.key, idDocument);

        const filmData = {
          Poster: film.Poster,
          Title: film.Title,
          Type: film.Type,
          Year: film.Year,
          imdbID: film.imdbID,
          createdAt: serverTimestamp(),
        };

        batch.set(ref, filmData);
        console.log(
          `Фильм "${filmData.Title}" успешно сохранен с ID:`,
          idDocument,
        );
      });
      await batch.commit();
    } catch (error) {
      console.error("Ошибка при записи в Firestore:", error);
      throw error;
    }
  }

  async deleteFilms(films) {
    const batch = writeBatch(this.db);

    films.forEach((film) => {
      const ref = doc(this.db, this.key, film.id);
      batch.delete(ref);
    });

    await batch.commit();
  }

  async pushUserToStorage(user) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      role: "user",
    });
    console.log("Create user in Firestore")
  }

    async deleteUserFromStorage(uid) {
    try {
      await deleteDoc(doc(this.db, "users", uid));
      console.log("User deleted from Firestore:", uid);
      return true;
    } catch (error) {
      console.error("Error deleting user from Firestore:", error.code, error.message);
      throw error;
    }
  }

  // async updateFilm(film) {
  //   const ref = doc(this.db, this.key, film.id);
  //   await updateDoc(ref, {
  //     done: film.done,
  //   });
  // }

  _handleGenerateUUID = () => {
    const idDocument = uuidv4();
    this.documentsId.push(idDocument);
    return idDocument;
  };
}
