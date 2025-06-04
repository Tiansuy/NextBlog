import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ isAdmin: false })
  }

  // 在服务端验证管理员权限
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL

  res.status(200).json({ isAdmin })
} 