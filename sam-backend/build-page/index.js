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
  buildLayout => For theGet object from DynamoDB by eid or by ctype/title
*/
const buildLayout = async (layout) => {
  
  let s = layout.layoutBody;
  
  for (let i = 0; i < layout.pageSnippets.length; i++) {
    
    let snippet = await getDynamoObject(null,'snippet',layout.pageSnippets[i]);
    let tag =  "<!-- ===> r:" + layout.pageSnippets[i] + " <=== -->";
    s = s.replace(tag,snippet.Items[0].snippetBody);
    
  }
  
  return s;
  
};


/*
  replaceLayoutTags => Passed in HTML Layout and 
  Page Object, iterate through object properties and replace all
  occurances with property vaule in Layout.
*/
const replaceLayoutTags = async (layout, obj) => {

  try {

    Object.keys(obj).forEach(key => {
      //console.log("Current Key is => ", key);
      //console.log("Current Value is => ", obj[key]);
      if (typeof obj[key] === 'string') {
        let r =  "<!-- ===> r:" + key.toString() + " <=== -->";
        layout = layout.replace(new RegExp(r, 'g'), obj[key]);
      }
    });    
    
  } catch(e) {
    console.log("Catch error from replaceTemplateTags function is => ", e);
  } finally {
    return layout;
  }
    
};

const returnHtmlObject = async (entry,layout) => {

  // GET AMD MERGE ALL SNIPPETS BELONGING TO LAYOUT
  let layoutHtml =  await buildLayout(layout);
  console.log("==> layoutHtml => ", layoutHtml);


  // REPLACE ALL THE VARIABLES
  let pageHtml =  await replaceLayoutTags(layoutHtml,entry);

  // PACKAGE TO WRITE TO S3
  return new Promise(function(resolve, reject) {
  
    // Create PAGE params
    const pageParams = {
      key: entry.websiteKey,
      eid: entry.eid,
      pageHtml: pageHtml
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
    
    // Pull the LAYOUT from DynamoDB
    let layout = await getDynamoObject(null,'layout',entry.pageLayout);
    
    // Build the HTML
    let pageObj = await returnHtmlObject(entry,layout.Items[0]);

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