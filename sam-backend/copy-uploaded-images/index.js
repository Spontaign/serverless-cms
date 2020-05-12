const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });


const copyFile = async (b,k,d) => {
    
    let ext = k.split('.').pop();
    let ct = 'image/jpg';
    console.log("===> ct is ... ", ct);
    if (ext === 'png') { ct = 'image/png'; }
    else if (ext === 'gif') { ct = 'image/gif'; }
    
    let copyParams = {
        CopySource: b + '/' + k,
        Bucket: d,
        Key: k,
        ACL: 'public-read',
        ContentType: ct,
        MetadataDirective: 'REPLACE'
    };
    
    console.log("===========> About to write to S3 params: ", copyParams);
    
    let copyObjectPromise = s3.copyObject(copyParams).promise();
    copyObjectPromise.then(function(data) {
      console.log('Copied to... ', d);
    }).catch(function(err) {
      console.log(err);
    });    
    
    return copyObjectPromise;
};
   


exports.handler = async (event, context, callback) => {
    
    console.log("=========> event is ", event);
    
    let srcBucket = event.Records[0].s3.bucket.name;
    let srcKey = event.Records[0].s3.object.key;       
    
    await copyFile(srcBucket,srcKey,process.env.STAGING_BUCKET);
    await copyFile(srcBucket,srcKey,process.env.PRODUCTION_BUCKET);

    callback(null, {
        statusCode:400,
        body: "Objects copied..."
    });

};


