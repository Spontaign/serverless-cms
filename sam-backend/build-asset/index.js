const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

/*
  getDynamoObject => Get object from DynamoDB by eid or by ctype/title
*/
const getDynamoObject = async (eid,ctype,title) => {
    
    let params = {};
    
    if (eid !== null) {
      params = {
        TableName: process.env.TABLE_NAME,
          FilterExpression: "#eid = :eid",
          ExpressionAttributeNames: {
              "#eid": "eid"
          },
          ExpressionAttributeValues: {
               ":eid": eid
          }
      };
      
    } else if (ctype !== null && title !== null) {
      
      params = {
        TableName: process.env.TABLE_NAME,
          FilterExpression: "#ctype = :ctype AND #title = :title",
          ExpressionAttributeNames: {
              "#ctype": "ctype",
              "#title": "title"
          },
          ExpressionAttributeValues: {
               ":ctype": ctype,
               ":title": title
          }
      };
    }
    
    //console.log("===========> About to get  data: ", params);
    
    let getObjectPromise = docClient.scan(params).promise();
    getObjectPromise.then(function(data) {
      //let l = `Success, got Object from DynamoDB => eid:${eid} | ctype:${ctype} | title:${title}`;
      //console.log(l);
    }).catch(function(err) {
      console.log(err);
    });    
    
    return getObjectPromise;
};


const writePageToS3 = async (obj) => {

    // SET ContentType to HTML but check for Javascript
    let ct = 'text/html';
    if (obj.websiteKey.indexOf(".js") > -1) {
        ct = 'text/javascript';
    } else if (obj.websiteKey.indexOf(".css") > -1) {
        ct = 'text/css';
    } else if (obj.websiteKey.indexOf(".txt") > -1) {
        ct = 'text/plain';
    }          
    
    
    let putParams = {
        Body: obj.assetBody,
        Key: obj.websiteKey,
        Bucket: process.env.JSON_BUCKET,
        ContentType: ct,
        ACL: 'public-read'
    };
    
    //console.log("===========> About to write to S3 params: ", putParams);
    
    let putObjectPromise = s3.putObject(putParams).promise();
    putObjectPromise.then(function(data) {
      console.log('Success');
    }).catch(function(err) {
      console.log(err);
    });    
    
    return putObjectPromise;
};


exports.handler = async (event, response, callback) => {

    //console.log("====> event is ", event);
    
    // Pull the PAGE from DynamoDB
    let entry = await getDynamoObject(event.eid,null,null);
    
    // Write the page to S3
    await writePageToS3(entry.Items[0])
      .then(data => {
        console.log("Page Written!");
        callback(null, event);
      })
      .catch(err => {
        console.log("PAGE NOT WRITTEN!");
        console.error(err, err.stack);
        callback(true, event);
      });

};
