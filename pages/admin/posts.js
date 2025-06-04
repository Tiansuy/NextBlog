import { useState, useEffect } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// 格式化日期函数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default function PostsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    } else if (status === 'authenticated') {
      // 加载文章列表
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          setPosts(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error loading posts:', error)
          alert('加载文章列表时出错')
        })
    }
  }, [status, router])

  const handleCreatePost = () => {
    router.push('/admin/posts/new')
  }

  const handleEditPost = (post) => {
    router.push(`/admin/posts/edit/${post.slug}`)
  }

  const handleToggleDraft = async (post) => {
    try {
      const response = await fetch('/api/posts/toggle-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: post.slug }),
      })

      if (response.ok) {
        // 刷新文章列表
        const updatedPosts = await fetch('/api/posts').then(res => res.json())
        setPosts(updatedPosts)
      }
    } catch (error) {
      console.error('Error toggling draft status:', error)
      alert('更新文章状态时出错')
    }
  }

  const handleDeleteClick = (post) => {
    setDeleteTarget(post)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: deleteTarget.slug }),
      })

      if (response.ok) {
        // 从列表中移除已删除的文章
        setPosts(posts.filter(post => post.slug !== deleteTarget.slug))
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('删除文章时出错')
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">文章管理</h1>
          <button
            onClick={handleCreatePost}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            新建文章
          </button>
        </div>
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.slug} className="group hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{formatDate(post.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.draft 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                        : 'text-pink-600 dark:text-pink-400'
                    }`}>
                      {post.draft ? '草稿' : '已发布'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-pink-500 hover:text-pink-700"
                      >
                        编辑
                      </button>
                      <div className="absolute left-16 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-50 dark:bg-gray-700 -mx-2 px-2 py-[0.85rem] -my-[0.85rem]">
                        <button
                          onClick={() => handleToggleDraft(post)}
                          className="ml-4 text-yellow-500 hover:text-yellow-700"
                        >
                          {post.draft ? '发布' : '转为草稿'}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">确认删除</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              确定要删除文章 "{deleteTarget.title}" 吗？此操作无法撤销。
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
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

  return {
    props: {
      session
    }
  }
} 