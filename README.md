# files-site
Access S3 files through the browser behind an authenticated Cognito session


What is the goal? What is the plan?
* I want to have an SPA which allows viewing, exploring, and downloading the contents of an S3 bucket
* The page redirects to the login page if you are not logged in
* Logging of users exploring, especially users downloading
* Create an S3 bucket with IAC which is only accessible to a specified Cognito user pool
* Main page is file-explorer
* Second page is single-file view (nice-to-have)
* Each file has a download button
* Each page has an upload button which will upload a file into the current location
* Each page has a "new directory" button which will create a new dir in the current location

Nice-to-haves:
* Breadcrumbs at the top
* Previews of the files
* Updated URL for subdirectories