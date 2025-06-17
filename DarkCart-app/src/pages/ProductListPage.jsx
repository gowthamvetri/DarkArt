import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosTostError from '../utils/AxiosTostError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert.js'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  console.log(AllSubCategory)

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

console.log("categoryId", categoryId)
console.log("subCategoryId", subCategoryId)
  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosTostError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

console.log("data", data)
console.log(params)
  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      // Check if s.categoryId exists before trying to use it
      if (!s.categoryId) return false;
      
      const filterData = s.categoryId.some(el => {
        return el._id == categoryId;
      });
  
      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20 bg-gray-50">
    <div className="container mx-auto flex gap-4">

      {/* Sidebar - Sub Category */}
      <div className="w-[90px] md:w-[200px] lg:w-[280px] min-h-[88vh] max-h-[88vh] overflow-y-auto bg-white py-2 shadow-sm rounded-lg border border-gray-200 flex-shrink-0 hide-scrollbar">
        {DisplaySubCatory.map((s, index) => {  
          const link = `/${validURLConvert(s?.categoryId[0]?.name)}-${s?.categoryId[0]?._id}/${validURLConvert(s.name)}-${s._id}`;
          return (
            <Link
              to={link}
              key={index}
              className={`w-full p-3 flex flex-col lg:flex-row items-center lg:h-18 gap-2 lg:gap-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${
                subCategoryId === s._id ? "bg-gray-200 border-l-4 border-l-black" : ""
              }`}
            >
              <div className="w-15 h-15 flex justify-center items-center bg-gray-50 rounded-md border border-gray-200">
                <img
                  src={s.image}
                  alt="subCategory"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs lg:text-base text-center lg:text-left text-gray-900 font-medium">{s.name}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Content - Products */}
      <div className="flex-grow flex flex-col">
        {/* Subcategory Title */}
        <div className="bg-white shadow-sm p-4 sticky top-20 z-10 rounded-lg border border-gray-200 mb-4">
          <h3 className="font-bold text-xl text-gray-900 font-serif">{subCategoryName}</h3>
        </div>

        {/* Product Cards */}
        <div className="min-h-[70vh] max-h-[70vh] scrollbar-none flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((p, index) => (
              <CardProduct
                data={p}
                key={p._id + "productSubCategory" + index}
              />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          )}
        </div>
      </div>

    </div>
  </section>
  )
}

export default ProductListPage