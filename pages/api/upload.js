import { getSession } from 'next-auth/react'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

// 处理文件名，支持中文
function sanitizeFilename(filename) {
  // 移除文件扩展名
  const ext = path.extname(filename)
  let name = path.basename(filename, ext)

  // 处理文件名
  name = name
    .replace(/\s+/g, '-') // 替换空格为连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 只保留字母、数字、中文和连字符
    .replace(/-+/g, '-') // 将多个连字符替换为单个
    .replace(/^-+|-+$/g, '') // 移除首尾的连字符

  // 如果处理后的文件名为空，使用时间戳
  if (!name) {
    name = Date.now().toString()
  }

  // 添加时间戳确保唯一性
  return `${name}-${Date.now()}${ext}`
}

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads')

    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 限制5MB
      filename: (name, ext, part, form) => {
        // 使用原始文件名生成新的文件名
        const originalName = part.originalFilename || 'unnamed'
        return sanitizeFilename(originalName)
      },
    })

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Upload error:', err)
          res.status(500).json({ error: 'Upload failed' })
          return resolve()
        }

        const file = files.image?.[0] // formidable v3 返回数组
        if (!file) {
          res.status(400).json({ error: 'No file uploaded' })
          return resolve()
        }

        // 生成文件URL
        const filename = path.basename(file.filepath)
        const url = `/uploads/${filename}`

        res.status(200).json({ url })
        resolve()
      })
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
}
