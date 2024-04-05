import Blog from './blog'
import { Octokit } from 'octokit'
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { OWNER, REPO, TOKEN_COOKIE_NAME } from '@/parameters';

export async function generateMetadata({
  params,
}) {
  const oauthToken = getCookie(TOKEN_COOKIE_NAME, { cookies })
  const id = params.id;
  const octokit = new Octokit({
    auth: oauthToken,
  })
  
  const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: OWNER,
    repo: REPO,
    issue_number: id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  return {
    title: res.data.title,
  };
}

const page = async() => {
  let username = '';
  try {
    const oauthToken = getCookie(TOKEN_COOKIE_NAME, { cookies })
    const octokit = new Octokit({
      auth: oauthToken,
    })
    const response = await octokit.request('GET /user',{
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (response?.data?.login) {
      username = response.data.login;
    }
  } catch(e) {
    console.log(e);
  }
  return (
    <div>
      <Blog username={username} />
    </div>
  )
}

export default page