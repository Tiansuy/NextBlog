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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">博客管理后台</h1>
            <div className="flex items-center">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="mr-2 h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{session.user.name}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">文章管理</h2>
              <button
                onClick={() => router.push('/admin/posts')}
                className="w-full rounded bg-indigo-300 px-4 py-2 text-white transition-colors hover:bg-pink-500"
              >
                管理文章
              </button>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">标签管理</h2>
              <button
                onClick={() => router.push('/admin/tags')}
                className="w-full rounded bg-indigo-300 px-4 py-2 text-white transition-colors hover:bg-pink-500"
              >
                管理标签
              </button>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">评论管理</h2>
              <button
                onClick={() => router.push('/admin/comments')}
                className="w-full rounded bg-indigo-300 px-4 py-2 text-white transition-colors hover:bg-pink-500"
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
      session,
    },
  }
}
