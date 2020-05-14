# Installing the backend for the Serverless Content Management System

The AWS Serverless Application Model (SAM) is a powerful tool to build the infrastructure needed to run serverless applications Following the instructions below will create several Lambda functions, a Step Function, S3 buckets a CloudFront distribbution, IAM Roles, and a DynamoDB table.



## Installation

After cloning the repository or downloading the zip file, cd into the sam-backend directory. Assuming that you have the AWS CLI and the SAM CLI installed you can proceed with the following:

```
sam build
```

This will package all of the lambda functions so you can deploy. Next run...

```
sam deploy --guided --profile YOURAWSPROFILE
```

Use the --guided option to go through the steps. Adding the --profile option is optional if you have more than one AWS profile. You'll need to choose a name of the application and enter some details.  Your screen will look like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/SAM-initial-configuration.png)

Next, SAM will start preparing for the deployment and you will be shown a list of resources that will be created. It will look like this:


![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/SAM-deploy-confirm.png)

Once you confirm, it will take a few minutes to create all of the resources. 

The last step will be to load some initial data into the newly created DynamoDB.

Go to the AWS Console and then DynamoDB. Find the newly created table and then copy and paste the table name. It should look like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-name2.png)

No back on your local machine, open the file called DynamoDBLoader.json. You need to replace the first node of the json file with the newly create DynamoDB table name. 

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-Loader-ChangeName.png)

Save that file and then run...

```
aws dynamodb batch-write-item --request-items file://DynamoDBLoader.json --profile YOURPROFILE
```

Once that finishes, you should be able to reload the items in your DynamoDB table to see the initial data:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-sampleDataLoaded.png)

###That's it!

You have installed the backend for the Serverless Content Management System.

Now head over to the [README](../amplify-vue-admin-module/README.md) in the amplify-vue-admin-module to install the admin module.




