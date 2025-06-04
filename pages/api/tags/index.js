import { getSession } from 'next-auth/react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 获取所有文章文件
const getPostFiles = () => {
  const postsDirectory = path.join(process.cwd(), 'data/blog')
  return fs.readdirSync(postsDirectory)
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => ({
      filename,
      path: path.join(postsDirectory, filename)
    }))
}

// 更新文章中的标签
const updatePostTags = (filePath, oldTag, newTag = null) => {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  if (data.tags && Array.isArray(data.tags)) {
    if (newTag) {
      // 重命名标签
      data.tags = data.tags.map(tag => tag === oldTag ? newTag : tag)
    } else {
      // 删除标签
      data.tags = data.tags.filter(tag => tag !== oldTag)
    }
    
    // 重写文件
    const newContent = matter.stringify(content, data)
    fs.writeFileSync(filePath, newContent)
  }
}

export default async function handler(req, res) {
  const session = await getSession({ req })
  
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // 获取所有标签及其使用次数
    const tagCounts = new Map()
    const postFiles = getPostFiles()
    
    postFiles.forEach(({ path: filePath }) => {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        })
      }
    })

    return res.status(200).json({
      tags: Array.from(tagCounts.entries()).map(([tag, count]) => ({
        name: tag,
        count
      }))
    })
  }
  
  else if (req.method === 'POST') {
    // 添加新标签（实际上只是验证标签名称的有效性）
    const { tag } = req.body
    if (!tag || typeof tag !== 'string' || tag.trim() === '') {
      return res.status(400).json({ error: 'Invalid tag name' })
    }
    return res.status(200).json({ success: true })
  }
  
  else if (req.method === 'PUT') {
    // 重命名标签
    const { oldTag, newTag } = req.body
    if (!oldTag || !newTag || typeof oldTag !== 'string' || typeof newTag !== 'string') {
      return res.status(400).json({ error: 'Invalid tag names' })
    }

    const postFiles = getPostFiles()
    postFiles.forEach(({ path: filePath }) => {
      updatePostTags(filePath, oldTag, newTag)
    })

    return res.status(200).json({ success: true })
  }
  
  else if (req.method === 'DELETE') {
    // 删除标签
    const { tag } = req.body
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Invalid tag name' })
    }

    const postFiles = getPostFiles()
    postFiles.forEach(({ path: filePath }) => {
      updatePostTags(filePath, tag)
    })

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
} 