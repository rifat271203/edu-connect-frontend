interface UploadedFile {
  fileUrl: string
  fileName: string
  mimeType: string
  size: number
}

export const useFileUpload = () => {
  const uploading = ref(false)
  const error = ref('')

  const upload = async (file: File): Promise<UploadedFile | null> => {
    if (!file) return null
    error.value = ''
    uploading.value = true

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { $api } = useNuxtApp()
      const response = await $api<{ fileUrl?: string; url?: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const fileUrl = response.fileUrl || response.url
      if (!fileUrl) {
        throw new Error('Upload API did not return a file URL')
      }

      return {
        fileUrl,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      }
    } catch (uploadError) {
      error.value = uploadError instanceof Error ? uploadError.message : 'Failed to upload file'

      if (process.client) {
        return {
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        }
      }

      return null
    } finally {
      uploading.value = false
    }
  }

  return {
    uploading,
    error,
    upload,
  }
}

