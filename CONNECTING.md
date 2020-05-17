# Connecting the Admin Module and the Backend to complete installation for the Serverless Content Management System

Now that you have installed the Backend using SAM and the Admin Module using AWS Amplify, you need to finish things off by connecting them.

The connection takes place in API Gateway and we will simply swap out the placeholder lambdas created by Amplify for the ones created by the SAM CLI. 

The first two steps use CLIs and in a future version it should be straight forward to eliminate this step entirely by combining the application stacks from install step 1 and install step 2... For now, you just need to click around the AWS Console to finish off the installation.



## Installation
From the AWS Console, go to API Gateway and then select the recently created API. It should look like this:

![api fresh](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-all-endpoints.png)


We can see that Amplify already did most of the work building the API and connecting the authorization. Remember that we linked these endpoints to placeholder Lambdas. To connect the backend and the frontend, we need to point these endpoints to our backend lambdas.

The table below shows the backend mapping needed. The /publish endpoint goes to a Step Function so we will handle that one last.

| Endpoint | Method | Description | Backend Mapping |
| --- | --- | --- | --- |
| /entries | GET | returns a set of objects | Lambda: **GetDynamoDBObjects** |
| /entry | GET | returns an object | Lambda: **GetDynamoDBObject** |
| /entry | PUT | updates/writes an object | Lambda: **PutDynamoDBObject** |
| /post-policy | GET | returns signed URL for S3 upload | Lambda: **GetPostPolicyForUpload** |
| /publish | POST | initiates a Step Function to build and publish content | Step Function: **PublishStateMachine** |

___

We will start with the /entries resouce. Click on /entries and the ANY method and then select **Integration Request**:

![/entries any](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-select-entries.png)

___

On the Integration Request page, we need to swap out the **Lambda Function**


![/entries lambda](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-select-integration-request.png)

___

From the table above, we can see that /entries goes to the Lambda with **GetDynamoDBObjects** in the title. Click on the pencil icon next to the **Lambda Function** fields and then search for the correct Lambda. Click save and confirm.

Now do the same for /entry, /entry-update, and /post-policy by using the Lambdas in the table above. 

___

The last resource, **/publish**, links to a STEP FUNCTION instead of a Lambda so it is handled differently. Step Functions are a terrific way to build workflows and string together lambda functions and other AWS resources. 

For this Serverless Content Management System, we use a Step Function to handle building pages, processing them, and then moving them to production. Here is the diagram of the Step Function:

![step function](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/StepFunctionDefinitiion.png)


Let's break down how this works:

1. The /publish endpoint is called and it passes a json object containing an id, a type, and a preview-or-publish parameter as input to the Step Function.
2. The first state of the Step Function is a choice and it routes the input to the next step according to the type. Pages get sent to a BuildPage lambda, Assets to the BuildAsset, and Products get handled their own way as well. 
3. All paths then return to a second choice state. This state checks the preview-or-publish parameter and routes accordingly.
4. For the publish route, the content goes through an additional state where it is compressed and then moved to the production bucket to be picked up by CloudFront, the CDN.

Step Functions are very powerful and this is where this CMS can be easily extended to handle multiple types of pages or products (or services or whatever) for your specific needs. For example, a catalog page, or multiple catalog pages, could be added as a type with a corresponding new path in the Step Function that would route that type to new lambdas that pull in all products and include a list on the published page. 

___

To set the last endpoint to go to the Step Function instead of a Lambda, we need modify the /publish resource.

First, we need to delete the proxy resource. Select the **/{proxy}** Resource under the /publish Resouce and then select **Delete Resource** under the Actions menu:

![delete proxy](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-delete-resource-publish-proxy.png)

Next, select the **ANY** Method under the /publish Resource and then select **Delete Method** under the Actions menu:

![delete proxy](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-delete-method-any.png)

Now, select the /publish Resource and select **Create Method** under the Actions menu. Use the menu to select **POST**:

![add post method](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-add-method-post.png)

The next screen will look like this:

![add post method](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-api-add-post-1.png)

You may see an error that says **Invalid model indetifier specified. Empty** -- you will fix this later.

Change the **Integration Type** from Lambda Function to **AWS Service** and then we need to configure as follows:

![step function link](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-post-config.png)

Here is your checklist:

- [x] Set Integration type to **AWS Service**
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

Now we need to tell API Gateway which State Machine to route POST calls made to this endpoint. This is handled with a **Mapping Template**. Click on the **Integration Request** for the POST/publish endpoint and then scroll down to **Mapping Templates**. Click **Add Mapping Template** and enter **Content-Type** as **application/json** and then save. Then enter the template below.

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


Now back in API Gateway, paste the Step Function ARN into the Mapping Template and then save. It should look like this (with your State Machine ARN):

![Mapping Template](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-to-STEP-link-step-function-mapping-template.png)

___

There are a few more steps to complete this endpoint to make sure it requires the IAM role and to make sure it uses json to properly communicate with the SPA...

First, we need to secure this endpoint to allow only authenticated and authorized users. Go to the **Method Request** and update **Authorization** to use **AWS_IAM** as shown below:

![method request](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/method-authorization.png)


Still in the **Method Request**, scroll down to **Request Body** and set the **Content type** to **application/json** and set the **Model name** to **RequestSchema** as shown below:

![method execution body](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-method-execution-request-body.png)

___

Next, click on **Method Response** for the /post Method and then enter a new HTTP Status for 200. Once saved, expand the option and enter a **Request Body** and set the **Content type** to **application/json** and set **Models** to **ResponseSchema** as shown below:

![response header](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-response-header-and-body.png)

___


The last step for the method is to enable CORS. Click on the POST method under /publish, and then select **Enable CORS**:

![cors](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/cors1.png)

Accept and if successful, you should get a message like this:

![cors](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/cors2.png)

___

With that done, your API should look like this:

![API All Resources](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/deploy-ready.png)

If it does, you can select **Deploy API** from the **Actions** menu to make your changes available.

___

## Try it out!

With all that in place, return to the Admin Module UI, sign out, and then sign back in and you should see the seed data in Pages.

If you do, then you have successfully connected the Backend with the Admin Module! 


## Final Configuration

Now we just need to:

- [ ] Set the URL for the Staging Bucket & CloudFront Distribution in the Admin Module
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

___

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
