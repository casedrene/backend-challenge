Build a review importer which accepts multiple different import file types (import-file-1.csv & import-file-2.csv). The files should be processed and mapped to create a new file containing a standardised model of the reviews. The reviews.csv file defines the format of the output file your importer should create. A library for parsing CSV's can be used.

When building your importer, ensure it is open to extension. Specifically consider how you would handle a different import file type.

Validation rules that must be met when importing the reviews:
The email address must be valid.
The review rating must be valid (must be an integer between 1-5).
The review product must be valid. You must match the product in the review against a product in the products.json file. If the product does not exist, do not import the review. A product can be matched by a product handle, productId or a sku.
The review must have a body and title.

If a review is not valid, your importer should not import the review.

Output statistics of the imported files, logged to console, or to a separate file. Including:
Number of reviews successfully imported.
Number of reviews per rating. eg. how many 1 star reviews, 2 star reviews, etc
The name of the product with the most reviews

There are no restrictions on which languages/frameworks can be used, as long as they are modern. The code you write should demonstrate the considerations you'd put into a production quality application.


-----------
To run the script:
Navigate to a backend-challenge folder
npm install
run 'npm start'

To run the test:
npm install
npm test

Files:
importer.js - main file
utils.js - helper functions
test/test.js - test file
file.csv - output file with reviews