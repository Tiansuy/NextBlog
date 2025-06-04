import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import { NodeSelection } from '@tiptap/pm/state'
import ImageUpload from './ImageUpload'

// 预设的图片尺寸选项
const IMAGE_SIZES = [
  { label: '100%', value: 100 },
  { label: '80%', value: 80 },
  { label: '60%', value: 60 },
  { label: '50%', value: 50 },
  { label: '30%', value: 30 },
]

// 自定义图片扩展
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 100,
        parseHTML: (element) => {
          const width = element.style.width
          return width ? parseInt(width, 10) : 100
        },
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {}
          }
          return {
            style: `width: ${attributes.size}%`,
          }
        },
      },
      alignment: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-alignment'),
        renderHTML: (attributes) => {
          if (!attributes.alignment) {
            return {}
          }

          let style = ''
          if (attributes.alignment === 'center') {
            style = 'margin-left: auto; margin-right: auto; display: block;'
          } else if (attributes.alignment === 'right') {
            style = 'margin-left: auto; display: block;'
          }

          return {
            'data-alignment': attributes.alignment,
            style: style + (attributes.size ? `width: ${attributes.size}%;` : ''),
          }
        },
      },
    }
  },
})

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const handleImageUpload = (url) => {
    editor.chain().focus().setImage({ src: url }).run()
  }

  const handleImageResize = (size) => {
    const { state } = editor
    const { selection } = state
    const pos = selection.$anchor.pos
    const node = selection.node

    if (node && node.type.name === 'image') {
      editor.chain().focus().setNodeSelection(pos).updateAttributes('image', { size }).run()
    }
  }

  const handleImageAlign = (alignment) => {
    const { state } = editor
    const { selection } = state
    const pos = selection.$anchor.pos
    const node = selection.node

    if (node && node.type.name === 'image') {
      editor.chain().focus().setNodeSelection(pos).updateAttributes('image', { alignment }).run()
    }
  }

  // 获取当前选中的图片节点
  const selectedImage =
    editor.state.selection instanceof NodeSelection &&
    editor.state.selection.node.type.name === 'image'
      ? editor.state.selection.node
      : null

  return (
    <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('bold')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        粗体
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('italic')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        斜体
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('strike')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        删除线
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('code')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        行内代码
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('codeBlock')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        代码块
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('bulletList')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        无序列表
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('orderedList')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        有序列表
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`rounded px-2 py-1 ${
          editor.isActive('blockquote')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        引用
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        分割线
      </button>
      <ImageUpload onUpload={handleImageUpload} />

      {/* 图片控制面板 */}
      {selectedImage && (
        <div className="ml-4 flex items-center gap-4 rounded bg-gray-100 p-2 dark:bg-gray-800">
          {/* 尺寸控制 */}
          <div className="flex items-center gap-2">
            <label className="text-sm">尺寸:</label>
            <div className="flex gap-1">
              {IMAGE_SIZES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleImageResize(value)}
                  className={`rounded px-2 py-1 text-sm ${
                    selectedImage.attrs.size === value
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 对齐控制 */}
          <div className="flex items-center gap-2">
            <label className="text-sm">对齐:</label>
            <div className="flex gap-1">
              <button
                onClick={() => handleImageAlign('left')}
                className={`rounded px-2 py-1 text-sm ${
                  selectedImage.attrs.alignment === 'left'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                左对齐
              </button>
              <button
                onClick={() => handleImageAlign('center')}
                className={`rounded px-2 py-1 text-sm ${
                  selectedImage.attrs.alignment === 'center'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                居中
              </button>
              <button
                onClick={() => handleImageAlign('right')}
                className={`rounded px-2 py-1 text-sm ${
                  selectedImage.attrs.alignment === 'right'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                右对齐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PostEditor = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      CustomImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: '开始写作...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose min-h-[500px] max-w-none rounded-lg border p-4 focus:outline-none dark:prose-invert"
      />
    </div>
  )
}

export default PostEditor
