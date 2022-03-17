import "../styles/globals.css";
// 全てのコンポーネントに適用されるCSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
