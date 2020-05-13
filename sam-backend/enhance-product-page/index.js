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

/*
getHtmlTemplate => receives a key and
gets HTML template from S3
*/
const getS3File = async  (k) => {

    let key = k;

    let params = {
        Bucket: process.env.JSON_BUCKET,
        Key: key
    };

    console.log("params for template => ", params);
    
    let data;
    try {
        data = await s3.getObject(params).promise();
    } catch(err) {
        console.log('Error retrieving object');
        throw err;
    }
    
    return new Buffer.from(data.Body).toString("utf8");

};


/*
  returnSpecialProductContent => Returns Specific Content for Product Page
*/
const returnSpecialProductContent = async (features) => {
  
  let spc = "";
  
  if (features === undefined || features === null) {
    
    return spc;  
    
  } else {
      
    spc = `
        <div class="jumbotron">
          <h2>Features</h2>
          <ul class='list-group mt-5'>
    `;
    
    for (let i = 0; i < features.features.length; i++) {
      
      spc += `
        <li class='list-group-item'><strong>${features.features[i]}</strong></li>
      `;
      
    }
    
    spc += "</ul>\n</div>\n";
    
    return spc;
  }

};

/*
  replaceTag => Passed in HTML, tag, target to swap.
*/
const replaceTag = async (htmlFile, tag, target) => {
  return htmlFile.replace(tag,target);
};    

const returnHtmlObject = async (entry,htmlFile,features) => {


  let specialProductContent = await returnSpecialProductContent(features);


  let tag =  "<!-- ===> r:specialProductContent <=== -->";
  // REPLACE ALL THE VARIABLES
  
  htmlFile =  await replaceTag(htmlFile,tag,specialProductContent);

  // PACKAGE TO WRITE TO S3
  return new Promise(function(resolve, reject) {
  
    // Create PAGE params
    const pageParams = {
      key: entry.websiteKey,
      eid: entry.eid,
      pageHtml: htmlFile
    };
  
    resolve(pageParams);
    
  });
};

const writePageToS3 = async (obj) => {
    
    let k = obj.key;
    
    let putParams = {
        Body: obj.pageHtml,
        Key: k.toString(),
        Bucket: process.env.JSON_BUCKET,
        ContentType: 'text/html',
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
    let entries = await getDynamoObject(event.eid,null,null);
    
    // Select the correct type
    let entry = entries.Items.find( ({ctype}) => ctype === event.ctype);

    // Pull features
    let features = entries.Items.find( ({ctype}) => ctype === "productfeatures");
        
        console.log("features are======> ", features);
        
    // Pull the LAYOUT from DynamoDB
    let htmlFile = await getS3File(entry.websiteKey);
    
    // Build the HTML
    let pageObj = await returnHtmlObject(entry,htmlFile,features);

    // Write the page to S3
    await writePageToS3(pageObj)
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
