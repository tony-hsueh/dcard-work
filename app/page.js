"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { getCookie, setCookie } from 'cookies-next';
import dayjs from "dayjs";
import { FaRegComment } from "react-icons/fa";
import styles from "./page.module.css";
import { useSearchParams, useRouter } from 'next/navigation'
import { Container } from "react-bootstrap";
import { Octokit } from 'octokit'
import Navbar from "./components/Navbar/Navbar";
import Alert from "./components/Alert/Alert";
import Skeleton from "./components/Skeleton/Skeleton";
import useAlert from "./hooks/useAlert";
import { TOKEN_COOKIE_NAME, OWNER, REPO, STATUS } from "@/parameters";

const PER_PAGE = 10;

const BlogsContainer = ({setAlertObj}) => {
  const token = getCookie(TOKEN_COOKIE_NAME);
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('code')
  const [isAllBlogLoaded, setIsAllBlogLoaded] = useState(false)
  const [issues, setIssues] = useState([])
  const page = useRef(1)

  async function getAccessToken() {  
    const res =  await fetch(`${window.origin}/api/auth`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code: search,
      })
    })

    const responseToken = await res.json()
    const { msg, token } = responseToken.payload

    if (token === null) {
      setAlertObj({
        show: true,
        msg,
        status: STATUS.danger,
      })
      return;
    }

    setCookie(TOKEN_COOKIE_NAME, token);
    setAlertObj({
      show: true,
      msg,
      status: STATUS.success,
    })
    router.push('/')
  }

  async function getIssues() {
    const octokit = new Octokit()
    
    const resData = await octokit.request(`GET /repos/{owner}/{repo}/issues?per_page=${PER_PAGE}&page=${page.current}`, {
      owner: OWNER,
      repo: REPO,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    // 需提示所有文章皆以仔入完畢
    if (resData.data.length === 0) return setIsAllBlogLoaded(true);

    page.current += 1;

    const newIssues = resData.data.map((issue)  => {
      return {
        id: issue.id,
        number: issue.number,
        comments: issue.comments,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        labels: issue.labels,
      }
    })
    setIssues(prev => [...prev, ...newIssues])
  }

  useEffect(() => {
    if (search && !token) {  
      getAccessToken()
    }
    if (!search) {
      getIssues()
    }
  }, [search, token])

  useEffect(() => {
    const loadMoreBlog = () => {  
      if(window.scrollY + window.innerHeight >= 
        document.documentElement.scrollHeight - 0.5 && !isAllBlogLoaded){       
          getIssues()
      }
    }
    const throttle = () => {
      let timer;
      return (cb, delay) => {
        if (timer) return;
        timer = setTimeout(() => {
          cb();
          timer = null;
        }, delay)
      }
    }
    const scrollThrottle = throttle()
    const scrollHandler = () => {
      scrollThrottle(loadMoreBlog, 500)
    }
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [isAllBlogLoaded])

  return (
    <>
      {issues.length === 0 && <Suspense>
        <Skeleton />
      </Suspense>}
      {issues.length > 0 && issues.map(issue =>  
        <div 
          className={styles.blogCard}
          key={issue.id}
        >
          <p className={styles.createTime}>{dayjs(issue.created_at).format('MMM D/YYYY')}</p>
          <div className={styles.content}>
            <Link className={styles.blogTitle} href={`/blog/${issue.number}`}>
              {issue.title}
            </Link>
            <div className={styles.tagContainer}>
              {issue.labels.map(label => 
                <div 
                  key={label.id} 
                  className={styles.tag} 
                >
                  <span 
                    style={{ "--tagColor": '#' + label.color}} className={styles.hashtag}
                  >
                    #
                  </span>
                  {label.name}
                </div>
              )}
            </div>
            <div className={styles.toolbarContainer}>
              <div className={styles.comment}>
                <FaRegComment />
                <span>{issue.comments} Comments</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {isAllBlogLoaded && <p className={styles.allLoadedHint}>文章已全部載入</p>}
    </>
  )
}

export default function Home() {
  const [alertObj, setAlertObj] = useAlert()

  useEffect(() => {   
    window.scroll({
      top: 0,
      left: 0,
    });
  }, [])

  return (
    <>
      <Navbar />
      <Alert
        show={alertObj.show} 
        status={alertObj.status}
        msg={alertObj.msg}
      />
      <main className={styles.main}>
        <Container>
          <h1 className={styles.bannerText}>歡迎來到丹尼爾的部落格</h1>
            <BlogsContainer setAlertObj={setAlertObj} />
        </Container>
      </main>
    </>
  );
}
