import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const [OpenAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [setAddress, setSetAddress] = useState(0);
  console.log(setAddress);

  return (
    <section className="bg-blue-50 ">
      <div className="container mx-auto p-4 flex flex-col gap-5 w-full lg:flex-row justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold">Choose your address</h3>

          <div>
            {addressList.map((address, index) => (
              <label htmlFor={`address-${index}`} key={address._id} className="cursor-pointer">
                <div
                  key={address._id}
                  className="bg-white p-4 mb-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex gap-4"
                >
                  <div>
                    <input
                      id={`address-${index}`}
                      type="radio"
                      name="address"
                      value={index}
                      onClick={() => setSetAddress(index)}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{address.address_line}</h4>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p>{address.country}</p>
                    <p>Mobile: {address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div
            onClick={() => setOpenAddress(true)}
            className="h-16 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors duration-200"
          >
            Add address
          </div>
          
        </div>
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
              <p>Quntity total</p>
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
          <div className="w-full flex flex-col gap-4">
            <button className="bg-green-500 px-4 py-2 text-white font-semibold rounded hover:bg-green-700">
              Online Payment
            </button>
            <button className="px-4 py-2 border-2 border-green-500 text-green-500 font-semibold rounded hover:bg-green-500 hover:text-white">
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {OpenAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
