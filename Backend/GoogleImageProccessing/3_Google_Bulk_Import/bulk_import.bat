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

Rem Google Configuration
set PROJECT_ID=commerce-product
set LOCATION_ID=us-west1
for /f "delims=" %%A in ('gcloud auth application-default print-access-token') do set "ACCESS_TOKEN=%%A"

echo #########################################################################################################################################
echo ##########################   Step 3 : Bulk Import on Google
echo #########################################################################################################################################

curl -X POST -H "Authorization: Bearer %ACCESS_TOKEN%" -H "Content-Type: application/json; charset=utf-8" -d @3_Google_Bulk_Import\import_request.json https://vision.googleapis.com/v1/projects/%PROJECT_ID%/locations/%LOCATION_ID%/productSets:import