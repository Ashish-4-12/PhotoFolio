// ImageForm.js

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./imageForm.module.css";

const ImageForm = ({ albumId, albumName, onCancel, onImageAdded, onUpdateImage, onDeleteImage, image }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setImageUrl(image.imageUrl);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !imageUrl) {
        toast.error("Please fill out all fields.");
        return;
      }

      const imageDoc = { title, imageUrl, albumId };

      if (image) {
        await updateDoc(doc(db, "images", image.id), imageDoc);
        toast.success("Image updated successfully!");
        onUpdateImage();
      } else {
        await addDoc(collection(db, "images"), imageDoc);
        toast.success("Image added successfully!");
        onImageAdded();
      }

      setTitle("");
      setImageUrl("");
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteDoc(doc(db, "images", image.id));
        toast.success("Image deleted successfully!");
        onDeleteImage();
        onCancel();
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Error deleting image. Please try again.");
      }
    }
  };

  return (
    <div className={styles.imageForm}>
      <span>{image ? "Update image" : "Add image to"} {albumName}</span>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} disabled={loading}>
            Clear
          </button>
          <button type="submit" disabled={loading}>
            {image ? "Update" : "Add"}
          </button>
        </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ImageForm;