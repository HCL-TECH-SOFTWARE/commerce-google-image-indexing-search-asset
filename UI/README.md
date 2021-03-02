
# Provide the capability to search HCL Commerce Catalog using an image on React Store. 

**Note**

•	The library “react-webcam“ used for taking the live picture does not support the IOS chrome as this library uses HTML5 Media API “getUserMedia” which is not supported by chrome/firefox in IOS. Hence, the option"Take a beautiful Picture" would not be displayed for the iOS chrome and firefox.

•	Supported Browser are Windows (Chrome, Firefox), Mac (Chrome, Safari, Firefox), Android (Chrome) and iOS(Safari)


**Please follow the below steps to include the Image Search Component in your project**

# React Store Changes

1. Need to install the react web cam in your project as a dependency.

     `npm install react-webcam –save`
     
    Once installation is done. Verify the entry in your package.json file.
    
2. For icons used,install iconify icons

      `npm install @iconify/react @iconify/icons-mdi`

3. Include the `Search-types` folder under `widget` folder.It has a image search component.

4. Do the below changes in `SearchBar.tsx` file under `src/component/widget/search-bar` folder.
    
    - import the search-type.tsx and used it as component
     
       `import { SearchTypes } from "../Search-types/search-types";`
       
     - Use it as a component 
       ```ruby
        {/**IMAGESEARCH POC */}
         <SearchTypes
          showImageTotext={true}
          setSearchBoxVal={performSearch}
         />
       {/**IMAGESEARCH POC */}

       ```
     - make form as reference node by add ref={node} as below
     
        `<form ref={node} onSubmit={submitSearch}>`
      
     -  add performSearch() method
     
         ```ruby
          /**IMAGESEARCH POC */
            const node: any = React.useRef(null);
            const performSearch = (val) => {
              setInput(val);
              if (val && val.indexOf("No Data Found") <= -1) {
                node.current.dispatchEvent(new Event('submit', { cancelable: true }))
              };
            }
           /**IMAGESEARCH POC */

         ```
       
 5. Do the below change in `SearchResult.tsx` file under `src/component/pages/search-results` folder.
 
     - create partnumber variable and get value of partnumbers inside IF statement to get the partnumbers from URL params as below 
         ```ruby
           let partnumbers: any = "";    
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
        ```
           
    -  pass the partnumbers variable as prop element in ProductFilterLayout.tsx file.
          ```ruby
                    <ProductFilterLayout
                      cid={`search-results-${searchTerm}`}
                      searchTerm={searchTerm}
                    /**IMAGESEARCH POC */
                      partnumbers={partnumbers}
                   /**IMAGESEARCH POC */
                    />   
            
          ```

6. Do the below changes in `ProductFilterLayout.tsx` file under `src/component/widgets/product-filter` folder

      - add the partnumbers as props in the ProductFilterProps interface
           ```ruby
                interface ProductFilterProps {
                  cid: string;
                  categoryId?: string;
                  searchTerm?: string;
                  /**IMAGESEARCH POC */
                  partnumbers?: string;
                  /**IMAGESEARCH POC */
                }
           ```
      - Inside the component,define the partnumber varible and set the value of it as a props value of partnumber
      
           ```ruby
               /**IMAGESEARCH POC */
                const partnumbers: string = props.partnumbers ? props.partnumbers : "";
                /**IMAGESEARCH POC */
           ```
         
      - add the below condition in the component
           ```ruby
                     /**IMAGESEARCH POC */
                      if (searchTerm !== "" && searchTerm !== "IMAGESEARCH") {
                        paramsBase["searchTerm"] = searchTerm;
                      }
                      if (partnumbers !== "") {
                        paramsBase['partNumber'] = partnumbers.split(",");
                      }
                    /**IMAGESEARCH POC */
              ```
              
 7. Add the `voiceImageTranscibe.service.ts` inside   `src/foundation/apis/search` folder.It has the REST APIs which will call the google vision API for the search.
    
      Replace FIREBASE_IMAGE_SERACH_URL with the URL getting after deploying the firebase functions placed inside `firebase` folder 
       
       `const IMAGE_URL ="FIREBASE_IMAGE_SERACH_URL";`
       
       
       
 # Firebase changes (Node-Backend)
 
 1. On the Firebase side, Google Vision API is used for gettings refined result from image

     Follow these steps for Google Vision API to Work
      ```
        Need to create the project on "https://console.cloud.google.com/"
        Enable Billing
        Enable Google Vision API
        Create the API keys
        Add API key in firebase .env file
      ```
    Once you get the Google Key,add it in .env file placed inside firebase/functions folder
 
 2. Open command prompt inside the the `firebase/functions` and run the below the command to deploy the firebase function
      `npm run deploy`
      
      If you want to run it locally,run the below command
        `npm run serve`
        
 3. Once you deploy the code on firebase, you will get the DEPloyed URL.Add the URL in `IMAGE_URL` variable inside `voiceImageTranscibe.service.ts` file in the react store   
 
          
