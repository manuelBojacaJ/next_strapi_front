import Link from "next/link";
import { useState } from "react";
import router, { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/Modal";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";

export default function EditNews(sportNews, id) {
  const [values, setValues] = useState({
    name: sportNews.name,
    detail: sportNews.detail,
    date: sportNews.date,
    time: sportNews.time,
  });

  const [imagePreview, setImagePreview] = useState(
    sportNews.sportNews.data.attributes.image.data
      ? sportNews.sportNews.data.attributes.image.data.attributes.formats
          .thumbnail.url
      : null
  );

  const [showModal, setShowModal] = useState(false);

  const { name, detail, date, time } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFieldCheck = Object.values(values).some(
      (element) => element === ""
    );

    if (emptyFieldCheck) {
      toast.error("Please fill all Input field");
    }

    const response = await fetch(`${API_URL}/api/sports/${sportNews.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: values }),
    });

    if (!response.ok) {
      toast.error("Something went wrong");
    } else {
      const sport = await response.json();
      router.push(`/news/${sport.data.attributes.slug}`);
    }
  };

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/sports/${sportNews.id}?populate=*`);
    const data = await res.json();

    setImagePreview(
      data.data.attributes.image.data[0].attributes.formats.thumbnail.url
    );
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Edit Sport News">
      <Link href="/news">Go back</Link>
      <h2>Edit Sport News</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              id="name"
              value={name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              name="date"
              type="date"
              id="date"
              value={date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              name="time"
              type="text"
              id="time"
              value={time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="name">Detail</label>
          <textarea
            name="detail"
            type="text"
            id="detail"
            value={detail}
            onChange={handleInputChange}
          />
        </div>
        <input className="btn" type="submit" value="Update News" />
        <ToastContainer />
      </form>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={180} />
      ) : (
        <div>
          <p>No Image Avaliable</p>
        </div>
      )}
      <div>
        <button onClick={() => setShowModal(true)} className="btn-edit">
          Update Image
        </button>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <ImageUpload
            sportNewsId={sportNews.id}
            imageUploaded={imageUploaded}
          />
        </Modal>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/sports/${id}?populate=*`);
  const sportNews = await res.json();

  return {
    props: {
      sportNews,
      id,
    },
  };
}
