# Installing the backend for the Serverless Content Management System

The AWS Serverless Application Model (SAM) is a powerful tool that automates the construction of AWS infrastructure needed to run serverless applications. Using SAM, which expands on CloudFormation, allows you to maintain your infrastructure as code. You can deploy your instracture as stacks and also delete them as stacks when you no longer need the resources. Not only is this significantly more efficient than adding resources individually, it also greatly reduces the risk of errors.

Following the instructions below will create several Lambda functions (runtime is Node.js), a Step Function, S3 buckets a CloudFront distribution, IAM Roles & policies, a DynamoDB table, and more.


## Installation

After cloning the repository or downloading the zip file, cd into the sam-backend directory. Assuming that you have the AWS CLI and the SAM CLI installed you can proceed with the following:

```
sam build
```

This will package all of the lambda functions so you can deploy. Next run...

```
sam deploy --guided --profile YOURAWSPROFILE
```

Use the **--guided** option to go through the options with the CLI. Adding **--profile** is optional if you have more than one AWS profile. You'll need to choose a name of the application and enter some details.  Your screen will look like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/SAM-initial-configuration.png)

___

Next, SAM will start preparing for the deployment and you will be shown a list of resources that will be created. It will look like this:


![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/SAM-deploy-confirm.png)

___

Once you confirm, it will take a few minutes to create all of the resources. 

The last step will be to load some initial data into the newly created DynamoDB.

Go to the AWS Console and then DynamoDB. Find the newly created table and then copy the table name. It should look like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-name2.png)

___

Now back on your local machine, open the file called DynamoDBLoader.json. You need to replace the first parameter of the json file by pasting the newly created DynamoDB table name. 

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-Loader-ChangeName.png)

___

Save that file and then run...

```
aws dynamodb batch-write-item --request-items file://DynamoDBLoader.json --profile YOURPROFILE
```

Again, **--profile** is optional. Once that finishes, you should be able to reload the items in your DynamoDB table to see the initial data:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/DynamoDB-sampleDataLoaded.png)

___

## That's it!

You have installed the backend for the Serverless Content Management System. As you can see, infrastructure as code is efficient!

___


Now head over to the [README](../amplify-vue-admin-module/README.md) in the amplify-vue-admin-module to install the admin module.




