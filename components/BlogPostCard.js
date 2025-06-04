import Link from './Link'
import Tag from './Tag'
import formatDate from '@/lib/utils/formatDate'
import ViewCounter from './ViewCounter'
import Image from './Image'
import { useState, useEffect } from 'react'

const extractFirstImage = (content) => {
  if (!content) return null
  const imgRegex = /!\[.*?\]\((.*?)\)/
  const match = content.match(imgRegex)
  return match ? match[1] : null
}

const BlogPostCard = ({ slug, date, title, summary, tags, content }) => {
  const [postImage, setPostImage] = useState(null)
  const defaultImage = 'https://placehold.co/600x400/eee/995'

  useEffect(() => {
    // 首先尝试从文章内容中提取第一张图片
    const firstImage = extractFirstImage(content)
    if (firstImage) {
      setPostImage(firstImage)
      return
    }

    // 如果文章中没有图片，则使用 waifu.pics API
    fetch('https://api.waifu.pics/sfw/waifu')
      .then(response => response.json())
      .then(data => {
        setPostImage(data.url)
      })
      .catch(error => {
        console.error('Error fetching random image:', error)
        setPostImage(defaultImage)
      })
  }, [content])

  return (
    <div className="my-4 group relative">
      {/* 变形背景层 */}
      <div className="absolute inset-0 bg-transparent bg-opacity-20 group-hover:bg-gray-100 group-hover:shadow-[5px_-5px_0_0_#ec4899] group-hover:ring-2 group-hover:ring-pink-500 dark:group-hover:bg-gray-800 group-hover:[transform:skew(-10deg)_translateX(-25px)]" />
      
      <Link
        href={`/blog/${slug}`}
        className="relative flex overflow-hidden group-hover:translate-x-6"
      >
        <article className="flex w-full">
          {/* 左侧内容区域 */}
          <div className="flex w-[60%] flex-col space-y-3 p-4">
            <dl>
              <dt className="sr-only">Published on</dt>
              <dd className="text-sm font-normal leading-6 text-gray-500 dark:text-gray-400">
                <time dateTime={date}>{formatDate(date)}</time>
                {' • '}
                <ViewCounter className="mx-1" slug={slug} />
                views
              </dd>
            </dl>
            <div className="space-y-5">
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold leading-8 tracking-tight">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-gray-900 hover:text-pink-500 dark:text-gray-100 dark:hover:text-pink-500"
                    >
                      {title}
                    </Link>
                  </h2>
                </div>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
                <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                  {summary}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧图片区域 */}
          <div className="relative w-[40%] overflow-hidden rounded-2xl group-hover:rounded-none transition-all duration-300">
            <div className="absolute inset-0 group-hover:[clip-path:polygon(25px_0,_calc(100%_-_30px)_0,_calc(75%_+_35px)_100%,_0_100%)]">
              <Image
                src={postImage || defaultImage}
                alt={title}
                width={600}
                height={400}
                className="h-full w-full scale-125 object-cover rounded-2xl group-hover:rounded-none transition-all duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority={false}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:rounded-none transition-all duration-300" />
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}

export default BlogPostCard 