import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useNavigate } from 'react-router-dom';
import AddAddress from '../components/AddAddress';
import Axios from '../utils/Axios';
import Summaryapi from '../common/Summaryapi';
import AxiosToastError from '../utils/AxiosToastError';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
    const [openAddress, setOpenAddress] = useState(false);
    const [selectAddress, setSelectAddress] = useState(0);
    const addressList = useSelector(state => state.addresses.addressList);
    const cartItemsList = useSelector(state => state.cartItem.cart);
    const navigate = useNavigate();

    const handleCashOnDelivery = async () => {
        try {
            const response = await Axios({
                ...Summaryapi.CashOnDeliveryOrder,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: totalPrice,
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem?.();
                fetchOrder?.();
                navigate('/success', { state: { text: "Order" } });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    // const handleOnlinePayment = async () => {
    //     try {
    //         toast.loading("Loading...");
    //         const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    //         const stripePromise = await loadStripe(stripePublicKey);

    //         const response = await Axios({
    //             ...Summaryapi.payment_url,
    //             data: {
    //                 list_items: cartItemsList,
    //                 addressId: addressList[selectAddress]?._id,
    //                 subTotalAmt: totalPrice,
    //                 totalAmt: totalPrice,
    //             }
    //         });

    //         const { data: responseData } = response;
    //         stripePromise.redirectToCheckout({ sessionId: responseData.id });

    //         fetchCartItem?.();
    //         fetchOrder?.();
    //     } catch (error) {
    //         AxiosToastError(error);
    //     }
    // };

    return (
        <section className="bg-blue-50">
            <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
                {/* Address Section */}
                <div className="w-full">
                    <h3 className="text-lg font-semibold">Choose your address</h3>
                    <div className="bg-white p-2 grid gap-4">
                        {addressList.map((address, index) => (
                            <label
                                key={address._id || index}
                                htmlFor={`address${index}`}
                                className={!address.status ? 'hidden' : ''}
                            >
                                <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                                    <div>
                                        <input
                                            id={`address${index}`}
                                            type="radio"
                                            value={index}
                                            onChange={(e) => setSelectAddress(Number(e.target.value))}
                                            name="address"
                                        />
                                    </div>
                                    <div>
                                        <p>{address.address_line}</p>
                                        <p>{address.city}</p>
                                        <p>{address.state}</p>
                                        <p>{address.country} - {address.pincode}</p>
                                        <p>{address.mobile}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div
                        onClick={() => setOpenAddress(true)}
                        className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
                    >
                        Add address
                    </div>
                </div>

                {/* Summary Section */}
                <div className="w-full max-w-md bg-white py-4 px-2">
                    <h3 className="text-lg font-semibold">Summary</h3>
                    <div className="bg-white p-4">
                        <h3 className="font-semibold">Bill details</h3>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Items total</p>
                            <p className="flex items-center gap-2">
                                <span className="line-through text-neutral-400">
                                    {DisplayPriceInRupees(notDiscountTotalPrice)}
                                </span>
                                <span>{DisplayPriceInRupees(totalPrice)}</span>
                            </p>
                        </div>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Quantity total</p>
                            <p className="flex items-center gap-2">{totalQty} item</p>
                        </div>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Delivery Charge</p>
                            <p className="flex items-center gap-2">Free</p>
                        </div>
                        <div className="font-semibold flex items-center justify-between gap-4">
                            <p>Grand total</p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4 mt-4">
                        {/* <button
                            className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
                            onClick={handleOnlinePayment}
                        >
                            Online Payment
                        </button> */}

                        <button
                            className="py-2 px-4 border-2 cursor-pointer border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
                            onClick={handleCashOnDelivery}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>

            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        </section>
    );
};

export default CheckoutPage;
