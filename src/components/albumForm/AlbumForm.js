// AlbumForm.js

import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from "./albumForm.module.css";

const AlbumForm = ({ onAlbumAdded, onCancel }) => {
  const [albumName, setAlbumName] = useState("");

  const clearForm = () => {
    setAlbumName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName) {
      toast.error("Please enter a valid album name.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "album"), {
        Albumname: albumName,
        imageList: [],
      });

      toast.success("New Album added!");

      clearForm();

      // Notify the parent component (AlbumsList) that a new album has been added
      onAlbumAdded();
    } catch (error) {
      console.error("Error adding album:", error);
      toast.error("Error adding album. Please try again later.");
    }
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.albumForm}>
        <span>Create an album</span>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Album Name"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            required
            // className={`${styles.input} ${styles.formField}{input}`}
            className="input"
          />
          <button
            type="button"
            className="formBtn clearBtn"
            onClick={handleCancel}
          >
            Clear
          </button>
          <button type="submit" className="formBtn addBtn">Create</button>
        </form>
      </div>
    </>
  );
};

export default AlbumForm;
