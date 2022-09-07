import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/config/index";
import styles from "@/styles/News.module.css";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

export default function SingleNews({ news, id }) {
  const router = useRouter();
  console.log("router===>", router);
  console.log("news===>", news);

  const deleteNews = async (e) => {
    if (window.confirm("are you sure that wanted to delete news?")) {
      const res = await fetch(`${API_URL}/api/sports/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/news");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.news}>
        <div className={styles.controls}>
          <Link href={`/news/edit/${id}`}>
            <button className="btn-edit">Edit News</button>
          </Link>
          <button className="btn-delete" onClick={deleteNews}>
            Delete News
          </button>
        </div>
        <span>
          {moment(news.date).format("yyyy-MM-DD")} {news.time}
        </span>

        <h1>{news.name}</h1>
        <ToastContainer />
        {news.image && (
          <div className={styles.image}>
            <Image
              src={
                news.image.data
                  ? news.image.data[0].attributes.formats.medium.url
                  : "/images/hero.jpg"
              }
              width={900}
              height={600}
            />
          </div>
        )}
        <p>{news.detail}</p>
        <Link href="/news">
          <a className={styles.back}>Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/sports`);
  const news = await res.json();
  const paths = news.data.map((item) => ({
    params: { slug: item.attributes.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  console.log("Slug: ", slug);
  const res = await fetch(
    `${API_URL}/api/sports?populate=*&filters[slug][$eq]=${slug}`
  );
  const singleNews = await res.json();
  console.log("singleNews: ", singleNews);
  return {
    props: {
      news: singleNews.data[0].attributes,
      id: singleNews.data[0].id,
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/news/${slug}`);
//   const singleNews = await res.json();
//   return {
//     props: {
//       news: singleNews[0],
//     },
//   };
// }
