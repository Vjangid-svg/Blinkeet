  import React from "react";
  import { useEffect } from "react";
  import { useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import AxiosToastError from "../utils/AxiosToastError";
  import { useSelector } from "react-redux";
  import Summaryapi from "../common/Summaryapi";
  import Axios from "../utils/Axios";
  import Loading from "../components/Loading";
  import CardProduct from "../components/CardProduct";
  import { validURLConvert } from "../utils/validURLConvert";
  const ProductListPage = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
      const [DisplaySubCatory, setDisplaySubCategory] = useState([]);
    const params = useParams();

      const AllSubCategory = useSelector((state) => state.product.allSubCategory);
    const subCategory = params?.subCategory?.split("-");
    const subCategoryName = subCategory
      ?.slice(0, subCategory?.length - 1)
      ?.join(" ");

    const categoryId = params.category.split("-").slice(-1)[0];

    const subCategoryId = params.subCategory.split("-").slice(-1)[0];
    const fetchProductdata = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          ...Summaryapi.getProductByCategoryAndSubCategory,
          data: {
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            page: page,
            limit: 8,
          },
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
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchProductdata();
    }, [params]);
    
      useEffect(() => {
        const sub = AllSubCategory.filter((s) => {
          const filterData = s.category.some((el) => {
            return el._id == categoryId;
          });
    
          return filterData ? filterData : null;
        });
        setDisplaySubCategory(sub);
      }, [params, AllSubCategory]);

    return (
      <section className="sticky top-24 lg:top-20">
        <div className="container sticky top-24 mx-auto flex flex-col lg:grid lg:grid-cols-[320px_1fr]">
            {/**sub category **/}
          <div className="w-full  lg:w-[320px] flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-scroll shadow-md scrollbar scrollbar-thumb-gray-300 bg-white py-2 gap-2 px-2">
            {DisplaySubCatory.map((s, index) => {
              const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`;
              return (
                <Link
                  key={index}
                  to={link}
                  className={`sm:min-w-[100px]  flex-shrink-0 flex flex-col items-center justify-center border rounded-md p-2 hover:bg-green-100 cursor-pointer ${subCategoryId === s._id ? "bg-green-100" : ""
                    }`}
                >
                  <img
                    src={s.image}
                    alt="subCategory"
                    className="w-12 h-12 object-contain"
                  />
                  <p className="text-xs text-center">{s.name}</p>
                </Link>
              );
            })}
          </div>

          {/* Product */}
          <div className=" w-full">
            <div className="bg-white sticky top-20 shadow-md p-4 z-10">
              <h3 className="font-semibold">{subCategoryName}</h3>
            </div>
            <div>
              <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
                <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 ">
                  {data.map((p, index) => {
                    return (
                      <CardProduct
                        data={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    );
                  })}
                </div>
              </div>

              {loading && <Loading />}
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default ProductListPage;
