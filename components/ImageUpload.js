import { useState, useRef } from 'react'

export default function ImageUpload({ onUpload }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef()

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传图片失败')
    }
    setIsUploading(false)

    // 清除文件输入，允许重复上传相同文件
    fileInputRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {isUploading ? '上传中...' : '插入图片'}
      </button>
    </div>
  )
}
