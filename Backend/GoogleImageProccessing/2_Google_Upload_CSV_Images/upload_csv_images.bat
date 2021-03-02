@echo off 

:: Copyright [2021] [HCL Technologies]

:: Licensed under the Apache License, Version 2.0 (the "License");
:: you may not use this file except in compliance with the License.
:: You may obtain a copy of the License at

::    http://www.apache.org/licenses/LICENSE-2.0

:: Unless required by applicable law or agreed to in writing, software
:: distributed under the License is distributed on an "AS IS" BASIS,
:: WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
:: See the License for the specific language governing permissions and
:: limitations under the License.

Rem Images and CSV Upload Configuration
set Store_Name=Emerald
set Store_Images_Path=C:\91TK\HCL_Commerce_Store\assets\emerald\public\EmeraldCAS\images

echo #########################################################################################################################################
echo ##########################   Step 2 : Images and CSV upload on Google Storage
echo #########################################################################################################################################

call 2_Google_Upload_CSV_Images\upload_csv.bat

gsutil -m rsync -d -r -x ".*100\.jpg$|.*350\.jpg$|.*550\.jpg$" %Store_Images_Path% gs://image_indexing_hclstore_catalog/%Store_Name%/images