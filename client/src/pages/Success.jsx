import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import Summaryapi from '../common/Summaryapi'
import toast from 'react-hot-toast'

const Success = () => {
  const location = useLocation()
  const { fetchCartItem, fetchOrder } = useGlobalContext()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const isPaymentSuccess = searchParams.get('payment') === 'success'

    if (isPaymentSuccess) {
      // Call backend (optional)
      // or just empty frontend cart
      Axios.get('/api/cart/clear-local') // or any dummy call
        .finally(() => {
          if (fetchCartItem) fetchCartItem()
          if (fetchOrder) fetchOrder()
          toast.success("Payment successful and cart cleared ✅")
        })
    }
  }, [])

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center'>
        {(location?.state?.text || "Payment")} Successfully
      </p>
      <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link>
    </div>
  )
}

export default Success
