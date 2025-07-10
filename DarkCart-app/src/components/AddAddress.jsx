import React from "react";
import { useForm } from "react-hook-form";
import Axios from "../utils/Axios"; 
import SummaryApi from "../common/SummaryApi.js";
import {toast} from "react-hot-toast"
import AxiosToastError from "../utils/AxiosTostError.js";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";

const AddAddress = ({ close }) => {
  const { register, handleSubmit,reset } = useForm();
  const {fetchAddress} = useGlobalContext();

  const onSubmit = async(data) => {
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          mobile: data.mobile,
          addIframe: data.addIframe
        }
      })

      const {data:responseData} = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if(close) {
          close();
          reset(); // Reset the form fields after successful submission
          fetchAddress(); // Fetch the updated address list
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-black/70 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0 z-50 overflow-auto h-screen">
      <div className="bg-white p-8 w-full max-w-lg mt-10 mx-auto rounded-lg shadow-xl relative border border-gray-100">
        <button
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-800 text-3xl transition-colors"
          onClick={close}
        >
          &times;
        </button>
        <h2 className="font-bold text-xl text-gray-900 font-serif mb-2">Add New Address</h2>
        <p className="text-gray-600 text-sm mb-6">Please fill in your delivery address details</p>
        
        <form action="" className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label htmlFor="addressline" className="font-medium text-gray-700">Address Line:</label>
            <input
              type="text"
              id="addressline"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your street address"
              {...register("addressline",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="city" className="font-medium text-gray-700">City:</label>
            <input
              type="text"
              id="city"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your city"
              {...register("city",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="state" className="font-medium text-gray-700">State:</label>
            <input
              type="text"
              id="state"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your state"
              {...register("state",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="pincode" className="font-medium text-gray-700">Pincode:</label>
            <input
              type="text"
              id="pincode"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your pincode"
              {...register("pincode",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="country" className="font-medium text-gray-700">Country:</label>
            <input
              type="text"
              id="country"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your country"
              {...register("country",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="mobile" className="font-medium text-gray-700">Mobile Number:</label>
            <input
              type="text"
              id="mobile"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter your mobile number"
              {...register("mobile",{required: true})}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="addIframe" className="font-medium text-gray-700">Add Iframe:<span className="text-gray-500"> Go to google map and copy the iframe embed code(delivery address)</span></label>
            <input
              type="text"
              id="addIframe"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="Enter iframe URL (optional)"
              {...register("addIframe")}
            />
          </div>

          <button type="submit" className="bg-black hover:bg-gray-800 text-white w-full p-3 rounded-md mt-6 transition-colors font-semibold tracking-wide">
            Add Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
