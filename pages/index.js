import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import NewsItem from "@/components/NewsItem";

export default function HomePage({ news }) {
  console.log("News0===>", news);

  return (
    <div>
      <Layout>
        <h1>Latest News</h1>
        {news.length === 0 && <h3>No News</h3>}
        {news.map((item) => (
          <NewsItem key={item.id} news={item.attributes} />
        ))}
        {news.length > 0 && (
          <Link href="/news">
            <a className="btn-secondary">View All News</a>
          </Link>
        )}
      </Layout>
    </div>
  );
}

// export async function getServerSideProps() {
//   const res = await fetch(`${API_URL}/api/news`);
//   const news = await res.json();

//   return {
//     props: { news },
//   };
// }

export async function getStaticProps() {
  const res = await fetch(
    `${API_URL}/api/sports?populate=*&sort=date%3Aasc&pagination[limit]=5`
  );
  console.log("Res", res);
  const news = await res.json();
  console.log("News===>", news.data);
  return {
    props: { news: news.data },
    revalidate: 1,
  };
}
