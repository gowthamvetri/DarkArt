import React from "react";
import SummaryApi from "../common/SummaryApi.js";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AxiosTostError from "../utils/AxiosTostError.js";
import Axios from "../utils/Axios.js";
import Loading from "../components/Loading.jsx";
import ProductCardAdmin from "../components/ProductCardAdmin.jsx";
import { IoSearchOutline } from "react-icons/io5";
const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 10,
          search: search,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
        setTotalPageCount(responseData.totalNoPage);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [page]);
  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };
  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="">
      <div className="p-2  bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded  border focus-within:border-blue-200">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here ..."
            className="h-full w-full  outline-none bg-transparent"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>
      {loading && <Loading />}
      <div className="p-4 bg-blue-50 grid">
        <div className="min-h-[55vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {productData.map((p, index) => {
              return <ProductCardAdmin data={p} 
              fetchProductData={fetchProductData}/>;
            })}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border border-blue-200 px-4 py-1 hover:bg-blue-200"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border border-blue-200 px-4 py-1 hover:bg-blue-200"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
