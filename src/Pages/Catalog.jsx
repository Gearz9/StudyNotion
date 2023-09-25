import React from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import CatalogCourseCard from "../components/core/Catalog/CatalogCourseCard";
import CourseSlider from "../components/core/Catalog/CourseSlider";

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);

  const [categoryId, setCategoryId] = useState("");


  //   Fetch all categorys

  useEffect(() => {
    const getCategory = async () => {
      const response = await apiConnector("GET", categories.CATEGORIES_API);


      const category_id = response?.data?.allCategorys?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;

      setCategoryId(category_id);
    }; 
    getCategory();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      if(categoryId){
        try {
          const res = await getCatalogPageData(categoryId); 
  
          console.log("Printing getCatalogPageData ", res);
  
          setCatalogPageData(res);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getCategoryDetails();
  }, [categoryId]);

  return (
    <div className="text-white">
      <div>
        <p>
          {`Home / Catalog/`}{" "}
          <span> {catalogPageData?.data?.selectedCategory?.name} </span>{" "}
        </p>
        <p>{catalogPageData?.data?.selectedCategory?.name} </p>
        <p>{catalogPageData?.data?.selectedCategory?.description} </p>
      </div>

      <div>
        {/* Section 1 */}
        <div>
          <div>Courses to get you started</div>
          <div className="flex gap-x-3">
            <p>Most Popular</p>
            <p>New</p>
          </div>

          <div>
            <CourseSlider
              Courses={catalogPageData?.data?.selectedCategory?.course} 
            />
          </div>
        </div>

        {/* section  2 */}
        <div>
          <p>
            Top Courses in{" "}
            <span>{catalogPageData?.data?.selectedCategory?.name} </span>{" "}
          </p>
          <div>
            <CourseSlider
              Courses={catalogPageData?.data?.differentCategory?.course}
            />
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <div>Frequently Bought </div>
          <div className="py-8">
            {" "}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <CatalogCourseCard
                    course={course}
                    key={index}
                    Height={"h-[400px]"}
                  />
                ))}{" "}
            </div>{" "}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
