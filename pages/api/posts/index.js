import { getSession } from 'next-auth/react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default async function handler(req, res) {
  try {
    const session = await getSession({ req })

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const postDirectory = path.join(process.cwd(), 'data/blog')

    // 确保目录存在
    if (!fs.existsSync(postDirectory)) {
      fs.mkdirSync(postDirectory, { recursive: true })
    }

    if (req.method === 'GET') {
      const { slug } = req.query

      if (slug) {
        // 检查文章是否存在
        const filePath = path.join(postDirectory, `${slug}.mdx`)
        const exists = fs.existsSync(filePath)

        if (exists) {
          // 如果只是检查存在性
          if (req.query.checkExistence) {
            return res.status(200).json({ exists: true })
          }

          // 否则返回文章内容
          const fileContent = fs.readFileSync(filePath, 'utf8')
          const { data: frontmatter, content } = matter(fileContent)
          return res.status(200).json({ frontmatter, content })
        } else {
          if (req.query.checkExistence) {
            return res.status(200).json({ exists: false })
          }
          return res.status(404).json({ error: 'Post not found' })
        }
      } else {
        // 获取所有文章
        const filenames = fs.readdirSync(postDirectory)
        const posts = filenames
          .filter((filename) => filename.endsWith('.mdx'))
          .map((filename) => {
            const filePath = path.join(postDirectory, filename)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            const { data } = matter(fileContents)

            return {
              slug: filename.replace(/\.mdx$/, ''),
              title: data.title,
              date: data.date,
              draft: data.draft || false,
            }
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        return res.status(200).json(posts)
      }
    } else if (req.method === 'POST') {
      const { slug, content, frontmatter } = req.body

      // 验证必要的字段
      if (!slug || !content || !frontmatter) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // 验证 frontmatter 必要的字段
      if (!frontmatter.title || !frontmatter.date) {
        return res.status(400).json({ error: 'Missing required frontmatter fields' })
      }

      const filePath = path.join(postDirectory, `${slug}.mdx`)
      const isUpdate = req.query.update === 'true'
      const oldSlug = req.query.oldSlug

      try {
        // 如果是更新操作且文件名改变了
        if (isUpdate && oldSlug && oldSlug !== slug) {
          const oldFilePath = path.join(postDirectory, `${oldSlug}.mdx`)

          // 检查旧文件是否存在
          if (!fs.existsSync(oldFilePath)) {
            return res.status(404).json({ error: 'Original post not found' })
          }

          // 检查新文件名是否已存在
          if (fs.existsSync(filePath)) {
            return res.status(409).json({ error: 'Post with new title already exists' })
          }

          // 删除旧文件
          fs.unlinkSync(oldFilePath)
        } else if (!isUpdate && fs.existsSync(filePath)) {
          // 如果不是更新操作，但文件已存在
          return res.status(409).json({ error: 'Post already exists' })
        }

        // 组合 frontmatter 和内容
        const fileContent = matter.stringify(content, frontmatter)

        // 写入新文件
        fs.writeFileSync(filePath, fileContent, 'utf8')

        return res.status(200).json({ success: true })
      } catch (error) {
        console.error('Error saving post:', error)
        return res.status(500).json({ error: 'Failed to save post' })
      }
    } else if (req.method === 'DELETE') {
      const { slug } = req.body

      if (!slug) {
        return res.status(400).json({ error: 'Missing slug' })
      }

      const filePath = path.join(postDirectory, `${slug}.mdx`)

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
          return res.status(200).json({ success: true })
        } catch (error) {
          console.error('Error deleting post:', error)
          return res.status(500).json({ error: 'Failed to delete post' })
        }
      }

      return res.status(404).json({ error: 'Post not found' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
