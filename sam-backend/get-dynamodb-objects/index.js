const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = function (event, response, callback) {

    console.log("event is ", event);

    let ctype = event.queryStringParameters.ctype;

    let items = [];

    let qParams = {
        TableName: process.env.TABLE_NAME,
          FilterExpression: "#ctype = :CTYPE",
          ExpressionAttributeNames: {
              "#ctype": "ctype"
          },
          ExpressionAttributeValues: {
               ":CTYPE": ctype
          }
          
    };

    docClient.scan(qParams, onScan);
    
    // SET UP TO SCAN RECURSIVELY
    function onScan(err, data) {
      
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
  
        //console.error("data is :", data);
        console.log("data.Items.length is... ", data.Items.length);
          
        for (let i = 0; i < data.Items.length; i++) {
           items.push(data.Items[i]);
        }        
  
        // continue scanning if we have more movies
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            qParams.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(qParams, onScan);
        } else {
      
          callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },            
            body: JSON.stringify(items)
          });
          
        }
      }  
    }

    
};