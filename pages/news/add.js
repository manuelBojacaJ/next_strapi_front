import Link from "next/link";
import { useState } from "react";
import router, { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddNews() {
  const [values, setValues] = useState({
    name: "",
    detail: "",
    date: "",
    time: "",
  });

  const { name, detail, date, time } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFieldCheck = Object.values(values).some(
      (element) => element === ""
    );

    if (emptyFieldCheck) {
      toast.error("Please fill all Input field");
    }

    const response = await fetch(`${API_URL}/api/sports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: values }),
    });

    console.log("Sport2====>", response);

    if (!response.ok) {
      toast.error("Something went wrong");
    } else {
      const sport = await response.json();
      console.log("Sport====>", sport);
      router.push(`/news/${sport.data.attributes.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Add New Sport News">
      <Link href="/news">Go back</Link>
      <h2>Add Sport News</h2>
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
        <input className="btn" type="submit" value="Add News" />
        <ToastContainer />
      </form>
    </Layout>
  );
}
