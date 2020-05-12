const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const minify = require('html-minifier').minify;

const compressAndWriteS3Object = async (f,k) => {
    
    // SET ContentType to HTML but check for Javascript
    let ct = 'text/html';
    if (k.indexOf(".js") > -1) {
        ct = 'text/javascript';
    } else if (k.indexOf(".css") > -1) {
        ct = 'text/css';
    } 
    
    let compressedBody = minify(f, {
           removeTagWhitespace: true,
           removeComments: true,
           collapseWhitespace: true,
           conservativeCollapse: true,
           minifyCSS: true,
           minifyJS: true,
           removeAttributeQuotes: true
        });        

    let putParams = {
        Body: compressedBody,
        Key: k,
        Bucket: process.env.DESTINATION_BUCKET,
        ContentType: ct,
        ACL: 'public-read'
    };    
    
    let putObjectPromise = s3.putObject(putParams).promise();
    putObjectPromise.then(function(data) {
      console.log('Success');
    }).catch(function(err) {
      console.log(err);
    });    
    
    return putObjectPromise;
};

const getS3Object = async (k) => {

    let params = {
        Bucket: process.env.SOURCE_BUCKET,
        Key: k
    };
    
    let data;
    try {
        data = await s3.getObject(params).promise();
        return new Buffer.from(data.Body).toString("utf8");
    } catch(err) {
        console.log('Error retrieving object', err);
        let blank = {};
        return blank;
    }

};

exports.handler = async (event, context, callback) => {
        
    let fileToCopy = await getS3Object(event.websiteKey);
    
    await compressAndWriteS3Object(fileToCopy, event.websiteKey);
    
    callback(null, event);

};