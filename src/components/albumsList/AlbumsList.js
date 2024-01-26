// AlbumsList.js

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import AlbumForm from "../albumForm/AlbumForm";
import ImagesList from "../imagesList/ImagesList";
import styles from "./albumsList.module.css";

const AlbumsList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumName, setSelectedAlbumName] = useState("");
  const [addAlbumButtonVisible, setAddAlbumButtonVisible] = useState(true);

  const fetchAlbums = async () => {
    // Fetch albums as before...
  };

  const handleAlbumAdded = async () => {
    await fetchAlbums();
    setShowAlbumForm(false);
    setAddAlbumButtonVisible(true);
  };

  const handleToggleForm = () => {
    setShowAlbumForm(!showAlbumForm);
    setAddAlbumButtonVisible(!showAlbumForm);
  };

  const handleCancelAlbumForm = () => {
    setShowAlbumForm(false);
    setAddAlbumButtonVisible(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "album"), (snapshot) => {
      try {
        const albumList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAlbums(albumList);
        setLoading(false);
      } catch (error) {
        console.error("Error updating albums from snapshot:", error);
        setLoading(false);
        setError("Error fetching albums. Please try again later.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAlbumClick = (albumId, albumName) => {
    setSelectedAlbum(albumId);
    setSelectedAlbumName(albumName);
    setShowAlbumForm(false);
    setAddAlbumButtonVisible(false);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
    setSelectedAlbumName("");
    setShowAlbumForm(false);
    setAddAlbumButtonVisible(true);
  };

  return (
    <>
      {showAlbumForm && <AlbumForm onAlbumAdded={handleAlbumAdded} onCancel={handleCancelAlbumForm} />}
      {loading && <div className={styles.loader}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {addAlbumButtonVisible && (
        <div className={`${styles.top} ${showAlbumForm ? styles.active : ''}`}>
          <h3>Your albums</h3>
          <button
            className={`${styles.button} ${showAlbumForm ? styles.active : ''}`}
            onClick={showAlbumForm ? handleCancelAlbumForm : handleToggleForm}
          >
            {showAlbumForm ? "Cancel" : "Add album"}
          </button>
        </div>
      )}

      {selectedAlbum ? (
        <ImagesList albumId={selectedAlbum} albumName={selectedAlbumName} onBack={handleBack} />
      ) : (
        <div className={styles.albumsList}>
          {albums.map((album) => (
            <div
              key={album.id}
              className={styles.album}
              onClick={() => handleAlbumClick(album.id, album.Albumname)}
            >
              <img src="/assets/photos.png" alt="testtitle"></img>
              <span>{album.Albumname}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AlbumsList;
