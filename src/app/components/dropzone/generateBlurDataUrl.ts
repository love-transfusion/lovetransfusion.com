export const generateBlurDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return

      img.src = e.target.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 20
        canvas.height = 20
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, 20, 20)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
    }

    reader.readAsDataURL(file)
  })
}
