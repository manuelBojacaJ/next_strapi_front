import { useState } from "react";
import { API_URL } from "../config";
import styles from "@/styles/Form.module.css";

export default function ImageUpload({ sportNewsId, imageUploaded }) {
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("files", image);
    formData.append("ref", "api::sports.sports");
    formData.append("refId", sportNewsId);
    formData.append("field", "image");

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      imageUploaded();
    }
  };

  const handlefileChange = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };
  return (
    <div className={styles.form}>
      <h4>UPload Sport News Image</h4>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={handlefileChange} />
        </div>
        <input type="submit" value="upload" className="btn" />
      </form>
    </div>
  );
}
