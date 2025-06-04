import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

// 获取站点 URL 的辅助函数
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // 如果没有 VERCEL_URL，说明是本地开发环境
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.OAUTH_CLIENT_KEY,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // 添加自定义配置
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 确保重定向 URL 使用正确的基础 URL
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
})
