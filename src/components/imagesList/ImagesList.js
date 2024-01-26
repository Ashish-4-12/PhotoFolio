// ImagesList.js

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import ImageForm from "../imageForm/ImageForm";
import styles from "./imageList.module.css";

const ImagesList = ({ albumId, albumName, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addImageIntent, setAddImageIntent] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "images"), where("albumId", "==", albumId));
      const querySnapshot = await getDocs(q);
      const imageList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [albumId]);

  const handleAddImage = () => {
    setAddImageIntent(true);
    setUpdateImageIntent(null);
  };

  const handleCancelAddImage = () => {
    setAddImageIntent(false);
  };

  const handleEditImage = (image) => {
    setUpdateImageIntent(image);
    setAddImageIntent(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setSearchTerm(""); // Clear search term when toggling search
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Implement search logic here
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteDoc(doc(db, "images", imageId));
      // console.log(imageList)
      console.log(imageId, "...deleted")
      // console.log(db)
      fetchImages(); // Update the image list after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <>
      {addImageIntent && (
        <ImageForm
          albumId={albumId}
          albumName={albumName}
          onCancel={handleCancelAddImage}
          onImageAdded={fetchImages}
        />
      )}
      {updateImageIntent && (
        <ImageForm
          albumId={albumId}
          albumName={albumName}
          onCancel={() => setUpdateImageIntent(null)}
          onUpdateImage={fetchImages}
          onDeleteImage={fetchImages}
          image={updateImageIntent}
        />
      )}
      <div className={`${styles.top} ${addImageIntent ? styles.active : ""}`}>
        <span onClick={onBack}>
          <img src={`${process.env.PUBLIC_URL}/assets/back.png`} alt="back" />
        </span>
        <h3>Images in {albumName}</h3>
        <div className={styles.search}>
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`${styles.input} ${showSearch ? styles.showInput : ""}`}
            />
          )}
          {showSearch ? (
            <img
              src={`${process.env.PUBLIC_URL}/assets/clear.png`}
              alt="clear"
              onClick={handleSearchClick}
              className={styles.clearIcon}
            />
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/assets/search.png`}
              alt="search"
              onClick={handleSearchClick}
              className={styles.searchIcon}
            />
          )}
        </div>
        {!addImageIntent ? (
          <button onClick={handleAddImage}>Add Image</button>
        ) : (
          <button onClick={handleCancelAddImage} className={styles.active}>
            Cancel
          </button>
        )}
      </div>

      {loading && <div className={styles.loader}>Loading...</div>}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Update button */}

              <div
                className={`${styles.update} ${hoveredIndex === index ? styles.active : ""}`}
                onClick={() => handleEditImage(image)}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/edit.png`} alt="update" />
              </div>

              {/* Delete button */}
              <div
                className={`${styles.delete} ${hoveredIndex === index ? styles.active : ""}`}
                onClick={() => handleDeleteImage(image.id)}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/trash-bin.png`} alt="delete" />
              </div>
              {image.imageUrl && isValidUrl(image.imageUrl) ? (
                <img src={image.imageUrl} alt={image.title} />
              ) : (
                <img src={`${process.env.PUBLIC_URL}/assets/warning.png`} alt={image.title} />
              )}

              <span>{image.title}</span>


            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImagesList;