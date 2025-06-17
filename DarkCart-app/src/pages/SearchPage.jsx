import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosTostError";
import { use } from "react";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import emptyImg from "../assets/noData.jpg";

function SearchPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const perams = useLocation();
  const searchText = perams?.search?.slice(3);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData((prevData) => [...prevData, ...responseData.data]);
        }
        // console.log(responseData)
        setPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreData = () => {
    if (totalPage > page) {
      setPage((prevPage) => prevPage + 1);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-18 py-10">
        <p className="font-semibold">Search Result: {data.length}</p>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleMoreData}
        >
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-5">
            {/* data */}
            {data.map((item, index) => {
              return (
                <CardProduct
                  data={item}
                  key={item?._id + "searchProduct" + index}
                />
              );
            })}

            {/* loading data */}
            {loading &&
              loadingArrayCard.map((_, index) => {
                return <CardLoading key={"loadingsearchpage" + index} />;
              })}
          </div>
        </InfiniteScroll>
        {!data[0] && !loading && (
          <div className="flex flex-col justify-center items-center py-10 ">
            <img
              src={emptyImg}
              alt="no data"
              className="min-h-[5vh] max-h-[50vh]"
            />
            <p className="text-center font-semibold">No results found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchPage;
