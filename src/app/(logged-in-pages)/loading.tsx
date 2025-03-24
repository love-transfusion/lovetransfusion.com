'use client'
import LoadingComponent from '@/app/components/Loading'

const Loader = () => {
  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white bg-opacity-15 z-[999]">
      <LoadingComponent />
    </div>
  )
}

export default Loader
