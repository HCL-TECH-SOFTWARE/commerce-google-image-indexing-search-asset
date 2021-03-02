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

call 1_Commerce_Data_Extract\data_extract.bat
Rem pause


call 2_Google_Upload_CSV_Images\upload_csv_images.bat
Rem pause


call 3_Google_Bulk_Import\bulk_import.bat
Rem pause