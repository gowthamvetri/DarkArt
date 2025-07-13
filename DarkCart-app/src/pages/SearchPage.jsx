import React, { useEffect, useState, useCallback } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosTostError";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import emptyImg from "../assets/productDescriptionImages/Empty-pana.png";

function SearchPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadingArrayCard = new Array(10).fill(null);
  const params = useLocation();
  const searchText = params?.search?.slice(3) || "";

  const fetchData = useCallback(
    async (pageNumber = 1, resetData = false) => {
      try {
        setLoading(true);

        const response = await Axios({
          ...SummaryApi.searchProduct,
          data: {
            search: searchText,
            page: pageNumber,
          },
        });

        const { data: responseData } = response;
        console.log("API Response:", responseData);

        if (responseData.success) {
          // Set total pages from API response
          setTotalPage(responseData.totalNoPage);

          if (pageNumber === 1 || resetData) {
            // Reset data for new search or first page
            setData(responseData.data);
          } else {
            // Append data for pagination
            setData((prevData) => [...prevData, ...responseData.data]);
          }

          // Update hasMore based on current page vs total pages
          setHasMore(pageNumber < responseData.totalNoPage);

          console.log(`Page ${pageNumber} of ${responseData.totalNoPage} loaded`);
        }
      } catch (error) {
        AxiosToastError(error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [searchText]
  );

  const handleMoreData = useCallback(() => {
    console.log("handleMoreData called");
    console.log("Current page:", page);
    console.log("Total pages:", totalPage);
    console.log("Has more:", hasMore);

    if (hasMore && page < totalPage && !loading) {
      const nextPage = page + 1;
      console.log("Loading page:", nextPage);
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [hasMore, page, totalPage, loading, fetchData]);

  // Handle search text changes
  useEffect(() => {
    console.log("Search text changed:", searchText);
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchData(1, true);
  }, [searchText, fetchData]);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-18 py-10">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {searchText ? "Search Results" : "All Products"}
          </h2>
          {searchText && (
            <p className="text-gray-600 mb-2">
              Showing results for:{" "}
              <span className="font-semibold">"{searchText}"</span>
            </p>
          )}
          <p className="font-semibold text-gray-700">
            Found: {data.length} results
            {totalPage > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (Page {page} of {totalPage})
              </span>
            )}
          </p>
        </div>

        {/* Products Display */}
        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          next={handleMoreData}
          loader={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 py-4">
              {loadingArrayCard.slice(0, 5).map((_, index) => (
                <CardLoading key={"loadingMore" + index} />
              ))}
            </div>
          }
          endMessage={
            data.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium">
                  {searchText
                    ? `You've seen all results for "${searchText}"`
                    : "You've seen all products"}
                </p>
              </div>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-5">
            {/* Product Results */}
            {data.map((item, index) => (
              <CardProduct
                data={item}
                key={item?._id + "searchProduct" + index}
              />
            ))}
          </div>
        </InfiniteScroll>

        {/* Initial Loading */}
        {loading && page === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-5">
            {loadingArrayCard.map((_, index) => (
              <CardLoading key={"loadingInitial" + index} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!data.length && !loading && (
          <div className="flex flex-col justify-center items-center py-16">
            <img
              src={emptyImg}
              alt="No results found"
              className="w-64 h-64 object-contain mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchText ? "No results found" : "No products available"}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {searchText ? (
                <>
                  We couldn't find any products matching "{searchText}".
                  <br />
                  Try different keywords or browse all products.
                </>
              ) : (
                "There are currently no products available."
              )}
            </p>
          </div>
        )}

        {/* Debug Info (Remove in production) */}

      </div>
    </section>
  );
}

export default SearchPage;
