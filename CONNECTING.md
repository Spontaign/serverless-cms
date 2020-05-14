# Connecting the Admin Module and the Backend to complete installation for the Serverless Content Management System

Now that you have installed the Backend using SAM and the the Admin Module using AWS Amplify, you need to finsih things off by connecting them via API Gateway. Amplify created the Cognito User Pool and the API you'll need to handle authentication and authorization.


## Installation

We need to create 5 new Endpoints in API Gateway to form the connection:

* GET/entries => returns a set of objects => links to *GetDynamoDBObjects* Lambda
* GET/entry => returns details about an object => links to *GetDynamoDBObject* Lambda
* PUT/entry => updates an object => links to *PutDynamoDBObjects* Lambda
* GET/post-policy => returns a signed URL to enable clients to upload files directly to S3 (images) => links to *GetPostPolicyForUpload* Lambda
* POST/publish => initiates a Step Function to build a page or asset => links to *PublishStateMachine* Step Function

From the AWS Console, go to API Gateway and then select the recently created API.

During the Admin Module installation we created a /test endpoint. We won't need that so you can delete. Select /test and then *Delete Resource* under Actions:

![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/API-delete-resource.png)

Now we can start creating the 5 Endpoints. Since these endpoints will all be accessed from an SPA, we will need to configure CORS for each. 

Lets start with /entries. From Actions select *Create Resource*

![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/API-create-resource.png?)


Enter entries as the resource name and be sure to check the box to *Enable API Gateway CORS*.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-new-child-resource.png)


That will create the /entries resource with an OPTIONS method. First configure the OPTIONS method by clicking on it and setting the Integration type to Mock:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Options.png)


Now we need to update the Method Request and Method Response for the OPTIONS endpoint to be able to handle application/json used to communicate with the SPA.  

### Update Request Body for Method Request
Click on *Method Request* for the OPTIONS method and then select *Request Body* and set the Content type to application/json and set the Model name to RequestSchema as shown below:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-method-execution-request-body.png)


### Add HTTPS Status and Response Body for Method Response
Click on *Method Response* for the OPTIONS method and then enter a new HTTP Status for 200. Once saved, expand the option and enter a *Request Body* and set the Content type to application/json and set Models to ResponseSchema as shown below:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-response-header-and-body.png)


Now we can add the GET Method:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-add-METHOD.png)


...and then we need to link it to the correcta Lambda function. The /entries GET method links to the GetDynamoDBObjects Lambda. Be sure to set the Integration type to Lambda Function, check the box that says "Use Lambda Proxy Integration", and then find the correct Lambda:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-link-lambda.png)


> If you see the error saying *Invalid Model indetified*, you will add the Request and Response models shortly to correct this.

Now we need to secure this endpoint to allow only authenticated and authorized users. Go to the Method Request and update Authorization to use AWS_IAM as shown below:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-method-request-auth.png)


We need to also set this method to handle json from the SPA so follow the same steps above for *Update Request Body for Method Request* and *Add HTTPS Status and Response Body for Method Response*.

The last step for the method is to enable CORS.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Enable-CORS.png)


If you set things up properly you will see a screen like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-Enable-CORS-success.png)


With GET/entries now done, go through the same process for GET/entry, PUT/entry, and GET/post-policy. They all need CORS and need to be matched to the correct Lambda function.

| Endpoint | Method | Lambda | Status |
| ----------- | ----------- | ----------- | ----------- |
| entries | GET | GetDynamoDBObjects | X |
| entry | GET | GetDynamoDBObject |  |
| entry | PUT | PutDynamoDBObject |  |
| post-policy | GET | GetPostPolicyForUpload |  |


The last method, /publish, links to a STEP FUNCTION instead of a Lambda so it is handle slightly differenly. Step Function are a terrific way to build workflows and string together lambda functions are other AWS compenents. 

For this Serverless Content Management System, we use a Step Function to handle building pages, processing them, and then moving them to production. Here is the diagram for the Step Function:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/StepFunctionDefinition.png)


Let's break down how this works:

1. The /publish endpoint is called and it passes an id, a type, and a preview-or-publish parameter as input to the Step Function.
2. The first state of the Step Funciton is a choice and it routes the input to the next step according to the type. Pages get sent to a BuildPage lambda, Assets to the BuildAsset, and Products get handled they own way as well. 
3. All paths then return to a second choice state. This state checks the preview-or-publish parameter and routes accordingly.
4. For the publish route, the content goes through an additional state where it is compressed and then moved to the production bucket to be picked up by CloudFront, the CDN.

Step Functions are very powerful and this is where this CMS can be easily extended to handle multiple types of pages or products or whatever your specific needs.

To set up with last endpoint to go to the Step Function instead of a lambda, we need create the resource and set up the OPTIONS method just as above. When you create the POST method we need to get things up differently:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-to-STEP-link-step-function.png)

* Set Integration type to *AWS Service*
* Set your region
* Set AWS Service to *Step Functions*
* Set HTTP Method to *POST*
* Set Action Type to *Use action name*
* Set Action to *Start Execution*
* Enter the Execution Role (see next)

### Get the Execution Role
SAM already built the execution role for you. From the AWS Console, go to IAM and then select Roles. Enter "APIGatewayToStepFunction" in search to bring up the correct role. Click on it and then copy the ARN:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-AMI-find-APItoStep-Role.png)


Paste the ARN in the execution role and SAVE.

Now we need to tell API Gateway how to route POST calls to this endpoint to the Step Function. This is handled with a Mapping Template. Click on the Integration Request for the POST/publish endpoint and then scroll down to Mapping Tempates. Click *Add Mapping Template* and enter Content-Type as *applciation/json* and then save. You can then enter the template below.

Copy and paste the following into your template:

```
#set($input = $input.json('$'))
{
"input": "$util.escapeJavaScript($input).replaceAll("\\'", "'")",
"stateMachineArn": "ARN-To-Your-Step-Function-Here"
}
```

Now from the AWS Console, go to *Step Functions*, and find the Step Function created by your SAM deployment. It will start with *PublishStateMachine**. Click on it and copy the ARN and paste it in the Mapping Template and then save.

Here is what that screen should look like:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/StepFunctionDefinitiion.png)


Finally, just like the other 4 endpoints, you'll need to secure the POST method by updating the Authorization to AWS_IAM, *Update Request Body for Method Request* and *Add HTTPS Status and Response Body for Method Response*, and then enable CORS.

With that done, you can select **Deploy API** from the *Actions* menu to make your changes available.


Amplify allows authenticated users to access the API endpoints by allowing them to assume an IAM role. Creating and linking the roles to API Gateway and Cognito is all handled by Amplify, but we do need to modify the authorized role to include these five endpoints we just created.

Go to IAM and then select Roles. Search for authRole and select the role with the Trusted entities as **Identity Provider: congnito...***.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE.png)


Click on the one policy assigned to that Role and then Edit Policy and then select the JSON tab to edit the JSON directly. It should look like this:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE-4.png)


We just need to edit this JSON Policy to cover the five enpoints we just established in API Gateway. Edit the policy to match below and then save the policy:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/API-IAM-COGNITO-ROLE-3.png)


## Try it out!

With all that in place, return to the Admin Module UI, sign out, and then sign back in and you should see the seed data in Pages.

If you do, then you successfully connecting the Backend with the Admin Module!


## Final Configuration

Now we just need to:

- [ ] Set the URL for the Staging Bucket & CloudFront Distribution
- [ ] Enable a Lambda trigger when images have been uploaded
- [ ] Enable a Lambda trigger to handle cache invalidation on the Production S3 bucket
- [ ] Edit the Cognito User Pool to not allow Sign Ups


### Set the URL for the Staging Bucket & CloudFront Distribution

From the Admin Module, click on the SETTINGS tab at the top of the page:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-settings.png)


On a separate tab, from the AWS Console, go to S3. Find the bucket by searching for StagingBucket. Go into the bucket, select the properties tab and then copy the endpoint from the Static website hosting card. Paste the URL into the *Stage Website Base Url* field. Be sure to enter a training /.

Next, from the AWS Console, go to CloudFront. Find the distribution and copy the Domain Name and then replace it in the *Production Website Base Url* field. Be sure to enter a training /.

Save the changes.


### Enable a Lambda trigger when images have been uploaded

Images are uploaded to a specific S3 bucket. We have a Lambda that can move them to the staging and production S3 buckets but we need to enable a trigger.

In some of my uses of this CMS, I also create thumbnails and compress and optimize the images before loading them into the correct buckets. There are several applicatons in the Serverless Application Repository that can handle this for you and you can just plug them in. I won't go into that here, but there are plenty of option to process your images once they have been uploaded.

To add the trigger, go to the AWS Console and then Lambda. Search for the function *CopyUploadedImages* and go into the function. Select Add Trigger:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddUploadTrigger.png)


Select S3 and then the *uploadbucket*  and enable the trigger:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddUploadTrigger-2.png)


With the trigger on, any images added to the upload bucket will be copied to staging and production. Remember, this is where you could easily add image processing (resize, optimize, thumbnails, etc.).


### Enable a Lambda trigger to handle cache invalidation on the Production S3 bucket

CloudFront maximizes download times by caching copies of your content at their edge locations. This works great, but what happens if the content changes? The TTL can be pretty long so a CMS needs to be able to refresh content as it is modified.

Reshreshing content can easily be handled with an S3 triggering a Lambda that sends an invalidation request to CloudFront so that CloudFront will pick up a new version of the content the next time it is request. This Lambda is included in the backend already so we just need to add the S3 trigger.

To add the trigger, go to the AWS Console and then Lambda. Search for the function *InvalidateCloudFrontCache* and go into the function. Select Add Trigger:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddCacheTrigger.png)


Select S3 and then the *productionBucket*  and enable the trigger:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AddCacheTrigger-2.png)


With the trigger on, any object PUT into the production S3 bucket will call the lambda which will send an invalidation request so the content gets refreshed.

Invalidation requests do have a free tier that normal use will likely not exceed and if exceed they are pretty inexpensive. Having to send invalidation requests is a fair trade off for the performance gained by using CloudFront to deliver your content.


### Edit the Cognito User Pool to not allow Sign Ups

You probably do not want anyone to be able to sign up for an account to your content management system. Instead, you can go to the Cognito User Pool and turn off the ability to sign up. You will just manage users from the Cognito User Pool.

From the AWS Console go to Cognito and select the User Pool created for this project and then edit the section that includes *User sign ups allowed?*:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/Cognito-LockSignUp.png)


Then just change that setting to *Only allow administrators to create users*

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/Cognito-LockSignUp-2.png)


# Final Thoughts

With everything set up, you now have a working Serverless Content Management System. It is highly performant, secure, redundant, and should cost a few dollars per month.



## Bonus Points

### Contact Forms
I add serverless contact forms to the sites I've built using this system. Those have been handled well by other folks so here is a link to add the form to your site. You can certainly create the contact us page in this CMS but build the API Gateway and Lambdas as described in this [blog post](https://aws.amazon.com/blogs/architecture/create-dynamic-contact-forms-for-s3-static-websites-using-aws-lambda-amazon-api-gateway-and-amazon-ses/).

### Custom Domain Names
You can use AWS Certificate Manager and AWS Route 53 to update your CloudFront distribution to use your custom domain name. 
