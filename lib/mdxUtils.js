import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkStringify from 'remark-stringify'

// HTML 转换为 MDX
export async function htmlToMdx(html) {
  // 这里可以添加更复杂的 HTML 到 Markdown 的转换逻辑
  // 目前使用简单的替换规则
  let markdown = html
    .replace(/<h1>/g, '# ')
    .replace(/<\/h1>/g, '\n\n')
    .replace(/<h2>/g, '## ')
    .replace(/<\/h2>/g, '\n\n')
    .replace(/<h3>/g, '### ')
    .replace(/<\/h3>/g, '\n\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<em>/g, '_')
    .replace(/<\/em>/g, '_')
    .replace(/<del>/g, '~~')
    .replace(/<\/del>/g, '~~')
    .replace(/<code>/g, '`')
    .replace(/<\/code>/g, '`')
    .replace(/<pre><code>/g, '```\n')
    .replace(/<\/code><\/pre>/g, '\n```\n')
    .replace(/<blockquote>/g, '> ')
    .replace(/<\/blockquote>/g, '\n\n')
    .replace(/<ul>/g, '')
    .replace(/<\/ul>/g, '\n')
    .replace(/<ol>/g, '')
    .replace(/<\/ol>/g, '\n')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/<hr>/g, '---\n\n')
    .replace(/<img[^>]+src="([^"]+)"[^>]*>/g, '![image]($1)\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

  // 使用 unified 处理 markdown 为 MDX
  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkStringify)
    .process(markdown)

  return String(file)
} 