import React, { useState } from 'react'
import { ethers } from 'ethers'
import './index.scss'
import { Select } from 'antd'
import HelloV from './Items/01HelloV'
import Provider from './Items/02Provider'
const Training: React.FC = () => {
  const [training, setTraining] = useState<string>(localStorage.getItem('training') || '01HelloV')

  const options = [
    {
      label: 'HelloV',
      value: '01HelloV',
      component: <HelloV />
    },
    {
      label: 'Provider',
      value: '02Provider',
      component: <Provider />
    }
  ]

  const handleChange = (value: string) => {
    localStorage.setItem('training', value)
    setTraining(value)
  }

  return (
    <div className="training w-full h-full  p-[20px] box-border">
      <Select
        className="w-[160px] h-[40px]"
        options={options}
        placeholder="请选择训练"
        value={training}
        onChange={handleChange}
      />
      <div className="training-content h-[calc(100%-40px)] mt-3 w-full ">
        {options.find((item) => item.value === training)?.component}
      </div>
    </div>
  )
}

export default Training
