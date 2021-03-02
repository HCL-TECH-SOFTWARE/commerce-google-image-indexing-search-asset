/**
*==================================================
Copyright [2021] [HCL Technologies]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*==================================================
**/

//Standard libraries
import React from "react";
import { useLocation } from "react-router-dom";
//Custom libraries
import { TwoColumnsLeftFilterLayout } from "../../layouts/two-colums-left-filter";
import { SectionContent } from "../../layouts/sectionContentType";
import { ProductFilterLayout } from "../../widgets/product-filter";
import { ProductGridLayout } from "../../widgets/product-grid";
import { SEARCHTERM } from "../../../constants/common";


const SearchResults: React.FC = (props: any) => {
  const { page } = props;
  const location = useLocation();

  let searchTerm = "";
  let partnumbers: any = "";
  let searchParam = location.search;
  if (searchParam) {
    const params = new URLSearchParams(searchParam);
    const searchTermValue = params.get(SEARCHTERM);
    /**IMAGESEARCH POC */
    partnumbers = params.get('partNumbers');
    /**IMAGESEARCH POC */
    if (searchTermValue !== null && searchTermValue !== undefined) {
      searchTerm = searchTermValue;
    }
  }

  const rightContentSection: SectionContent[] = [
    {
      key: `search-results-rightContentSection-product-grid-${searchTerm}`,
      CurrentComponent: () => {
        return (
          <ProductGridLayout
            cid={`search-results-${searchTerm}`}
            searchTerm={searchTerm}
          />
        );
      },
    },
    {
      key: `search-results-rightContentSection-product-recommendation-${searchTerm}`,
      CurrentComponent: () => {
        //place holder for product-recommendation layout.
        return <></>;
      },
    },
  ];

  const leftNavigationSection: SectionContent[] = [
    {
      key: `search-results-leftNavigationSection-product-filter-${searchTerm}`,
      CurrentComponent: () => {
        return (
          <ProductFilterLayout
            cid={`search-results-${searchTerm}`}
            searchTerm={searchTerm}
			/**IMAGESEARCH POC */
            partnumbers={partnumbers}
			/**IMAGESEARCH POC */
          />
        );
      },
    },
  ];

  return (
    <>

      <TwoColumnsLeftFilterLayout
        cid={`search-results-${searchTerm}`}
        leftNavigationSection={leftNavigationSection}
        rightContentSection={rightContentSection}
        page={page}
      />
    </>
  );
};

export default SearchResults;
