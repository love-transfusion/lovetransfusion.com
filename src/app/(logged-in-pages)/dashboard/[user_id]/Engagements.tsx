'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Icon_facebook2 from '@/app/components/icons/Icon_facebook2'
import FacebookProfilePic from './FacebookProfilePic'
import anonymous from './images/user.webp'
import ltWebsiteIcon from './images/world-w.svg'
import { I_Comments } from '@/types/Comments.types'

type Props = { allEngagements: I_Comments[]; user_id: string }

const LS_LIMIT = 100

// Build a stable key even if your record has no `id`
const getKey = (e: I_Comments) => e.id

const listVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 3 } },
}

const rowVariants = {
  initial: { y: -14, opacity: 0, scale: 0.98 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  },
  exit: { y: -12, opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

const Engagements = ({ allEngagements, user_id }: Props) => {
  const LS_KEY = `engagements_seen_ids${user_id.replaceAll('-', '')}`

  // Always render newest on top
  const sorted = useMemo(() => {
    return allEngagements
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
  }, [allEngagements])

  // Track which keys are "new" this render
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set())
  const hasHydrated = useRef(false)

  useEffect(() => {
    // localStorage only after hydration
    const readSeen = (): Set<string> => {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return new Set()
        const arr = JSON.parse(raw) as string[]
        return new Set(arr)
      } catch {
        return new Set()
      }
    }

    const seen = readSeen()
    const currentKeys = sorted.map(getKey)

    // Anything not seen before is "new"
    const newlyArrived = currentKeys.filter((k) => !seen.has(k))
    setNewKeys(new Set(newlyArrived))

    // Persist current list (cap length)
    const nextSeen = [...new Set([...currentKeys, ...Array.from(seen)])].slice(
      0,
      LS_LIMIT
    )
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(nextSeen))
    } catch {
      // ignore quota/SSR
    }

    hasHydrated.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted])

  return (
    <motion.div
      className="divide-y divide-primary-200"
      variants={listVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence initial={false}>
        {sorted.map((item) => {
          const k = getKey(item)
          const isNew = newKeys.has(k)

          return (
            <motion.div
              key={k}
              layout // <- pushes existing rows down smoothly
              transition={{ layout: { duration: 0.75, ease: 'easeInOut' } }}
              variants={rowVariants}
              initial={isNew ? 'initial' : false}
              animate="animate"
              exit="exit"
              className={
                'relative flex gap-2 justify-between px-4 py-[7px] min-w-[9px] min-h-[9px] text-base bg-[#EEF6FC] first:bg-white first:scale-105 first:px-[23] first:shadow-[0px_0px_15px_0px_#2FABDD40] first:z-50 first:border-t first:border-primary first:rounded-[4px] first:font-semibold'
              }
            >
              <div className="flex items-center gap-3">
                {item.type === 'website' && (
                  <Image
                    src={
                      item.profile_picture_website &&
                      item.profile_picture_website.profile_picture?.fullPath
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_ORG_STORAGE_URL}/${item.profile_picture_website.profile_picture.fullPath}`
                        : anonymous
                    }
                    alt="Profile picture of engager"
                    quality={100}
                    width={37.8}
                    height={37.8}
                    className="border-[3px] border-[#288CCC] rounded-full min-w-[37.7px] min-h-[37.7px]"
                  />
                )}

                {item.type === 'facebook' && (
                  <FacebookProfilePic fbProfilePicURL={item.profile_picture} />
                )}

                <p className="text-[#009933] line-clamp-1">{item.name}</p>
              </div>

              {item.type === 'website' && (
                <Image
                  src={ltWebsiteIcon}
                  alt="LT Website Icon"
                  quality={100}
                  className="min-w-[21px]"
                />
              )}
              {item.type === 'facebook' && (
                <Icon_facebook2 className="text-primary my-auto min-w-[21px]" />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

export default Engagements
