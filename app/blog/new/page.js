"use client";
import React, { useState, useContext, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { getCookie } from 'cookies-next';
import { Container, Form } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import MDEditor, { EditorContext } from '@uiw/react-md-editor';
import { Octokit } from 'octokit';
import { OWNER, REPO, TOKEN_COOKIE_NAME } from '@/parameters';
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
  const onSubmit = (data) => {
    handleNewBlog(data.title, data.body)
  }
  const EditBtn = () => {
    const { dispatch } = useContext(EditorContext);
    const click = () => {
      dispatch({
        preview: "edit"
      });
    };
    return <button type='button' onClick={click}>編輯</button>
  }
  const PreviewBtn = () => {
    const { dispatch } = useContext(EditorContext);
    const click = () => {
      dispatch({
        preview: "preview"
      });
    };
    return <button type='button' onClick={click}>預覽</button>
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
      console.error(err)
    }   
  }

  const codeEdit = {
    name: "edit",
    keyCommand: "edit",
    value: "edit",
    icon: <EditBtn />
  };
  const codePreview = {
    name: "preview",
    keyCommand: "preview",
    value: "preview",
    icon: <PreviewBtn />
  };

  useEffect(() => {
    // 如果沒有 token 或用 token 的使用者非 OWNER 不能進來
    if(!token) return router.push('/');
    
    getUserInfo()
  }, [])

  return (
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
              <Controller
                control={control}
                name="body"
                rules={{
                  minLength: {
                    value: 30,
                    message: '文章至少需30字'
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <MDEditor
                    textareaProps={{
                      placeholder: "請輸入內文"
                    }}
                    height={300}
                    value={value}
                    onChange={onChange}
                    preview="edit"
                    extraCommands={[codeEdit, codePreview]}
                  />
                )}
              />
              {errors.body && <p className={styles.errorHint}>{errors.body.message}</p>}
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
  )
}

export default AddBlog