"use client";
import { useEffect, forwardRef, useState } from "react"
import { Octokit } from "octokit"
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from 'cookies-next';
import Link from "next/link";
import Image from 'next/image';
import { MdOutlineLogout } from "react-icons/md";
import { FaPlus, FaUser } from "react-icons/fa6";
import styles from './Navbar.module.css'
import { Button, Dropdown } from "react-bootstrap";
import { OWNER, TOKEN_COOKIE_NAME } from "@/parameters";

const Navbar = () => {
  const router = useRouter()
  const [user, setUser] = useState({login: null, avatarUrl: null})
  const token = getCookie(TOKEN_COOKIE_NAME) 

  const UserDropdown = forwardRef(({ onClick }, ref) => (
    <div className={styles.userIcon}>
      <Image 
        src={user.avatarUrl}
        alt='使用者圖片'
        width={35}
        height={35} 
        ref={ref}
        onClick={(e) => {
          onClick(e);
        }}
      /> 
    </div>
  ));
  UserDropdown.displayName = 'UserDropdown'

  const handleLogout = async() => {
    try {
      const octokit = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET, 
        },
      })

      const res = await octokit.request('DELETE /applications/{client_id}/grant', {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        access_token: token,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      deleteCookie(TOKEN_COOKIE_NAME);
      router.push('/login')
    } catch (err) {
      console.error(err)
    }   
  }
  
  useEffect(() => {
    if(!token) return;
    const getUserInfo = async() => {
      let response;
      try {
        const octokit = new Octokit({
          auth: token
        })
        response = await octokit.request('GET /user',{
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })

        const user = {};
  
        if (response?.data?.avatar_url){
          user.avatarUrl = response.data.avatar_url;
        }
        if (response?.data?.login) {
          user.login = response.data.login;
        }
        console.log(user);
        setUser(user)
      } catch(err) {
        console.log(err);
      }
    }
    getUserInfo()
  }, [token])
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftContainer}>
        <Link href="/"> 
          <div className={styles.logo}>Danel&apos;s Blog</div>
        </Link>
        <Link href="/"> 
          <div className={styles.navlink}>文章列表</div>
        </Link>
      </div>
      <div className={styles.rightContainer}>
        {/* 身分為作者才會出現 */}
        {user.login === OWNER &&
          <Link href="/blog/new">
            <button className="btn btn-outline-light me-3 d-flex align-items-center">
              <FaPlus className="me-2"/>新增文章
            </button>
          </Link>
        }
        
        {user.avatarUrl === null
        ? 
          <div 
            className={styles.userIcon} 
            onClick={() => {router.push('/login')}}
          >  
            <FaUser className={styles.notLoginIcon} />
          </div>
        :
          <Dropdown>
            <Dropdown.Toggle as={UserDropdown} id="dropdown-basic" />

            <Dropdown.Menu>
              <Dropdown.Item as={Button} onClick={handleLogout}>
                <MdOutlineLogout className="me-2" />
                登出
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> 
        }    
        
      </div>
    </nav>
  )
}

export default Navbar