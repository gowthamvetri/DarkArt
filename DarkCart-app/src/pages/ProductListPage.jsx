import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosTostError from "../utils/AxiosTostError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
// import { valideURLConvert } from "../utils/validURLConvert";
import Loading from "../components/Loading";

const ProductListPage = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const AllCategory = useSelector((state) => state.product.allCategory);

  const categoryName = params.category?.split("-")?.slice(0, -1)?.join(" ");
  const categoryId = params.category?.split("-")?.slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: categoryId,
          page: page,
          limit: 12,
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  return (
    <section className="sticky top-24 lg:top-20 bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Category Title */}
        <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-bold text-xl text-gray-900 font-serif">{categoryName}</h3>
        </div>

        {/* Product Cards */}
        <div className="min-h-[70vh] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((p, index) => (
              <CardProduct
                data={p}
                key={p._id + "productCategory" + index}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          )}

          {/* Load More Button */}
          {data.length < totalPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;