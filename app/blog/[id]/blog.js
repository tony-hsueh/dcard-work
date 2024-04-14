"use client";

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { getCookie } from 'cookies-next';
import { useForm } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';
import { useParams, useRouter } from 'next/navigation'
import { Octokit } from 'octokit'
import { Container, Form } from 'react-bootstrap';
import { OWNER, REPO, STATUS, TOKEN_COOKIE_NAME } from '@/parameters';
import Navbar from '@/app/components/Navbar/Navbar';
import MdEditor from '@/app/components/MdEditor/MdEditor';
import styles from './page.module.css'
import Alert from '@/app/components/Alert/Alert';
import Image from 'next/image';
import useAlert from '@/app/hooks/useAlert';

const Blog = ({username}) => {
  const router = useRouter()
  const token = getCookie(TOKEN_COOKIE_NAME)
  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: ""
    },
  })
  const [comments, setComments] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const params = useParams()
  const [issue, setIssue]= useState({
    id: 0,
    number: 0,
    title: "",
    body: "",
    created_at: "",
    labels: [],
  })

  const [alertObj, setAlertObj] = useAlert()

  const onSubmit = (data) => {
    updateIssue(data.title, data.body)
  }

  const getBlog = async() => {
    try {
      const octokit = new Octokit({
        auth: token
      })
      
      const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: OWNER,
        repo: REPO,
        issue_number: params.id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      const responseIssue = {
        id: res.data.id,
        number: res.data.number,
        title: res.data.title,
        body: res.data.body,
        created_at: res.data.created_at,
        labels: res.data.labels,
      }
      setIssue(responseIssue)
      reset({title: res.data.title, body: res.data.body ?? ''})
    } catch (err) {
      console.error(err)
    }   
  }

  const updateIssue = async(title, body) => {
    try {
      const octokit = new Octokit({
        auth: token
      })
      
      const res = await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: OWNER,
        repo: REPO,
        issue_number: params.id,
        title,
        body,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      setIsEdit(false)
      setAlertObj({
        show: true,
        msg: '文章更新成功',
        status: STATUS.success,
      })
      getBlog()
    } catch (err) {
      setAlertObj({
        show: true,
        msg: '更新失敗（例外錯誤）',
        status: STATUS.danger,
      })
      console.error(err)
    }   
  }

  const getComments = async() => {
    try {
      const octokit = new Octokit({
        auth: token
      })
      
      const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner: OWNER,
        repo: REPO,
        issue_number: params.id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      const comments = res.data.map(comment => {
        return {
          id: comment.id,
          body: comment.body,
          created_at: comment.created_at,
          username: comment?.user?.login,
          avatarUrl: comment?.user?.avatar_url,
        }
      })
      setComments(comments)
    } catch (err) {
      console.error(err)
    }   
  }
  
  useEffect(() => {
    getBlog()
    getComments()
  }, [])
  
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
            <Form onSubmit={handleSubmit(onSubmit)}>          
              <div className={styles.title}>
                <div style={{width: '70%'}}>
                  <p className={styles.createTime}>
                    {issue.created_at !== '' && dayjs(issue.created_at).format('MMM D/YYYY')}
                  </p>
                  {isEdit? 
                    <Form.Group className="mb-3">
                      <Form.Control
                        className={styles.titleInput}
                        isInvalid={errors.title}
                        type="text" 
                        placeholder="標題" 
                        {...register("title", { required: "標題必填" })}
                      />
                      {errors.title && <p className={styles.errorHint}>{errors.title.message}</p>}
                    </Form.Group>
                  :
                    <h2>{issue.title}</h2>
                  }                  
                  <div className={styles.tagContainer}>
                    {issue.labels.map(label => 
                      <div 
                        key={label.id} 
                        className={styles.tag} 
                      >
                        <span 
                          style={{ "--tagColor": '#' + label.color}} 
                          className={styles.hashtag}
                        >
                          #
                        </span>
                        {label.name}
                      </div>
                    )}   
                  </div>
                </div>
                <div style={{display: username === OWNER ? 'block' : 'none'}}>
                  {isEdit ?
                    <>  
                      <button 
                        className="btn btn-light me-2"
                        type='button'
                        onClick={() => {setIsEdit(false)}}
                      >
                        取消
                      </button>
                      <button 
                        className="btn btn-success"
                      >
                        更新文章
                      </button>
                    </>
                  :
                    <button 
                      className="btn btn-secondary"
                      type='button'
                      onClick={() => {setIsEdit(true)}}
                    >
                      編輯
                    </button>
                  }
                </div>
              </div>
              <div className={styles.content} data-color-mode="light">
                {isEdit ?
                  <MdEditor control={control} errors={errors} />        
                :
                  <MDEditor.Markdown source={issue.body} style={{ whiteSpace: 'pre-wrap' }} />
                }
              </div>
            </Form>
            <div className={styles.commentContainer}>
              {comments.map(comment =>  
                <div className={styles.comment} key={comment.id}>
                  <div className={styles.userIcon}>
                    <Image 
                      src={comment.avatarUrl}
                      alt='使用者圖片'
                      width={40}
                      height={40}  
                    />
                  </div>
                  <div className={styles.cardContainer}>
                    <div className={`${styles.chatArrow} ${comment.username === OWNER ? styles.owner : styles.notOwner}`}></div>
                    <div className={`${styles.commentCard} ${comment.username === OWNER ? styles.owner : styles.notOwner}`}>
                      <div className={styles.commentUser}>
                        <span className={styles.username}>{comment.username}</span>
                        <span className={styles.commentDate}>{dayjs(comment.created_at).format('MMM D/YYYY')}</span>
                      </div>
                      <div 
                        className={styles.commentContent}
                        data-color-mode="light"
                      >
                        <MDEditor.Markdown source={comment.body} style={{ whiteSpace: 'pre-wrap' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Blog