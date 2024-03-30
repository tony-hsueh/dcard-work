export async function POST(req) {
  let token;
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
   token = await res.json()
  } catch(err) {
    console.log(err);
  } 
  
  return Response.json({token: token.access_token})
}