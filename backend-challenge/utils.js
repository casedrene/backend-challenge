const products = require('./products.json');

module.exports = {
    validateEmail: (email) => {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(String(email).toLowerCase());
    },
    findAttribute: (obj, attr) => {
        let value = '';
        Object.keys(obj).find(key => {
            if (key.indexOf(attr) !== -1) {
                return value = obj[key];
            }
        });
        return value;
    },
    checkProduct: (review) => {
        return products.find(product => product.productId === review.productId || 
            product.sku === review.sku ||
            product.handle === review.productHandle);
    },
    reviewsToCsv: (validReviews) => {  
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = validReviews || null;
        if (data === null || !data.length) {
            return null;
        }

        columnDelimiter = ',';
        lineDelimiter = '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach((item) => {
            ctr = 0;
            keys.forEach((key) => {
                if (ctr > 0) result += columnDelimiter;
                result += item[key].includes(',') ? `"${item[key]}"`: item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    },
    groupReviews: (key, data) => {
        const groupBy = (key) => data.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
        return groupBy(key);
    },
    deduplicateReviews: (validReviews) => {
        const stringifiedReviews = validReviews.map(review => JSON.stringify(review));
        return stringifiedReviews.reduce((accumulator, currentValue) => {
            if (accumulator.indexOf(currentValue) === -1) {
                accumulator.push(currentValue);
            }
            return accumulator
        }, []).map(review => JSON.parse(review));
    }
};
