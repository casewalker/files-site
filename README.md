# files-site

Access S3 files through the browser behind an authenticated Cognito session

What is the goal? What is the plan?
* I want to have an SPA which allows viewing, exploring, and downloading the contents of an S3 bucket
* The page redirects to the login page if you are not logged in
* Logging of users exploring, especially users downloading
* Create an S3 bucket with IAC which is only accessible to a specified Cognito user pool
* Main page is file-explorer
* Second page is single-file view (nice-to-have? Maybe has metadata like when added, by whom, etc.)
* Each file has a download button
* Each page has an upload button which will upload a file into the current directory
* Each page has a "new directory" button which will create a new dir in the current location

Nice-to-haves:
* Make the sidebar directories into links? (that look like links? Perhaps files instead?)
* Updated URL for subdirectories
* Deep linking that persists after logging in
* Automated emails of usage/access every week: users, locations, downloads, etc.
* User Management controls - change password?

Must have?
* Limit users to X downloads per day (3?) and Y downloads per week (10?). If someone wants to download more, they'll have to talk to me.
  * Most easily managed with a DynamoDB table
  * Overrideable on an individual level with some kind of controls
  * Perhaps display how many downloads a user has left?
* Automatic logout after inactivity
