import Blog from './blog'
import { Octokit } from 'octokit'
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { OWNER, REPO } from '@/parameters';

export async function generateMetadata({
  params,
}) {
  const oauthToken = getCookie('oauthAppToken', { cookies })
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

const page = () => {
  return (
    <div>
      <Blog />
    </div>
  )
}

export default page