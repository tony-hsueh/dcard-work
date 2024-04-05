"use client";
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { getCookie } from 'cookies-next';
import { Container, Form } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import MdEditor from '@/app/components/MdEditor/MdEditor';
import { Octokit } from 'octokit';
import { OWNER, REPO, TOKEN_COOKIE_NAME } from '@/parameters';
import Navbar from '@/app/components/Navbar/Navbar';
import Alert from '@/app/components/Alert/Alert';
import useAlert from '@/app/hooks/useAlert';
import styles from './page.module.css'

const AddBlog = () => {
  const token = getCookie(TOKEN_COOKIE_NAME)
  const router = useRouter()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: ""
    },
  })
  const [alertObj, setAlertObj] = useAlert()
  const onSubmit = (data) => {
    handleNewBlog(data.title, data.body)
  }

  const getUserInfo = async() => {
    let response
    try {
      const octokit = new Octokit({
        auth: token
      })
      response = await octokit.request('GET /user',{
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      if (response?.data?.login !== OWNER) router.push('/')
    } catch(err) {
      console.log(err);
    }
    return response;
  }

  const handleNewBlog = async(title, body) => {
    try {
      const octokit = new Octokit({
        auth: token
      })
      
      const createdBlog = await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner: OWNER,
        repo: REPO,
        title,
        body,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      router.push(`/blog/${createdBlog.data.number}`)
    } catch (err) {
      setAlertObj({
        show: true,
        msg: '新增失敗（例外錯誤）',
        status: STATUS.danger,
      })
      console.error(err)
    }   
  }

  useEffect(() => {
    // 如果沒有 token 或用 token 的使用者非 OWNER 不能進來
    if(!token) return router.push('/');
    
    getUserInfo()
  }, [token])

  return (
    <>
      <Navbar />
      <Alert
        show={alertObj.show} 
        status={alertObj.status}
        msg={alertObj.msg}
      />
      <div className={styles.main}>
        <Container>
          <div className={styles.blogContainer}>
            <div 
              className={styles.content} 
              data-color-mode="light"
            >  
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>文章標題</Form.Label>
                  <Form.Control 
                    isInvalid={errors.title}
                    type="text" 
                    placeholder="標題" 
                    {...register("title", { required: "標題必填" })}
                  />
                  {errors.title && <p className={styles.errorHint}>{errors.title.message}</p>}
                </Form.Group>
                <Form.Label>內文</Form.Label>
                <MdEditor control={control} errors={errors} />  
                <button 
                  className='btn btn-success d-block ms-auto mt-3 text-white'
                  type='submit'
                >
                  上傳文章
                </button>
              </Form> 
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default AddBlog