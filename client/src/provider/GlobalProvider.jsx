import { createContext, useContext, useEffect } from "react";
import Axios from "../utils/Axios";
import Summaryapi from "../common/Summaryapi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useState } from "react";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";


export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user)
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const cartItem = useSelector((state) => state.cartItem.cart);
  console.log("cartItem", cartItem)
  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...Summaryapi.getCartItem
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data))
        console.log("responseCartdata", responseData)
      }

    } catch (error) {
      console.log(error)
    }
  }
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...Summaryapi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItem()
        return responseData
      }
    } catch (error) {
      AxiosToastError(error)
      return error
    }
  }
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...Summaryapi.deleteCartItem,
        data: {
          _id: cartId
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItem()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity
    }, 0)
    setTotalQty(qty)

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount)

      return preve + (priceAfterDiscount * curr.quantity)
    }, 0)
    setTotalPrice(tPrice)

    const notDiscountPrice = cartItem.reduce((preve, curr) => {
      return preve + (curr?.productId?.price * curr.quantity)
    }, 0)
    setNotDiscountTotalPrice(notDiscountPrice)
  }, [cartItem])
  const handleLogoutOut = () => {
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...Summaryapi.getAddress
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...Summaryapi.getOrderItems,
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setOrder(responseData.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user && user._id) {
      fetchCartItem();
      fetchAddress();
      fetchOrder();
    }
  }, [user])

  return (
    <GlobalContext.Provider value={{
      fetchCartItem,
      updateCartItem,
      deleteCartItem,
      fetchAddress,
      totalPrice, totalQty, notDiscountTotalPrice, fetchOrder
    }}>
      {children}
    </GlobalContext.Provider>
  )
}
export default GlobalProvider