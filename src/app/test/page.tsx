'use client'
import React from 'react'
import { ac_custom_removeProperty_from_contact } from '../utilities/activeCampaignFunctions'
import Input from '../components/inputs/basic-input/Input'
import Button from '../components/Button/Button'
import { useForm } from 'react-hook-form'
import { useStore } from 'zustand'
import utilityStore from '../utilities/store/utilityStore'

interface RawData {
  email: string
}

const TestPage = () => {
  const { settoast } = useStore(utilityStore)
  const { register, handleSubmit, reset } = useForm<RawData>()
  const onsubmit = async (rawData: RawData) => {
    const { error } = await ac_custom_removeProperty_from_contact({
      email: rawData.email,
      clTagRemove: 'test',
      clListRemove: 'Love Transfusion',
    })
    if (error) {
      settoast({ clDescription: error, clStatus: 'error' })
    } else {
      console.log({ error })
      settoast({
        clDescription: 'Successful',
        clStatus: 'success',
      })
    }
    reset()
  }
  return (
    <div className={'pb-10 pt-10 md:pb-20 md:pt-20'}>
      <div className={'container md:px-6 lg:px-10 xl:px-0 '}>
        <form onSubmit={handleSubmit(onsubmit)}>
          <Input clPlaceholder="email" {...register('email')} />
          <Button clType="submit">Submit</Button>
        </form>
      </div>
    </div>
  )
}

export default TestPage
