# Installing the Admin Module for the Serverless Content Management System

The Admin Module use AWS Amplify and Vue.js. 

**AWS Amplify** is development platform that makes is easy to build mobile and web applications. Authentication, in particular, is the big win when developing a viable serverless application. Authentication can typically be challenging and a primary reason why using WordPress or something similar for a CMS makes sense -- it has not made sense to build  authentication and authorization functionality when other systems already have it. This changes with AWS Amplify. Being able to add authentication and authorization from a CLI removes the complexity and that barrier.

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

![Serverless Content Management System](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-init.png)

___

Now you can add auth, api, and hosting. Start with auth...

```
amplify add auth
```

Here are the settings to enter:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-auth.png)

___

Then add api.

```
amplify add api
```

Here are the settings to enter for api -- **be sure to name the API "AdminModule**:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-api.png)

___

And finally hosting.

```
amplify add hosting
```

Here are the settings to enter for hosting:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-hosting.png)

___

Lastly, publish the changes to create all of the resources:

```
amplify publish
```

You will get a prompt to confirm creating the set of resources:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-publish-confirm.png)

___

Amplify will handle creating the Cognito User Pool, the api in API Gateway, the S3 bucket and linked CloudFront distribution, as well as all of the IAM Roles & Policies and Lambda functions need to link everything together. Not bad for five commands to the Amplify CLI.

It takes a few minutes for Amplify to build all of the resources in AWS and then build and publish the SPA. When complete, you will get the URL to the cloudfront website:


![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-publish-success.png)

___

Once done, you will get the URL to the CloudFront Distribution. Note also that this is a Vue project so you can also run...

```
npm run serve
```

...to run the SPA locally. You can also modify the SPA to fit your needs and run **amplify publish** to move your changes to CloudFront.

> **Note!** It can take a few minutes (or longer) for the DNS mapping CloudFront to the S3 bucket to fully propogate so the CloudFront URL may not work right away. While you are waiting for this to resolve, you can run the SPA locally.

Go to the CloudFront URL, or your local URL if running locally, and you should see the Sign In / Sign Up box for the Admin Module.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-signin.png)

Click on **Create Account**, fill out the form, confirm your email address, and then sign in. Once you have successfully signed in, you are ready to move on to the next step!

___

[Connecting the Admin Module to the Backend](../CONNECTING.md)




