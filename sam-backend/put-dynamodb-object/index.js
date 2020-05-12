const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = function (event, response, callback) {

    //console.log("event is ", event);
    
    let payload = JSON.parse(event.body);
    
    let updateParams = {
      TableName: process.env.TABLE_NAME,
      Item: payload
    };   
    
    docClient.put(updateParams, function(err, data) {
       if (err) { 
           console.log(err); 
          callback(null, {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },            
            body: JSON.stringify(err)
          });                   
       } else {
        console.log(data);
          callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },            
            body: JSON.stringify("Success!")
          });        
       } 
    });    

};