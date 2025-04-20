'use client'
import { Button } from 'antd-mobile'
import { pxToRem } from '~/lib/utils/common';
export default function Page() {
  return <div>
    <Button 
      color="primary" 
      shape="rounded" 
      size="large"
      style={{
        width: pxToRem(300),
        height: pxToRem(50)
      }}
    >
      Antd Button
    </Button>
  </div>;
}