"use client";

import React, { useEffect } from 'react'
import { getCookie } from 'cookies-next';
import styles from './page.module.css'
import { Container } from 'react-bootstrap';
import { FaGithub } from "react-icons/fa6";
import { TOKEN_COOKIE_NAME } from '@/parameters';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';

const Login = () => {
  const router = useRouter()
  useEffect(() => {
    // 若為 undefined 代表尚未登入
    const token = getCookie(TOKEN_COOKIE_NAME)
    if (token) router.push('/')
  },[])
  return (
    <>
      <Navbar />
      <div className={styles.loginContainer}>
        <Container>
          <div className={styles.loginCard}>
            <h3 className='mb-3'>登入後才可觀看文章全文</h3>
            <a href={`https://github.com/login/oauth/authorize/?scope=repo&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`} className={styles.githubLink}>
              <button className={styles.loginBtn}>
                <FaGithub className={styles.btnIcon} />Sign in with Github
              </button>
            </a>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Login