import Link from 'next/link'
import notFound from '@/app/images/page-not-found.png'
import Image from 'next/image'
import Button from './components/Button/Button'

export default function NotFound() {
  return (
    <div className={'py-10 md:py-[80px] h-screen'}>
      <div
        className={
          'container md:px-6 lg:px-10 xl:px-0 h-full text-center flex justify-center flex-col'
        }
      >
        <Image
          src={notFound}
          quality={100}
          alt="404 page not found"
          className="mx-auto max-w-[300px] lg:max-w-[350px] mb-5"
        />
        <p>Could not find requested resource.</p>
        <div className={'w-fit mx-auto mt-5'}>
          <Link href="/" className="">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
