import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">博客管理后台</h1>
            <div className="flex items-center">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-8 w-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user.name}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">文章管理</h2>
              <button
                onClick={() => router.push('/admin/posts')}
                className="w-full bg-indigo-300 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
              >
                管理文章
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">标签管理</h2>
              <button
                onClick={() => router.push('/admin/tags')}
                className="w-full bg-indigo-300 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
              >
                管理标签
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">评论管理</h2>
              <button
                onClick={() => router.push('/admin/comments')}
                className="w-full bg-indigo-300 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
              >
                管理评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 服务端验证用户权限
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