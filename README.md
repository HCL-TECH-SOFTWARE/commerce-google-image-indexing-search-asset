# Google Image indexing and Search

## WARRANTY & SUPPORT 
HCL Software provides HCL Commerce open source assets “as-is” without obligation to support them nor warranties or any kind, either express or implied, including the warranty of title, non-infringement or non-interference, and the implied warranties and conditions of merchantability and fitness for a particular purpose. HCL Commerce open source assets are not covered under the HCL Commerce master license nor Support contracts.

If you have questions or encounter problems with an HCL Commerce open source asset, please open an issue in the asset's GitHub repository. For more information about [GitHub issues](https://docs.github.com/en/issues), including creating an issue, please refer to [GitHub Docs](https://docs.github.com/en). The HCL Commerce Innovation Factory Team, who develops HCL Commerce open source assets, monitors GitHub issues and will do their best to address them. 

## HCLC Google Image Indexing & Search Asset

Provides the capability to index the Google Vision results as part of a searchable context for the catalog images.

Google Image Indexing allow user to create products, each containing reference images that visually describe the product from a set of viewpoints.It helps in refining the result when user execute the Image Search.When users query the product set with their own images, Vision API applies machine learning to compare the product in the user's query image with the images in the user's product set, and then returns a ranked list of visually and semantically similar results.

**Prerequisites**

Before you can use the Cloud Vision API, you must enable it for your project in GCP:
1.	In the Cloud Console, on the project selector page, select or create a Cloud project.
2.	Make sure that billing is enabled for your Google Cloud project. 
3.	Enable the Cloud Vision API.
4.	Set up authentication:

        -In the Cloud Console, go to the Create service account key page.
        -Go to the Create Service Account Key page
        -From the Service account list, select New service account.
        -In the Service account name field, enter a name.
        -From the Role list, select Project > Owner.
        -Click Create.
 A JSON file that contains your key downloads to your computer. 
 
5.  Click on Storage In GCP and create storage bucket.

6.  Install and initialize the Cloud SDK
 
Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the path of the JSON file that contains your service account key.This variable only applies to your current shell session, so if you open a new session, set the variable again.

Example : Window CMD :- set GOOGLE_APPLICATION_CREDENTIALS="C:\Users\username\Downloads\my-key.json"

## Backend Part

Please refer `Readme.md` file under `Backend folder` to complete the backend task


## UI Part

Please refer `Readme.md` file under `UI folder` to complete the frontend task
