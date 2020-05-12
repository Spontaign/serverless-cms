const AWS = require('aws-sdk');
const cloudfront = new AWS.CloudFront({apiVersion: '2019-03-26'});


exports.handler =  function (event, context, callback) {
    
    let srcKey = "/" + event.Records[0].s3.object.key;       

    console.log("srcKey is ", srcKey);

    let nowStamp = Date.now().toString();

    let params = {
      DistributionId: process.env.DISTRIBUTION_ID,
      InvalidationBatch: { 
        CallerReference: nowStamp.toString(),
        Paths: { 
          Quantity: 1,
          Items: [
            srcKey.toString(),
          ]
        }
      }
    };
    
    if (srcKey === "/index.html") {
      params = {
        DistributionId: process.env.DISTRIBUTION_ID,
        InvalidationBatch: { 
          CallerReference: nowStamp.toString(),
          Paths: { 
            Quantity: 2,
            Items: [
              srcKey.toString(),
              "/"
            ]
          }
        }
      };
    }      

    //console.log("Invalidate Params => ", params);
    
    cloudfront.createInvalidation(params, function(err, data) {
      if (err) {
          console.log(err, err.stack); 
          callback(true, {
              statusCode:200,
              body: "invalidateResults"
          });          
      } else {
        console.log("Invalidation Successful: ", data);
        callback(null, {
            statusCode:200,
            body: "invalidateResults"
        });
      }
    });    
    
};
