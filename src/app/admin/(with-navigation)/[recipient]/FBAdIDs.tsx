'use client'
import Icon_down_left from '@/app/components/icons/Icon_down_left'
import Icon_pencil from '@/app/components/icons/Icon_pencil'
import Icon_right from '@/app/components/icons/Icon_right'
import Icon_trash from '@/app/components/icons/Icon_trash'
import Input from '@/app/components/inputs/basic-input/Input'
import { regex } from '@/app/lib/regex/regexCheck'
import utilityStore from '@/app/utilities/store/utilityStore'
import React, {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useStore } from 'zustand'

interface FBAdIDsTypes {
  setFBAdIDs: Dispatch<SetStateAction<string[]>>
  FBAdIDsArray: string[]
  existingAdIDs: string[] | null
  setisFBAdIDActive: Dispatch<SetStateAction<boolean>>
}

const FBAdIDs = ({
  FBAdIDsArray,
  setFBAdIDs,
  existingAdIDs,
  setisFBAdIDActive,
}: FBAdIDsTypes) => {
  const [isEdit, setisEdit] = useState<string | null>(null)
  const [inputValue, setinputValue] = useState<string>('')
  const { settoast } = useStore(utilityStore)

  const checkValidity = () => {
    if (!inputValue.trim()) return false
    if (inputValue.length > 22 || !regex.isNumber(inputValue)) {
      settoast({
        clDescription: 'The Ad ID you entered is invalid.',
        clStatus: 'error',
      })
      return false
    }
    return true
  }

  const appendCurrentInputValue = () => {
    if (
      FBAdIDsArray.includes(inputValue) ||
      existingAdIDs?.includes(inputValue)
    ) {
      settoast({
        clDescription: 'The Ad ID you entered already exist',
        clStatus: 'error',
      })
      return
    }

    const isValid = checkValidity()
    if (!isValid) return

    setFBAdIDs((prev) => {
      return [...prev, inputValue]
    })
    setinputValue('')
  }

  const handleSaveEdit = () => {
    if (
      FBAdIDsArray.includes(inputValue) ||
      existingAdIDs?.includes(inputValue)
    ) {
      settoast({
        clDescription: 'The Ad ID you entered already exist',
        clStatus: 'error',
      })
      return
    }

    const isValid = checkValidity()
    if (!isValid) return

    setFBAdIDs((prev) => {
      return prev.map((i) => {
        if (i === isEdit) {
          return inputValue
        } else {
          return i
        }
      })
    })
    setisEdit(null)
    setinputValue('')
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setinputValue(e.target.value)
  }

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isEdit) {
      e.preventDefault()
      appendCurrentInputValue()
    } else {
      if (e.key === 'Enter' && isEdit) {
        handleSaveEdit()
      }
    }
  }

  const handleDelete = (item: string) => {
    setFBAdIDs((prev) => prev.filter((i) => i !== item))
  }

  const handleEdit = (item: string) => {
    setisEdit(item)
    setinputValue(item)
  }

  const handleDiscard = () => {
    setisEdit(null)
    setinputValue('')
  }

  useEffect(() => {
    if (inputValue) {
      setisFBAdIDActive(true)
    } else {
      setisFBAdIDActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])
  return (
    <div>
      <p className={'mt-5 mb-2 font-semibold'}>Facebook Ad IDs</p>
      <div className={''} title="Ad IDs">
        {FBAdIDsArray.map((item) => {
          return (
            <div key={item}>
              {isEdit !== item ? (
                <div className="flex items-center gap-5">
                  <div className="flex gap-2 items-center py-[6px]">
                    <Icon_right className="text-neutral-400" />{' '}
                    <p className={'min-w-[160px]'}>{item}</p>
                  </div>
                  <div className="flex gap-1 text-primary">
                    <Icon_pencil
                      className="cursor-pointer select-none"
                      onClick={() => handleEdit(item)}
                    />
                    <Icon_trash
                      className="cursor-pointer select-none"
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <Input
                    clPlaceholder="Type facebook Ad ID"
                    className="placeholder:text-neutral-400 border-black py-2"
                    clVariant="input2"
                    clContainerClassName="w-full"
                    onChange={handleChange}
                    onKeyDown={handleKeydown}
                    clValue={inputValue}
                  />
                  <div
                    className="flex items-center justify-center min-w-10 min-h-[42px] bg-primary rounded-md cursor-pointer select-none"
                    onClick={handleSaveEdit}
                  >
                    <Icon_down_left className="text-white" />
                  </div>
                  <div
                    className="flex items-center justify-center min-w-[80px] min-h-[42px] bg-primary rounded-md cursor-pointer text-white"
                    onClick={handleDiscard}
                  >
                    <p className={''}>Discard</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {!isEdit && (
        <div className="flex gap-3 items-center mt-3">
          <Input
            clPlaceholder="Type facebook Ad ID"
            className="placeholder:text-neutral-400 border-black py-2"
            clVariant="input2"
            clContainerClassName="w-full"
            onChange={handleChange}
            onKeyDown={handleKeydown}
            clValue={inputValue}
          />
          <div
            className="flex items-center justify-center min-w-10 min-h-[42px] bg-primary rounded-md cursor-pointer select-none"
            onClick={appendCurrentInputValue}
          >
            <Icon_down_left className="text-white" />
          </div>
        </div>
      )}
    </div>
  )
}

export default FBAdIDs
