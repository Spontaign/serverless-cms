# Installing the Admin Module for the Serverless Content Management System

The Admin Module uses AWS Amplify and Vue.js. 

**AWS Amplify** is development platform that makes is easy to build mobile and web applications. Authentication and authorization, in particular, is the big win when developing a viable serverless application. Authentication can typically be challenging and a primary reason why using WordPress or something similar for a CMS makes sense -- it has not made sense to build  authentication and authorization functionality when other systems already have it. This changes with tools like AWS Amplify. Being able to add authentication and authorization from a CLI removes the complexity and that barrier. Amplify also provisions your resources in the cloud uses application stacks just like the SAM build in the first step.

I chose **Vue.js** for this project because I think it is more accessible than Angular and React (Amplify has libraries for them as well). 


## Installation

From the amplify-vue-admin-module directory on your local machine, do the following to let npm load all of the modules needed:

```
npm install
```

Now you can bring in Amplify to start building the AWS resources.

```
amplify init
```

Name the project **"AdminModule"** and use the following settings:

![amplify init](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-init.png)

___

Now you can add auth, api, and hosting. Start with auth...

```
amplify add auth
```

Here are the settings to enter:

![amplify add auth](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-auth.png)

___

Next we will add api. This CMS uses a REST api and 5 endpoints. We can let Amplify do most of the work creating and securing the API to only authorized users. We will have Amplify create placeholder Lambda functions and then we will just swap them out for Lambdas created in the SAM backend. 

Here are the paths you will need to enter:

| Path | Restrict API Access | Description |
| --- | --- | --- |
| /entries | read | returns a set of objects |
| /entry | read | returns an object |
| /entry-update | update | updates/writes an object |
| /post-policy | read | returns a signed URL for S3 upload |
| /publish | create | initiates a Step Function to build and publish content |

Enter the command below...

```
amplify add api
```
... and then enter the following:

* API Type: **REST**
* Friendly name: **AdminModule**

Here is what that should look like:

![amplify add auth](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-add-api-start.png)

Now we can set up the five paths in the table above. For each one of them, you'll need to enter:

* Path from above
* Create a new lambda, and just use Hello World as this is a placeholder
* We do not need to access other resources for this Lambda function (SAM backend is building all of the other resources)
* Use the default names for the friendly name and the Lambda function
* Do not edit local lambda function
* Restrict API access should be set to **Yes**
* Select the Restrict API Access from the table above.

Start with /entries (read permission):

![/entries](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-entries.png)

Then /entry (read permission):

![/entry](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-entry.png)


Then /entry-update (update permission):

![/entry-update](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-entry-update.png)


Then /post-policy (read permission):

![/post-policy](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-post-policy.png)


Finally /publish (create permision and answer No when asked if you need another path):

![/publish](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/api-publish.png)


After configuring your fifth path, your api is ready to be deployed. For each of these paths, Amplify will do the following:

* create the API enpoint and link it to a placeholder Lambda
* enable CORS so the endpoint can be access using a SPA
* restrict the endpoint to only be accessible by users with the assigned IAM Role and only via the specific http method

This is powerful and a huge advantage to setting all of this up individually.

___

Finally we can add hosting. This will create the resources need to allow users to access the CMS system securely over the internet. 

```
amplify add hosting
```

Here are the settings to enter for hosting:

![Add hosting](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-hosting.png)

___

Lastly, publish the changes to create all of the resources:

```
amplify publish
```

You will get a prompt to confirm creating the set of resources:

![publish confirm](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/a1-amplify-resource-publish.png)

___

Amplify will handle creating the Cognito User Pool, the api in API Gateway, the S3 bucket and linked CloudFront distribution, as well as all of the IAM Roles & Policies and placeholder Lambda functions needed to link everything together. Not bad for five commands to the Amplify CLI.

It takes a few minutes for Amplify to build all of the resources in AWS and then build and publish the SPA. When complete, you will get the URL to the cloudfront website:


![publish success](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-publish-success.png)

___

Save the URL to the CloudFront Distribution but remember that this is a Vue project so you can also run...

```
npm run serve
```

...to run the SPA locally. You can also modify the SPA to fit your needs, test it locally, and then and run **amplify publish** again to move your changes to CloudFront for all admin users.

> **Note!** It can take a few minutes (or longer) for the DNS mapping CloudFront to the S3 bucket to fully propogate so the CloudFront URL may not work right away. While you are waiting for this to resolve, you can run the SPA locally.

Go to the CloudFront URL, or your local URL if running locally, and you should see the Sign In / Sign Up box for the Admin Module.

![sign in](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-signin.png)

Click on **Create Account**, fill out the form, confirm your email address, and then sign in. Once you have successfully signed in, you are ready to move on to the next step!

___

[Connecting the Admin Module to the Backend](../CONNECTING.md)




