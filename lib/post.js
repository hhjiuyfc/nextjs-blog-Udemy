import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// ルートディレクトリのpostsフォルダ(process.cwd() は現在のワーキングディレクトリの 絶対パス を返します。)
const postDirectory = path.join(process.cwd(), "posts");

// mdファイルのデータを取り出す
export function getPostsData() {
  // fileNameには配列のmdファイル fs.readdirSync()
  // fs.readdirSync(path[, options])は、引数pathにディレクトリのパスを取り、
  // ファイル名の配列を返します。

  const fileNames = fs.readdirSync(postDirectory);
  // replace() メソッドは、pattern に一致する文字列の一部またはすべてを replacement で置き換えた新しい文字列を返します。
  const allPostData = fileNames.map((fileName) => {
    // $(行の末尾にマッチする。) 正規表現では、特殊文字を文字として認識させたい時、バックスラッシュ（\）を使ってエスケープ（迂回）を行います。
    // ファイル名(id)
    const id = fileName.replace(/\.md$/, ""); // .mdの拡張子なしにする

    // マークダウンファイルを文字列として読み取る
    // ディレクトリ名を表すパスと、ディレクトリ名あるいはファイル名を結合するには、
    // Node.js の標準モジュール path が提供している path.join メソッドを使用

    const fullPath = path.join(postDirectory, fileName);
    // Node.jsでファイルの内容を文字列として読み込むには fs.readFileSync() を使います。
    const fileContents = fs.readFileSync(fullPath, "utf8");
    // マークダウンファイルのメタデータ(--解析)
    const matterResult = matter(fileContents);

    // idとデータを返す 配列(id, title, date, thumbnailを一つずつ取り出す)
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostData;
}

// getStaticPathでreturnで使うpathを取得
export function getAllPostIds() {
  // .mdのファイルズ
  const fileNames = fs.readdirSync(postDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// id(ファイル名)に基づいてブログ投稿データを渡す
export async function getPostData(id) {
  // idに一致した.mdファイルのフルパス
  const fullPath = path.join(postDirectory, `${id}.md`);
  // 文字列として読み込む
  const fileContent = fs.readFileSync(fullPath, "utf8");
  // メタデータ(title..)を解析
  const matterResult = matter(fileContent);
  // コンテント文章をHTMLとして解析
  const blogContent = await remark().use(html).process(matterResult.content);
  // 文章をString型に
  const blogContentHTML = blogContent.toString();

  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
