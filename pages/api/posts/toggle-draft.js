import { getSession } from 'next-auth/react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  // 验证管理员权限
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
  
  if (!session || !isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { slug } = req.body
  const filePath = path.join(process.cwd(), 'data/blog', `${slug}.mdx`)

  try {
    // 读取文件内容
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // 切换草稿状态
    const newData = {
      ...data,
      draft: !data.draft,
    }

    // 重新写入文件
    const newFileContent = matter.stringify(content, newData)
    fs.writeFileSync(filePath, newFileContent)

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error('Error toggling draft status:', error)
    res.status(500).json({ message: 'Error updating post' })
  }
} 