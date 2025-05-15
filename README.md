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
* Limit users to X downloads per day (3? 10?) and Y downloads per week (20?). If someone wants to download more, they'll have to talk to me.
  * Most easily managed with a DynamoDB table
  * Overrideable on an individual level with some kind of controls
  * Perhaps display how many downloads a user has left?
* Automatic logout after inactivity

How do files work?
* Store files raw
* Create a directory (how is a directory represented?)
* Store files in a directory
* Rename file (modifies metadata, not contents)
* Replace file content (modifies contents, not metadata)
* Move file (modifies metadata, requires existing directory, warns if there is already a same-name file)
* Move directory?
* Probably create one directory-table "file" for each directory
* ^ it should contain the file-name and the file-key, it should have consistent
  naming conventions between directories, it should not be a name available for
  users, and it should be searchable, probably via key and secondary index

Initially, I was thinking I would have one record in Dynamo per file... but now
I am thinking perhaps I want one record in Dynamo per directory? Maybe actually
I want two tables, one for file metadata, and one for the directory structure,
where each directory is an Item, and it contains a list of the file-keys in that
directory

Copy email design - have top of the table have selection, have each row have a
selection box, allow for move/delete. At low width, turn column-data into new
lines on the same row. Add "1-50 of <COUNT>" and pagination.
