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
import React, { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OK } from "http-status-codes";
import { useTranslation } from "react-i18next";
import Axios, { Canceler } from "axios";
import { useHistory, Link, useLocation } from "react-router-dom";
//Foundation libraries
import { useSite } from "../../../_foundation/hooks/useSite";
import siteContentService from "../../../_foundation/apis/search/siteContent.service";
import searchDisplayService from "../../../_foundation/apis/transaction/searchDisplay.service";
//Custom libraries
import {
  CommerceEnvironment,
  KEY_CODES,
  SEARCHTERM,
} from "../../../constants/common";
import { SEARCH } from "../../../constants/routes";
import { KEYWORD_LIMIT } from "../../../configs/catalog";
//Redux
import { currentContractIdSelector } from "../../../redux/selectors/contract";
import * as searchActions from "../../../redux/actions/search";
//UI
import {
  StyledTextField,
  StyledIconButton,
  StyledMenuItem,
  StyledSearchBar,
  StyledSearchBarButton,
  StyledMenuTypography,
} from "../../StyledUI";
import { Hidden, InputAdornment, ClickAwayListener } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
/**IMAGESEARCH POC */
import { SearchTypes } from "../Search-types/search-types";
/**IMAGESEARCH POC */

const SearchBar: React.FC = (props: any) => {
  const contractId = useSelector(currentContractIdSelector);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = React.useState<
    Array<Object>
  >([]);
  const [categorySuggestions, setCategorySuggestions] = React.useState<
    Array<Object>
  >([]);
  const [brandSuggestions, setBrandSuggestions] = React.useState<Array<Object>>(
    []
  );
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const searchField = t("SearchBar.SearchField");
  const keywordTitle = t("SearchBar.KeywordTitle");
  const categoryTitle = t("SearchBar.CategoryTitle");
  const brandTitle = t("SearchBar.BrandTitle");
  const [input, setInput] = React.useState("");
  const [nameList, setNameList] = React.useState<Array<string>>([]);
  const [index, setIndex] = React.useState(0);
  let nameListIndex = 1;
  const mySite = useSite();
  const dispatch = useDispatch();
  const [showKeywords, setShowKeywords] = React.useState(false);
  const [showCategories, setShowCategories] = React.useState(false);
  const [showBrands, setShowBrands] = React.useState(false);

  const [categories, setCategories] = React.useState<Array<string>>([]);
  const [brands, setBrands] = React.useState<Array<string>>([]);
  const [categoriesUrl, setCategoriesUrl] = React.useState<Map<any, any>>(
    () => new Map()
  );

  const [inputDisabled, setinputDisabled] = React.useState(true);

  const clearSuggestions = () => {
    setIndex(0);
    setKeywordSuggestions([]);
    setCategorySuggestions([]);
    setBrandSuggestions([]);
    setShowKeywords(false);
    setShowCategories(false);
    setShowBrands(false);
  };

  const clearSuggestionsAndUpdateInputField = (str: string) => {
    clearSuggestions();
    str = callRegex(str);
    setInput(str);
    toggleSearchBar();
  };

  const clearSuggestionsAndInputField = () => {
    clearKeywords();
    clearSuggestions();
    setInput("");
  };

  const clearKeywords = () => {
    dispatch(searchActions.KEYWORDS_RESET_ACTION(""));
  };

  const setKeywordsToLocalStorage = (list: string[]) => {
    dispatch(searchActions.KEYWORDS_UPDATED_ACTION(list));
  };
  const CancelToken = Axios.CancelToken;
  let cancels: Canceler[] = [];

  useEffect(() => {
    if (mySite) {
      const catalogId = mySite?.catalogID;
      const parameters: any = {
        responseFormat: "application/json",
        suggestType: ["Category", "Brand"],

        contractId: contractId,
        catalogId: catalogId,
        cancelToken: new CancelToken(function executor(c) {
          cancels.push(c);
        }),
      };
      siteContentService
        .findSuggestions(parameters)
        .then((res) => {
          if (res.status === OK) {
            const categoriesResponse = res?.data.suggestionView[0].entry;
            const brandsResponse = res?.data.suggestionView[1].entry;
            generateCategoriesList(categoriesResponse);
            generateCategoriesURL(categoriesResponse);
            generateBrandsList(brandsResponse);
            setinputDisabled(false);
          }
        })
        .catch((e) => {});
    }

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [mySite]);

  useEffect(() => {
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    const searchTermValue = params.get(SEARCHTERM);
    if (searchTermValue == null) {
      setInput("");
    }
  }, [location.pathname]);

  const generateCategoriesList = (categoriesResponse: any[]) => {
    const lists: string[] = [];
    for (let i = 0; i < categoriesResponse.length; i++) {
      lists.push(categoriesResponse[i].fullPath);
    }
    setCategories(lists);
  };
  const generateBrandsList = (brandsResponse: any[]) => {
    const lists: string[] = [];
    for (let i = 0; i < brandsResponse.length; i++) {
      lists.push(brandsResponse[i].name);
    }
    setBrands(lists);
  };

  const generateCategoriesURL = (categoriesResponse: any[]) => {
    const categoriesUrl = new Map();
    for (let i = 0; i < categoriesResponse.length; i++) {
      let url = categoriesResponse[i].seo ? categoriesResponse[i].seo.href : "";
      categoriesUrl.set(categoriesResponse[i].fullPath, url);
    }
    setCategoriesUrl(categoriesUrl);
  };

  const handleLookAheadSearch = (event: ChangeEvent, type: string) => {
    event.persist();

    const element = event.currentTarget as HTMLInputElement;

    setInput(element.value);

    retrieveSuggestions(element.value);
  };

  const retrieveSuggestions = (searchTerm: any) => {
    if (searchTerm.length > 1) {
      setTimeout(function () {
        const storeID = mySite.storeID;
        const contractId = mySite.contractId;
        const catalogId = mySite.catalogID;

        const parameters: any = {
          responseFormat: "application/json",
          storeId: storeID,
          term: searchTerm,
          limit: KEYWORD_LIMIT,
          contractId: contractId,
          catalogId: catalogId,
        };

        siteContentService
          .findKeywordSuggestionsByTerm(parameters)
          .then((res) => {
            if (res.status === OK) {
              const keywordSuggestions = res?.data.suggestionView[0].entry;
              if (keywordSuggestions) {
                let list: string[] = [];
                generateSuggestionList(keywordSuggestions, searchTerm, list);
                generateCatgoriesAndBrandsSuggestions(searchTerm, list);
                setNameList(list);
              }
            }
          });
      }, 300);
    }
    clearKeywords();
    clearSuggestions();
  };

  const generateCatgoriesAndBrandsSuggestions = (
    userInput: string,
    listTemp: string[]
  ) => {
    const regex = new RegExp(userInput, "ig");
    const matchedCategories = categories?.filter((e) => e.match(regex));
    let lists: object[] = [];
    if (matchedCategories) {
      for (let suggestion of matchedCategories) {
        if (lists.length === 4) {
          break;
        }
        let suggestionSkeleton = JSON.parse(
          JSON.stringify(CommerceEnvironment.suggestionSkeleton)
        );

        suggestionSkeleton.arrIndex = nameListIndex;
        suggestionSkeleton.id = "";
        suggestionSkeleton.name = suggestion;
        suggestionSkeleton.url = categoriesUrl.get(suggestion);
        nameListIndex++;
        lists.push(suggestionSkeleton);
        listTemp.push(suggestion);
      }
    }
    setCategorySuggestions(lists);
    setShowCategories(true);
    const matchedBrands = brands?.filter((e) => e.match(regex));
    let lists2: object[] = [];
    if (matchedBrands) {
      for (let suggestion of matchedBrands) {
        if (lists2.length === 4) {
          break;
        }
        let suggestionSkeleton = JSON.parse(
          JSON.stringify(CommerceEnvironment.suggestionSkeleton)
        );

        suggestionSkeleton.arrIndex = nameListIndex;
        suggestionSkeleton.id = "";
        suggestionSkeleton.name = suggestion;
        suggestionSkeleton.url = SEARCH + "?" + SEARCHTERM + "=" + suggestion;
        nameListIndex++;
        lists2.push(suggestionSkeleton);
        listTemp.push(suggestion);
      }
    }
    setBrandSuggestions(lists2);
    setShowBrands(true);
  };

  const generateSuggestionList = (
    keywordSuggestions: any[],
    userInput: string,
    listTemp: string[]
  ) => {
    const lists: object[] = [];

    listTemp.push(userInput);
    const listTemp2: string[] = [];

    for (let suggestion of keywordSuggestions) {
      if (keywordSuggestions) {
        let suggestionSkeleton = JSON.parse(
          JSON.stringify(CommerceEnvironment.suggestionSkeleton)
        );

        suggestionSkeleton.arrIndex = nameListIndex;
        suggestionSkeleton.id = "";
        suggestionSkeleton.name = suggestion.term;
        suggestionSkeleton.url =
          SEARCH + "?" + SEARCHTERM + "=" + suggestion.term;
        listTemp.push(suggestion.term);
        lists.push(suggestionSkeleton);
        listTemp2.push(suggestion.term);
        nameListIndex++;
      }
    }
    setKeywordSuggestions(lists);
    setKeywordsToLocalStorage(listTemp2);
    setShowKeywords(true);
  };

  const callRegex = (str: string) => {
    const regex2 = new RegExp(">", "ig");
    let arr: string[];
    if (str.match(regex2)) {
      arr = str.split(">");
      str = arr[arr.length - 1].trim();
    }
    return str;
  };
  const onKeyDown = (e) => {
    let len = nameList ? nameList.length : 0;
    let str = "";
    if (e.keyCode === KEY_CODES.UP) {
      e.preventDefault();

      if (index === 0) {
        return;
      }
      setIndex(index - 1);
      if (nameList) {
        str = callRegex(nameList[index - 1]);
        setInput(str);
      }
    } else if (e.keyCode === KEY_CODES.DOWN) {
      e.preventDefault();

      if (index === len - 1) {
        setIndex(0);
        if (nameList) {
          str = callRegex(nameList[0]);
          setInput(str);
        }
        return;
      }
      setIndex(index + 1);
      if (nameList) {
        str = callRegex(nameList[index + 1]);
        setInput(str);
      }
    }
  };

  const submitSearch = (props: any) => {
    props.preventDefault();
    clearSuggestions();
    let url = "";
    const storeID = mySite.storeID;
    const parameters: any = {
      storeId: storeID,
      searchTerm: input,
    };
    searchDisplayService
      .getSearchDisplayView(parameters)
      .then((res) => {
        if (res.status === OK) {
          url = res?.data.redirecturl;

          if (url === undefined) {
            url = SEARCH + "?" + SEARCHTERM + "=" + input;
          }
          redirectTo(url);
        }
      })
      .catch((e) => {
        url = SEARCH + "?" + SEARCHTERM + "=" + input;
        redirectTo(url);
      });
  };

  const toggleSearchBar = () => {
    setIsExpanded(!isExpanded);
  };

  const redirectTo = (url: string) => {
    clearSuggestions();
    setIsExpanded(false);
    //redirect
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      history.push(url);
    }
  };

  const clickAway = (prev) => {
    setIsExpanded(!prev);
  };
  /**IMAGESEARCH POC */
  const node: any = React.useRef(null);
  const performSearch = (val) => {
    setInput(val);
    if (val && val.indexOf("No Data Found") <= -1) {
      node.current.dispatchEvent(new Event('submit', { cancelable: true }))
    };
  }
 /**IMAGESEARCH POC */
  return (
    <>
      <ClickAwayListener onClickAway={clickAway}>
        <span>
          <Hidden mdUp>
            <StyledSearchBarButton
              onClick={toggleSearchBar}
              className={isExpanded ? "active" : ""}>
              <SearchIcon />
            </StyledSearchBarButton>
          </Hidden>
          <StyledSearchBar className={isExpanded ? "expanded" : ""}>
            <form ref={node} onSubmit={submitSearch}>
              <StyledTextField
                margin="normal"
                size="small"
                autoFocus
                autoComplete="off"
                type="text"
                disabled={inputDisabled}
                placeholder={searchField}
                value={input}
                name="searchTerm"
                onChange={(e) => handleLookAheadSearch(e, "searchTerm")}
                onKeyDown={onKeyDown}
                InputProps={{
                  endAdornment: (
                    <>
                      {showKeywords || showCategories || showBrands ? (
                        <>
                          <InputAdornment position="end">
                            <StyledIconButton
                              onClick={clearSuggestionsAndInputField}>
                              <CloseIcon titleAccess={t("SearchBar.Clear")} />
                            </StyledIconButton>                            
                          </InputAdornment>
                        </>
                      ) : (
                        <>
                          <InputAdornment position="start">
                            <SearchIcon onClick={toggleSearchBar} />
                            {/**IMAGESEARCH POC */}
                            <SearchTypes
                              showBarcodeIcon={true}
                              showSpeechToText={true}
                              showImageTotext={true}
                              setSearchBoxVal={performSearch}
                            />
                            {/**IMAGESEARCH POC */}
                          </InputAdornment>
                        </>
                      )}
                    </>
                  ),
                }}
              />
            </form>

            {(showKeywords || showCategories || showBrands) && (
              <ClickAwayListener
                onClickAway={() => {
                  clearSuggestionsAndInputField();
                }}>
                <ul className="searchBar-results">
                  {showKeywords && (
                    <>
                      <StyledMenuTypography
                        variant="body2"
                        className="searchBar-resultsCategory">
                        {keywordTitle}
                      </StyledMenuTypography>
                      {keywordSuggestions?.map((e: any, i: number) => (
                        <Link
                          key={`brand-${i}`}
                          to={e.url}
                          onClick={() =>
                            clearSuggestionsAndUpdateInputField(e.name)
                          }>
                          <StyledMenuItem>
                            <StyledMenuTypography
                              variant="body1"
                              className={e.arrIndex === index ? "active" : ""}
                              key={e.arrIndex}
                              id={`megamenu_department_${e.id}`}
                              title={e.name}>
                              {e.name}
                            </StyledMenuTypography>
                          </StyledMenuItem>
                        </Link>
                      ))}
                    </>
                  )}

                  {showCategories && (
                    <>
                      <StyledMenuTypography
                        variant="body2"
                        className="searchBar-resultsCategory">
                        {categoryTitle}
                      </StyledMenuTypography>
                      {categorySuggestions?.map((e: any, i: number) => (
                        <Link
                          key={`category-${i}`}
                          to={e.url}
                          onClick={(evt) =>
                            clearSuggestionsAndUpdateInputField(e.name)
                          }>
                          <StyledMenuItem>
                            <StyledMenuTypography
                              variant="body1"
                              className={e.arrIndex === index ? "active" : ""}
                              key={e.arrIndex}
                              id={`megamenu_department_${e.id}`}
                              title={e.name}>
                              {e.name}
                            </StyledMenuTypography>
                          </StyledMenuItem>
                        </Link>
                      ))}
                    </>
                  )}

                  {showBrands && (
                    <>
                      <StyledMenuTypography
                        variant="body2"
                        className="searchBar-resultsCategory">
                        {brandTitle}
                      </StyledMenuTypography>
                      {brandSuggestions?.map((e: any, i: number) => (
                        <Link
                          key={`brand-${i}`}
                          to={e.url}
                          onClick={(evt) =>
                            clearSuggestionsAndUpdateInputField(e.name)
                          }>
                          <StyledMenuItem>
                            <StyledMenuTypography
                              variant="body1"
                              className={e.arrIndex === index ? "active" : ""}
                              key={e.arrIndex}
                              id={`megamenu_department_${e.id}`}
                              title={e.name}>
                              {e.name}
                            </StyledMenuTypography>
                          </StyledMenuItem>
                        </Link>
                      ))}
                    </>
                  )}
                </ul>
              </ClickAwayListener>
            )}
          </StyledSearchBar>
        </span>
      </ClickAwayListener>
    </>
  );
};

export { SearchBar };
