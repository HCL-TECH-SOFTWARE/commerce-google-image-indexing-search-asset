

# Google Image Indexing backend Work using Batch Script


# Objective 

**1.	Restrict Google Vision API to search from HCL Commerce Catalog Images.**

**2.	Change the attributes of the Google Vision API response which we will use for searching the product through elastic search** 


# Pre-requisites

**1.	Google Cloud Account (Billing) and Service Account**

**2.	Google Storage Bucket:** To save the CSV and Images of Store Catalog
      
**3.	Google Vision API should be enabled:** For Image Search
      
**4.	Google SDK installed and Login on server where you are running this batch Script:** To Run Google Cloud Commands.


# How it works?

**1.	Create the CSV:**

-	We have used Commerce Data Extract Utility to create the CSV in format which Google required.

-	We had done the SQL query-based Data extract.

-	Sample CSV created through Data Extract Utility.


**2.	Upload the created CSV and Images:**

-	Upload Created CSV on Google Storage Bucket

-	Sync the Store Images Folder with Google Cloud Storage

-	Exclude duplicate Images while Sync using Google Cloud Command (Already taken care in batch file). 

    e.g. Like Commerce store have multiple resolution images for same product, so take only one out of them


**3.	Google Bulk Import:**

-	Import all the images which are uploaded on Google Storage using CSV create in first step.

-	Once Import is done Google will autorun the Image Indexing job and all Store Catalog images are ready for search using Google Vision API. The Product Search index of products is updated approximately every 30 minutes. When images are added or deleted, the change won't be reflected in your Product Search responses until the index is next updated.


**4.	Cronjob:**

-	We have configured the cronjob using windows Task Scheduler to execute the Google Image Indexing Batch file on speific interval to update the Catalog Changes on Google.


# How to install?

***Please follow the below steps to index the Images of Commerce Store on Google***

**1.  Please download the GoogleImageIndexing.zip file, which contains the following folders:**

- 1_Commerce_Data_Extract

- 2_Google_Upload_CSV_Images

- 3_Google_Bulk_Import

- Google_Image_Indexing.bat


**2.  Update the files from 1_Commerce_Data_Extract:**

- Update below constant from data_extract.bat

  ```
  set Commerce_Data_Extract_Bat_Path=<Commerce_Data_Extract_Bat_Path>
  Rem Example => set Commerce_Data_Extract_Bat_Path=C:\WCDE_V9\bin\dataextract.bat
  set Commerce_WC_Dataextract_XML_Path=<Commerce_WC_Dataextract_XML_Path>
  Rem Example => set Commerce_WC_Dataextract_XML_Path=C:\GoogleImageIndexing\1_Commerce_Data_Extract\wc-dataextract.xml 
  ```
 
- Update database configuration from wc-dataextract-env.xml

  `<_config:Database type="type" name="name" user="user" password="password" server="server" port="port" schema="schema" />`
  
- Replace <Store_Name> from following files with the store name for which you are doing the Google image indexing
  1. wc-dataextract.xml
  2. wc-dataextract-env.xml
  3. wc-extract-Google-Image-Indexing.xml


**3.  Update the files from 2_Google_Upload_CSV_Images:**

- Update below constant from upload_csv_images.bat

  ```
  set Store_Name=<Store_Name>
  Rem Example => set Store_Name=Emerald
  set Store_Images_Path=<Store_Images_Path>
  Rem Example => set Store_Images_Path=C:\91TK\HCL_Commerce_Store\assets\emerald\public\EmeraldCAS\images
  ```
  
- Update below constant from upload_csv.bat

  ```
  set Store_Name=<Store_Name>
  Rem Example => set Store_Name=Emerald
  ```
  

**4.  Update the files from 3_Google_Bulk_Import:**

- Update below constant from bulk_import.bat

  ```
  set PROJECT_ID=<GOOGLE_PROJECT_ID>
  Rem Example => set PROJECT_ID=commerce-product
  set LOCATION_ID=<GOOGLE_PROJECT_LOCATION_ID>
  Rem Example => set LOCATION_ID=us-west1
  ```
  
- Replace <Store_Name> from import_request.json with the store name for which you are doing the Google image indexing  

   `"csvFileUri": "gs://image_indexing_hclstore_catalog/<Store_Name>/csv/GoogleImageIndexing.csv"`
   


**5.  Execute the Google_Image_Indexing.bat**


# Important Google Cloud Commands 

**1.  Execute the below command to check the status of Bulk Import**

      ```
      curl -X GET \
      -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
      -H "Content-Type: application/json" \
      https://vision.googleapis.com/v1/locations/$LOCATION_ID/operations/operation-id
      ```
      
**2.  Execute the below command to check the status of Google Image Indexing**

      ```
       curl -X GET \
      -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
      -H "Content-Type: application/json" \
      https://vision.googleapis.com/v1/projects/$PROJECT_ID/locations/$LOCATION_ID/productSets
      ```
      
   A successful response lists all your product sets, including a product set id (for example, Emerald) as well as the indexTime field indicating when indexing completed:


**3.  Execute the below command to check the List of products successfully Indexed**

      ```
      curl -X GET \
      -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
      -H "Content-Type: application/json" \
      https://vision.googleapis.com/v1/projects/$PROJECT_ID/locations/$LOCATION_ID/productSets/product-set-id/products?pageSize=15
      ```


