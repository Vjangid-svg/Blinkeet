import React, { useEffect, useState } from 'react'
import Summaryapi from '../common/Summaryapi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'

const Product = async() => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  
  const fetchProductData = async()=>{
    try {
        const response = await Axios({
           ...Summaryapi.getProduct,
           data : {
              page : page,
           }
        })

        const { data : responseData } = response 

        console.log("product page ",responseData)
        if(responseData.success){
          setProductData(responseData.data)
          toast.success(responseData.message)
        }

    } catch (error) {
      AxiosToastError(error)
    }
  }
  
  console.log("product page")
  useEffect(()=>{
    fetchProductData()
  },[])

  return (
    <div>
      Product
    </div>
  )
}

export default Product
