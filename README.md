<div align="center">
  <a href="https://tonyhsueh-portfolio.netlify.app">
    <img src="https://github.com/tony-hsueh/dcard-work/blob/main/app/opengraph-image.png?raw=true" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">丹尼爾的部落格</h3>
</div>

[View Demo](https://dcard-work.vercel.app/)
<br />
> This project is made for someone using Github Issue as blog. Therefore, project will request blog content by Github API.

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/tony-hsueh/dcard-work.git
```

### 2. Go into the repository

```bash
cd dcard-work
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the app

```bash
npm run dev
```
> open localhost:3000 to see the page

### 5. Set OWNER & REPO in parameters.js

```js
export const OWNER = “儲存庫的所有人帳號”
export const REPO = “儲存所有文章的儲存庫名字“
```

### 6. Make your own .env file (copy .env.example)

```js
CLIENT_ID= 您的 Github Oauth App 產生的 Client ID
CLIENT_SECRET= 您的 Github Oauth App 產生的 Client secrets
NEXT_PUBLIC_CLIENT_ID= 您的 Github Oauth App 產生的 Client ID
NEXT_PUBLIC_CLIENT_SECRET= 您的 Github Oauth App 產生的 Client secrets
```
> prefix **NEXT_PUBLIC** is for Client component to access. 

## Page Overview
- Login
- List of articles
- Article & Comments
- Add new article
> Permission restrictions
> 
> Author: read Articles & Comments、 edit Article、 Add new article
>
> Other Users: read Articles & Comments

## File Overview
This projcect follow **App Router** File Conventions.
```bash
    .
    ├── app
        ├── api # Server for getting github access token
        ├── blog # Display Article and Comments
        ├── components # Navbar、 Markdown Editor
        ├── login 
        ├── page.js # Dispaly list all articles
    ├── .env.example # .env template
    ├── parameters.js
    └── README.md
```

## Built With
- Next v14.1.0 (using App Router)
- React v18
- React-bootstrap v2.10.1
- React-hook-form v7.51.1
- React-icons v5.0.1
- React-router-dom v6.16.0
- @uiw/react-md-editor v4.0.3
- bootstrap v5.3.3
- cookies-next v4.1.1
- dayjs v1.11.10
- octokit v3.1.2

## Contact
Since 2022, I become a frontend engineer. Currently, I've made **19** projects which include
**Games**、**Layout(RWD)**、**Tools**.

- Name: Tony Hsueh
- Email: yahooleo36@gmail.com
- Medium: [https://medium.com/@yahooleo36](https://medium.com/@yahooleo36)
