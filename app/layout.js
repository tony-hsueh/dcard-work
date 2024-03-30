import { Inter } from "next/font/google";
import styles from './layout.module.css'
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/scss/global.scss'
import Navbar from "./components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Daniel's blog",
  description: "丹尼爾的部落格，喜歡撰寫技術文章，一方面讓自己可以複習，另一方面可以將知識分享給更多人。期許我寫的文章能夠幫助到別人，像是如果遇到與我相同的瓶頸時，可以在看到我的文章後，省去到處摸索的時間。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className={styles.globalContainer}>
          {children}
        </div>
      </body>
    </html>
  );
}
