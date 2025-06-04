import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function TagsManagement({ initialTags }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tags, setTags] = useState(initialTags)
  const [newTag, setNewTag] = useState('')
  const [editingTag, setEditingTag] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 刷新标签列表
  const refreshTags = async () => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()
      setTags(data.tags)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  // 添加新标签
  const handleAddTag = async () => {
    if (!newTag.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag: newTag.trim() }),
      })

      if (response.ok) {
        setNewTag('')
        await refreshTags()
      } else {
        const data = await response.json()
        alert(data.error || '添加标签失败')
      }
    } catch (error) {
      console.error('Error adding tag:', error)
      alert('添加标签失败')
    }
    setIsLoading(false)
  }

  // 删除标签
  const handleDeleteTag = async (tag) => {
    if (!confirm(`确定要删除标签 "${tag.name}" 吗？这将从所有使用该标签的文章中移除它。`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tags', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag: tag.name }),
      })

      if (response.ok) {
        await refreshTags()
      } else {
        const data = await response.json()
        alert(data.error || '删除标签失败')
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
      alert('删除标签失败')
    }
    setIsLoading(false)
  }

  // 开始编辑标签
  const startEditing = (tag) => {
    setEditingTag(tag.name)
    setEditValue(tag.name)
  }

  // 保存编辑后的标签
  const handleSaveEdit = async () => {
    if (!editValue.trim() || editValue === editingTag) {
      setEditingTag(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldTag: editingTag,
          newTag: editValue.trim(),
        }),
      })

      if (response.ok) {
        await refreshTags()
        setEditingTag(null)
      } else {
        const data = await response.json()
        alert(data.error || '更新标签失败')
      }
    } catch (error) {
      console.error('Error updating tag:', error)
      alert('更新标签失败')
    }
    setIsLoading(false)
  }

  // 加载初始数据
  useEffect(() => {
    refreshTags()
  }, [])

  if (status === 'loading' || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    router.push('/api/auth/signin')
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">标签管理</h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              返回管理后台
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-zinc-800">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">添加新标签</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="输入标签名称"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  添加标签
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">现有标签</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-md dark:bg-zinc-700"
                  >
                    {editingTag === tag.name ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-600 dark:border-zinc-500 dark:text-white"
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-500 hover:text-green-600"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingTag(null)}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white">{tag.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({tag.count} 篇文章)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(tag)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag)}
                            className="text-red-500 hover:text-red-600"
                          >
                            删除
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {tags.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                    暂无标签
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  // 验证管理员权限
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
  
  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // 获取所有标签及其使用次数
  const postsDirectory = path.join(process.cwd(), 'data/blog')
  const filenames = fs.readdirSync(postsDirectory)

  const tagCounts = new Map()
  filenames
    .filter(filename => filename.endsWith('.mdx'))
    .forEach(filename => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        })
      }
    })

  const initialTags = Array.from(tagCounts.entries()).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => a.name.localeCompare(b.name))

  return {
    props: {
      session,
      initialTags
    }
  }
} 