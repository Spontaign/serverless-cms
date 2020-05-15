# Connecting the Admin Module and the Backend to complete installation for the Serverless Content Management System

Now that you have installed the Backend using SAM and the Admin Module using AWS Amplify, you need to finish things off by connecting them.

The first two steps used CLIs. This step requires clicking around in the AWS Console. These steps are straight forward, but take a little work. In a future version it should be straight forward to eliminate this step entirely by combining the application stacks from install step 1 and step 2... 



## Installation
We need to create 5 new endpoints in API Gateway to form the connection:

| Endpoint | Method | Description | Backend Mapping |
| --- | --- | --- | --- |
| /entries | GET | returns a set of objects | Lambda: **GetDynamoDBObjects** |
| /entry | GET | returns an object | Lambda: **GetDynamoDBObject** |
| /entry | PUT | updates/writes an object | Lambda: **PutDynamoDBObject** |
| /post-policy | GET | returns signed URL for S3 upload | Lambda: **GetPostPolicyForUpload** |
| /publish | POST | initiates a Step Function to build and publish content | Step Function: **PublishStateMachine** |

___

From the AWS Console, go to API Gateway and then select the recently created API.

During the Admin Module installation we created a /test endpoint. We won't need that so you can delete. Select /test and then **Delete Resource** under Actions:

![delete resource](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/API-delete-resource.png)

___

Now we can start creating the 5 endpoints. Since these endpoints will all be accessed from an SPA, we will need to configure CORS for each. 

Lets start with /entries. From Actions select **Create Resource**:

![create resource](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/API-create-resource.png?)

___

Enter **entries** as the resource name and be sure to check the box to **Enable API Gateway CORS**.

![enable cors](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-new-child-resource.png)

___

That will create the **/entries** resource with an OPTIONS method. First configure the OPTIONS method by clicking on it and setting the **Integration type** to **Mock**:

![OPTIONS](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Options.png)

___

Now update the **Method Request** and **Method Response** for the OPTIONS endpoint to be able to handle application/json used to communicate with the SPA.  

___

### Update Request Body for Method Request
Click on **Method Request** for the OPTIONS method and then select **Request Body** and set the **Content type** to **application/json** and set the **Model name** to **RequestSchema** as shown below:

![method execution body](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-method-execution-request-body.png)

___

### Add HTTPS Status and Response Body for Method Response
Click on **Method Response** for the OPTIONS method and then enter a new HTTP Status for 200. Once saved, expand the option and enter a **Request Body** and set the **Content type** to **application/json** and set **Models** to **ResponseSchema** as shown below:

![response header](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-response-header-and-body.png)

___

Next, add the GET Method. Select **/entries** and then **Create Method**:

![method](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-add-METHOD.png)

___

Now we need to link this method to the correct Lambda function. From the table above, we see that the /entries GET method links to the **GetDynamoDBObjects** Lambda. Be sure to set the Integration type to Lambda Function, check the box that says **Use Lambda Proxy Integration**, and then find the correct Lambda:

![lambda link](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-link-lambda.png)

> If you see the error saying **Invalid Model indentified**, you will add the Request and Response models shortly to correct this.

___

Now we need to secure this endpoint to allow only authenticated and authorized users. Go to the **Method Request** and update **Authorization** to use **AWS_IAM** as shown below:

![method request](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-method-request-auth.png)

___

We need to also set this method to handle json from the SPA so follow the same steps above for **Update Request Body for Method Request** and **Add HTTPS Status and Response Body for Method Response**.

___

The last step for the method is to enable CORS.

![cors](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Enable-CORS.png)

___

If you set things up properly you will see a screen like this:

![cors](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Enable-CORS-success.png)

___

With GET/entries now done, go through the same process for GET/entry, PUT/entry, and GET/post-policy. They all need CORS and need to be matched to the correct Lambda function. The associated Lambdas are listed above and here is a checklist:

- [x] Create /entries Resource
- [x] Configure OPTIONS method for /entries
- [x] Add and configure GET method for /entries
- [x] Enable CORS for /entries
- [ ] Create /entry Resource
- [ ] Configure OPTIONS method for /entry
- [ ] Add and configure GET method for /entry
- [ ] Add and configure PUT method for /entry
- [ ] Enable CORS for /entries
- [ ] Create /post-policy Resource
- [ ] Configure OPTIONS method for /post-policy
- [ ] Add and configure GET method for /post-policy
- [ ] Enable CORS for /post-policy

___

The last resource, **/publish**, links to a STEP FUNCTION instead of a Lambda so it is handled differently. Step Functions are a terrific way to build workflows and string together lambda functions and other AWS resources. 

For this Serverless Content Management System, we use a Step Function to handle building pages, processing them, and then moving them to production. Here is the diagram of the Step Function:

![step function](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/StepFunctionDefinitiion.png)


Let's break down how this works:

1. The /publish endpoint is called and it passes a json object containing an id, a type, and a preview-or-publish parameter as input to the Step Function.
2. The first state of the Step Function is a choice and it routes the input to the next step according to the type. Pages get sent to a BuildPage lambda, Assets to the BuildAsset, and Products get handled their own way as well. 
3. All paths then return to a second choice state. This state checks the preview-or-publish parameter and routes accordingly.
4. For the publish route, the content goes through an additional state where it is compressed and then moved to the production bucket to be picked up by CloudFront, the CDN.

Step Functions are very powerful and where this CMS can be easily extended to handle multiple types of pages or products or whatever for your specific needs. For example, a catalog page could be added as a type with a corresponding new path in the Step Function that would route the type to new lambdas that pull in all products and include a list on the published page. 

___

To set up with last endpoint to go to the Step Function instead of a Lambda, we need to create the resource and set up the OPTIONS method just as above. 

- [ ] Create /publish Resource
- [ ] Configure OPTIONS method for /post-policy

When you create the POST method we need to set things up differently:

![step function link](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-to-STEP-link-step-function.png)

- [ ] Set Integration type to **AWS Service**
- [ ] Set your region
- [ ] Set AWS Service to **Step Functions**
- [ ] Set HTTP Method to **POST**
- [ ] Set Action Type to **Use action name**
- [ ] Set Action to **Start Execution**
- [ ] Enter the Execution Role (see next)

___

### Get the Execution Role
SAM already built the execution role for you in the first step. From the AWS Console, go to IAM and then select Roles. Enter "APIGatewayToStepFunction" in search to bring up the correct role. Click on it and then copy the ARN:

![Find role](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-AMI-find-APItoStep-Role.png)

___

Paste the ARN in the execution role and SAVE. Now this method has the permission to start an execution on a Step Function State Machine. 

Now we need to tell API Gateway which State Machine to route POST calls made to this endpoint. This is handled with a **Mapping Template**. Click on the **Integration Request** for the POST/publish endpoint and then scroll down to **Mapping Templates**. Click **Add Mapping Template** and enter **Content-Type** as **application/json** and then save. You can then enter the template below.

Copy and paste the following into your template:

```
#set($input = $input.json('$'))
{
"input": "$util.escapeJavaScript($input).replaceAll("\\'", "'")",
"stateMachineArn": "ARN-To-Your-Step-Function-Here"
}
```

Now from the AWS Console, go to **Step Functions**, and find the Step Function created by your SAM deployment. It will start with **PublishStateMachine**. Click on it and copy the ARN:

![Find Step Function](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-to-STEP-link-step-function-getSTEP-ARN.png)


Now back in API Gateway, paste the step function ARN into the Mapping Template and then save. It should look like this (with your State Machine ARN):

![Mapping Template](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-to-STEP-link-step-function-mapping-template.png)

___

Finally, just like the other 4 endpoints, you'll need to secure the POST method by updating the Authorization to AWS_IAM, **Update Request Body for Method Request** and **Add HTTPS Status and Response Body for Method Response**, and then enable CORS.

___

With that done, your API should look like this:

![API All Resources](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-gateway-all-resources.png)

If it does, you can select **Deploy API** from the **Actions** menu to make your changes available.

___

Amplify allows authenticated users to access the API endpoints by allowing authenticated users to assume IAM Roles. Creating and linking the IAM Roles to API Gateway and Cognito is all handled by Amplify, but we do need to modify the authorized role to include these five endpoints we just created.

Go to IAM and then select Roles. Search for "authRole" and select the role with the Trusted entities as **Identity Provider: cognito...***.

![cognito](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE.png)

___

Click on the one Policy assigned to that Role and then Edit Policy and then select the JSON tab to edit the JSON directly. It should look like this:

![cognito](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE-3.png)

___

We just need to edit this JSON Policy to remove the test endpoint and then enter the five endpoints we just built and deployed in API Gateway. Edit the policy to match below and then save the policy:

![cognito](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE-4.png)


## Try it out!

With all that in place, return to the Admin Module UI, sign out, and then sign back in and you should see the seed data in Pages.

If you do, then you have successfully connected the Backend with the Admin Module!


## Final Configuration

Now we just need to:

- [ ] Set the URL for the Staging Bucket & CloudFront Distribution
- [ ] Enable a Lambda trigger when images have been uploaded
- [ ] Enable a Lambda trigger to handle cache invalidation on the Production S3 bucket
- [ ] Edit the Cognito User Pool to not allow Sign Ups


### Set the URL for the Staging Bucket & CloudFront Distribution

From the Admin Module, click on the SETTINGS tab at the top of the page:

![Settings](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-settings.png)

___

In a separate tab, go to S3 in the AWS Console. Find the bucket by searching for "StagingBucket". Go into the bucket, select the properties tab and then copy the endpoint from the Static website hosting card. Paste the URL into the **Stage Website Base Url** field. Be sure to enter a trailing /.

___

Next, from the AWS Console, go to CloudFront. Find the distribution and copy the **Domain Name** and then replace it in the **Production Website Base Url** field. Be sure to enter a training /.

Save the changes.

___

### Enable a Lambda trigger when images have been uploaded

Images are uploaded to a specific S3 bucket. There is a Lambda that moves uploaded images to the staging and production S3 buckets but we need to enable a trigger.

In some of my uses of this CMS, I also create thumbnails and compress and optimize the images before loading them into the correct buckets. There are several completed applications in the **Serverless Application Repository** you can just plug in. I won't go into that here, but there are plenty of options to process your images once they have been uploaded.

To add the trigger, go to the AWS Console and then Lambda. Search for the function **CopyUploadedImages** and go into the function. Select Add Trigger:

![upload trigger](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddUploadTrigger.png)

___

Select S3 and then the **uploadbucket** and enable the trigger:

![upload trigger](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddUploadTrigger-2.png)

___

With the trigger on, any images added to the upload bucket will be copied to the staging and production buckets. Remember, this is where you could easily add image processing (resize, optimize, thumbnails, etc.).

___

### Enable a Lambda trigger to handle cache invalidation on the Production S3 bucket

CloudFront minimizes download times by caching copies of your content at their edge locations. This works great, but what happens if the content changes? The TTL (time to live) on CloudFront should be pretty long so a CMS needs to be able to tell CloudFront to refresh content when it is modified.

Refreshing content can easily be handled with the S3 bucket triggering a Lambda that sends an invalidation request to CloudFront so that CloudFront will pick up a new version of the content the next time it is requested. This Lambda is included in the backend already, so we just need to add the S3 trigger.

To add the trigger, go to the AWS Console and then Lambda. Search for the function **InvalidateCloudFrontCache** and go into the function. Select Add Trigger:

![add cache trigger](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddCacheTrigger.png)

___

Select S3 and then the **productionBucket** and enable the trigger:

![add cache trigger](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddCacheTrigger-2.png)

___

With the trigger on, any object PUT into the production S3 bucket will call the lambda which will send an invalidation request so the content gets refreshed.

Invalidation requests do have a free tier that normal use will likely not exceed. Requests after the free tier are inexpensive but factor this into pricing if you plan on exceeding the free tier.

Invalidation requests are an extra step and can take a few seconds to process, but it is a fair trade off for delivery fresh content with the performance provided by using CloudFront to deliver your content.


### Edit the Cognito User Pool to not allow Sign Ups

You probably do not want anyone to be able to sign up for an account to your content management system. Instead, you can go to the Cognito User Pool and turn off the ability to sign up. For this system, you handle adding and editing all of the users from the Cognito User Pool in the AWS Console.

From the AWS Console go to Cognito and select the User Pool created for this project and then edit the section that includes **User sign ups allowed?**:

![cognito](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/Cognito-LockSignUp.png)

___

Then just change that setting to **Only allow administrators to create users**:

![cognito 2](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/Cognito-LockSignUp-2.png)

___


# Final Thoughts

With everything set up, you now have a working Serverless Content Management System. It is highly performant, secure, redundant, extendable, and should cost a few dollars per month for most cases.
