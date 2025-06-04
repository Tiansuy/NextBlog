import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import PostEditor from '../../../components/PostEditor'
import { htmlToMdx } from '../../../lib/mdxUtils'

export default function NewPost() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [summary, setSummary] = useState('')
  const [isDraft, setIsDraft] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/api/auth/signin')
    return <div>Redirecting to login...</div>
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }

    setIsSaving(true)
    try {
      // 生成 slug
      const slug = title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // 替换空格为连字符
        .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 只保留字母、数字、中文和连字符
        .replace(/-+/g, '-') // 将多个连字符替换为单个
        .replace(/^-+|-+$/g, '') // 移除首尾的连字符

      // 检查文章是否已存在
      const checkResponse = await fetch(
        `/api/posts?slug=${encodeURIComponent(slug)}&checkExistence=true`
      )
      if (!checkResponse.ok) {
        throw new Error('检查文章是否存在时出错')
      }
      const existingPost = await checkResponse.json()

      if (existingPost.exists) {
        alert('已存在同名文章，请修改标题后重试')
        setIsSaving(false)
        return
      }

      // 转换标签字符串为数组
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      // 转换 HTML 为 MDX
      let mdxContent
      try {
        mdxContent = await htmlToMdx(content)
      } catch (error) {
        console.error('Error converting HTML to MDX:', error)
        throw new Error('转换文章内容时出错')
      }

      // 准备 frontmatter
      const frontmatter = {
        title: title.trim(),
        date: new Date().toISOString(),
        tags: tagArray,
        draft: isDraft,
        summary: summary.trim(),
        layout: 'PostLayout',
      }

      // 保存文章
      const saveResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content: mdxContent,
          frontmatter,
        }),
      })

      if (!saveResponse.ok) {
        const error = await saveResponse.json()
        throw new Error(error.error || '保存文章失败')
      }

      router.push('/admin/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      alert(error.message || '保存文章时出错')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">新建文章</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/posts')}
                className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600 disabled:bg-pink-300"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                摘要
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">保存为草稿</span>
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                内容
              </label>
              <PostEditor content={content} onChange={setContent} />
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
