const fs = require("fs");
const csv = require('csv-parser');
const products = require('./products.json');
const utils = require('./utils.js');

const directory = './';

// find all files containing 'import-file' regardless of file type
const readDirectory = new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
        if(err) {
            reject();
        }
        const filesToImport = files.filter(file => file.indexOf('import-file') !== -1);
        resolve(filesToImport);
    });
});

// import files
readDirectory.then((filesToImport) => {
    const results = []
    const promises = filesToImport.map(file => {
        return new Promise((resolve, reject) => {
            let rs = fs.createReadStream(file, 'UTF8')
            rs.on('error', () => { reject() });
            rs.pipe(csv({
                    mapHeaders: ({ header }) => header.toLowerCase().replace(/[^0-9a-z]/gi, '')
                }))
                .on('data', (data) => results.push(data))
                .on('end', () => { resolve(results);  });
        });
    });
    
    Promise.all(promises).then((importedFiles) => {
        let reviews = [];
        // put all reviews into one file
        importedFiles.map(file => {
            reviews = reviews.concat(file);
            return reviews;
        });

        // format all reviews
        const formattedReviews = reviews.map(review => {
            const partialFindAttribute = utils.findAttribute.bind(null, review);
            return {
                displayName: partialFindAttribute('name') || '',
                reviewBody: partialFindAttribute('body') || '',
                createdDate: review['date'] || review['datecreated'] || '',
                emailAddress: partialFindAttribute('email') || '',
                productHandle: partialFindAttribute('handle') || '',
                productId: review['productid'] || '',
                imageUrls: review['imageurls'] || '',
                isApproved: review['isapproved'] || '',
                rating: partialFindAttribute('rating') || partialFindAttribute('score') || '',
                reviewReply:  review['reply'] || review['reviewreply'] || '',
                replyDateCreated: partialFindAttribute('replydate') || '',
                sku: review['sku'] || '',
                title: review['title'] || '',
                videoUrls: review['videourls'] || '',
                isVerifiedBuyer: partialFindAttribute('verified') || '',
                variantId:  review['variantid'] || '',
                countryCode: review['countrycode'] || ''
            }
        });

        // validate reviews
        const validReviews = formattedReviews.filter(review => (utils.validateEmail(review.emailAddress) &&
            (6 > parseInt(review.rating) > 0) &&
            utils.checkProduct(review) &&
            review.title && review.title !== '' &&
            review.reviewBody && review.reviewBody !== '')
        );

        // remove duplicates
        const deduplicatedReviews = utils.deduplicateReviews(validReviews);

        // number of sucessfully imported reviews
        const noReviewsSuccessfulyImported = deduplicatedReviews.length;

        // count reviews per product
        const reviewCounterResult = products.map(product => {
            let noReviews = deduplicatedReviews.filter(review => (review.productId && product.productId && review.productId === product.productId) || 
            (review.productHandle && product.handle && review.productHandle === product.handle) || 
            (review.sku && product.sku && review.sku === product.sku))
            product.reviewCounter = noReviews.length;
            return product;
        });

        // find product/s with most reviews
        const mostReviews = reviewCounterResult.reduce((max, r) => r.reviewCounter > max ? r.reviewCounter : max, reviewCounterResult[0].reviewCounter);
        const productsMostReviews = (mostReviews === 0 ? null : reviewCounterResult.filter(product => product.reviewCounter === mostReviews).map(product => product.name));
        
        // get number of reviews per rating
        const reviewsPerRating = utils.groupReviews('rating', deduplicatedReviews);
        
        // format data and create an output file
        fs.writeFile('./file.csv', utils.reviewsToCsv(deduplicatedReviews), (err) => {
            if (err) return console.log('Error while writing to file');
            console.log('Number of reviews successfully imported:', noReviewsSuccessfulyImported);
            console.log('1 star reviews: ' + (reviewsPerRating[1] ? reviewsPerRating[1].length : 0));
            console.log('2 star reviews: ' + (reviewsPerRating[2] ? reviewsPerRating[2].length : 0));
            console.log('3 star reviews: ' + (reviewsPerRating[3] ? reviewsPerRating[3].length : 0));
            console.log('4 star reviews: ' + (reviewsPerRating[4] ? reviewsPerRating[4].length : 0));
            console.log('5 star reviews: ' + (reviewsPerRating[5] ? reviewsPerRating[5].length : 0));
            console.log(`Product/s with the most reviews: ${!productsMostReviews ? '-' : productsMostReviews.join(', ')}`);
        });
    }).catch(() => {
        return console.log('Error: no files found.');
    });
}).catch(() => {
    return console.log('Input error: directory may not exist.');
});






