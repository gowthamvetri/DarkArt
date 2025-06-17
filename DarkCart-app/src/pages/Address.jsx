import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressData from "../components/EditAddressData";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTostError";
import { useGlobalContext } from "../provider/GlobalProvider";

function Address() {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDelete = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddress();
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <div className="">
      <div className="bg-white p-4 mb-4 shadow-lg flex justify-between items-center rounded-lg">
        <h1 className=" font-semibold text-ellipsis line-clamp-1">Address</h1>
        <button
          onClick={() => setOpenAddress(true)}
          className="border-2 border-yellow-400 text-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-400 hover:text-white"
        >
          Add Address
        </button>
      </div>
      <div className="bg-blue-50 p-2">
        {addressList.map((address, index) => (
          <div
            key={address._id}
            className={`${address.status ? "bg-gray-100" : "hidden"} bg-white p-4 mb-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex gap-4`}
          >
            <div className="w-full">
              <h4 className="font-semibold">{address.address_line}</h4>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>{address.country}</p>
              <p>Mobile: {address.mobile}</p>
            </div>

            <div className="flex flex-col justify-between items-center">
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(address);
                }}
                className="bg-green-200 p-2 rounded hover:bg-green-600 hover:text-white transition-colors"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(address._id)}
                className="bg-red-200 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={() => setOpenAddress(true)}
        className="h-16 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors duration-200"
      >
        Add address
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {openEdit && (
        <EditAddressData close={() => setOpenEdit(false)} data={editData} />
      )}
    </div>
  );
}

export default Address;
