const AWS = require('aws-sdk');
const s3 = new AWS.S3();

AWS.config.update({
accessKeyId: process.env.ACCESS_ID,
secretAccessKey: process.env.ACCESS_KEY,
region: process.env.REGION, 
signatureVersion: 'v4',
});


exports.handler = async (event, context, callback) => {

    let params = {
      Bucket: process.env.UPLOAD_BUCKET,
      Fields: {
        key: event.queryStringParameters.fileName
      }
    };
    
    s3.createPresignedPost(params, function(err, data) {
      if (err) {
        console.error('Presigning post data encountered an error', err);
        
        callback(true,{
            statusCode:400,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },               
            body:JSON.stringify(err)            
        });        
      } else {
        console.log("data is ",data);

        callback(null,{
          statusCode:200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },             
          body:JSON.stringify(data)
        });
      
      }
    });

};
