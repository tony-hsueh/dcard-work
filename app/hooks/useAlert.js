import { useEffect, useState } from "react";
import { STATUS } from "@/parameters";

const useAlert = () => {
  const [alertObj, setAlertObj] = useState({
    show: false,
    status: STATUS.success,
    msg: ''
  })
  useEffect(() => {
    let timer;
    if (alertObj.show) {
      timer = setTimeout(() => {
        setAlertObj(prev => {
          return {
            ...prev,
            show: false,
          }
        })
      }, 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [alertObj.show])
  return [
    alertObj,
    setAlertObj
  ]
}

export default useAlert