import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CommentsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState([])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/api/auth/signin')
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">评论管理</h1>
            <button
              onClick={() => router.push('/admin')}
              className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
            >
              返回管理后台
            </button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      文章
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      评论者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-zinc-800">
                  {comments.map((comment, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {comment.postTitle}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {comment.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {comment.content}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {comment.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            // TODO: 实现删除评论的功能
                            alert('评论管理功能正在开发中')
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {comments.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  暂无评论数据
                </div>
              )}
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

  return {
    props: {
      session,
    },
  }
}
