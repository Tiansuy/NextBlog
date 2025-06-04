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
        parseHTML: element => {
          const width = element.style.width
          return width ? parseInt(width, 10) : 100
        },
        renderHTML: attributes => {
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
        parseHTML: element => element.getAttribute('data-alignment'),
        renderHTML: attributes => {
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
  const selectedImage = editor.state.selection instanceof NodeSelection && 
                       editor.state.selection.node.type.name === 'image' 
                       ? editor.state.selection.node 
                       : null

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-4 pb-4 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bold')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        粗体
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('italic')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        斜体
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('strike')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        删除线
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('code')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        行内代码
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('codeBlock')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        代码块
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('bulletList')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        无序列表
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('orderedList')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        有序列表
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive('blockquote')
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        引用
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        分割线
      </button>
      <ImageUpload onUpload={handleImageUpload} />
      
      {/* 图片控制面板 */}
      {selectedImage && (
        <div className="flex items-center gap-4 ml-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          {/* 尺寸控制 */}
          <div className="flex items-center gap-2">
            <label className="text-sm">尺寸:</label>
            <div className="flex gap-1">
              {IMAGE_SIZES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleImageResize(value)}
                  className={`px-2 py-1 rounded text-sm ${
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
                className={`px-2 py-1 rounded text-sm ${
                  selectedImage.attrs.alignment === 'left'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                左对齐
              </button>
              <button
                onClick={() => handleImageAlign('center')}
                className={`px-2 py-1 rounded text-sm ${
                  selectedImage.attrs.alignment === 'center'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                居中
              </button>
              <button
                onClick={() => handleImageAlign('right')}
                className={`px-2 py-1 rounded text-sm ${
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
        className="prose dark:prose-invert max-w-none min-h-[500px] border rounded-lg p-4 focus:outline-none"
      />
    </div>
  )
}

export default PostEditor 