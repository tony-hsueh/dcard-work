export async function POST(req) {
  const response = {
    msg: null,
    token: null,
  }
  try {
    const body = await req.json();
    const res = await fetch('https://github.com/login/oauth/access_token',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: body.code,
      })
   })
   const resLoginGithub = await res.json()
   if (resLoginGithub?.error) {
    response.msg = resLoginGithub.error
   } else if (resLoginGithub?.access_token) {
    response.msg = '登入成功'
    response.token = resLoginGithub.access_token
   } else {
    response.msg = '例外狀況'
   }
  } catch(err) {
    console.log(err);
    response.msg = '伺服器錯誤'
  } 
  
  return Response.json({payload: response})
}