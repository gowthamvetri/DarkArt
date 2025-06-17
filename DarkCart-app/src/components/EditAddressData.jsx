import React from "react";
import { useForm } from "react-hook-form";
import Axios from "../utils/Axios"; 
import SummaryApi from "../common/SummaryApi.js";
import {toast} from "react-hot-toast"
import AxiosToastError from "../utils/AxiosTostError.js";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";

const EditAddressData = ({ close, data }) => {
    console.log(data);
  const { register, handleSubmit,reset } = useForm({
    defaultValues: {
        _id: data._id || "",
        userId : data.userId || "",
        address_line: data.address_line || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        country: data.country || "",
        mobile: data.mobile || ""
        }
  });
  const {fetchAddress} = useGlobalContext();
  const onSubmit = async(data) => {
    try {
        const response = await Axios({
          ...SummaryApi.editAddress,
          data: {
            ...data,
            _id: data._id,
            userId: data.userId,
            address_line: data.address_line,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            country: data.country,
            mobile: data.mobile
          }
        });

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
    <section className="bg-black/50 fixed top-0 left-0 right-0 bottom-0 z-50 overflow-auto h-screen">
      <div className="bg-white p-6 w-full max-w-lg mt-10 mx-auto rounded shadow-lg relative ">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={close}
        >
          &times;
        </button>
        <h2 className="font-semibold text-gray-900">Edit Address</h2>
        <form action="" className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label htmlFor="addressline" className="font-medium text-gray-700">Address Line:</label>
            <input
              type="text"
              id="addressline"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("address_line",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="city" className="font-medium text-gray-700">City :</label>
            <input
              type="text"
              id="city"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("city",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="state" className="font-medium text-gray-700">State :</label>
            <input
              type="text"
              id="state"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("state",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="pincode" className="font-medium text-gray-700">Pincode :</label>
            <input
              type="text"
              id="pincode"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("pincode",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="country" className="font-medium text-gray-700">Country :</label>
            <input
              type="text"
              id="country"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("country",{required: true})}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="mobile" className="font-medium text-gray-700">Mobile No :</label>
            <input
              type="text"
              id="mobile"
              className="border border-gray-300 bg-gray-50 p-3 rounded-md outline-none focus:border-black focus:bg-white transition-colors"
              {...register("mobile",{required: true})}
            />
          </div>

          <button type="submit" className="bg-black text-white w-full p-3 rounded-md mt-4 hover:bg-gray-800 transition-colors font-semibold tracking-wide">
            Update Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditAddressData;
