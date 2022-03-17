import Head from "next/head";
import Link from "next/link";

export default function FirstPost() {
  return (
    <div>
      <Head>最初の投稿</Head>
      <h1>最初の投稿</h1>
      <Link href="/">ホームへ戻る</Link>
    </div>
  );
}
