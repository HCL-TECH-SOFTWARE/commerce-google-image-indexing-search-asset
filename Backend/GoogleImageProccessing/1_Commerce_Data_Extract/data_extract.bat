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


Rem Commerce Data Extract Configuration
set Commerce_Data_Extract_Bat_Path=C:\WCDE_V9\bin\dataextract.bat
set Commerce_WC_Dataextract_XML_Path=C:\Team_Work\Rahul_Work\GoogleImageProccessing\1_Commerce_Data_Extract\wc-dataextract.xml 


echo #########################################################################################################################################
echo ##########################   Step 1 : Create Google CSV From Commerce DB (Using Data Extract)
echo #########################################################################################################################################
 
%Commerce_Data_Extract_Bat_Path% %Commerce_WC_Dataextract_XML_Path%
