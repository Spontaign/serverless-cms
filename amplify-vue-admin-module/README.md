# Installing the Admin Module for the Serverless Content Management System

The Admin Module using AWS Amplify and Vue.js. 


## Installation

From the amplify-vue-admin-module directory on your local machine, do the following to let npm load all of the modules needed:

```
npm install
```

Now you can bring in Amplify to start building. 

```
amplify init
```

Name the project AdminModule and use the following settings:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-init.png)

Now you can add auth, api, and hosting. Start with auth...

```
amplify add auth
```

Here are the settings to enter:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-auth.png)

Then add api.

```
amplify add api
```

Here are the settings to enter for api:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-api.png)


And finally hosting.

```
amplify add hosting
```

Here are the settings to enter for hosting:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-add-hosting.png)

Lastly, publish the changes to create all of the resources:

```
amplify publish
```

You will get a prompt to confirm creating the set of resources:

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-publish-confirm.png)

It takes a few minutes for Amplify to build all of the resources in AWS and then build and publish the SPA. When complete, you will get the URL to the cloudfront website:


![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/AMP-publish-success.png)

> It can take a few minutes (or longer) for the DNS for CloudFront URL to fully propogate so this URL may not work right away. While you are waiting for the DNS to resolve, you can run the SPA locally by running *npm run serve*.

Go to the CloudFront URL (or your local URL if running locally) and you should see the Sign In / Sign Up box for the Admin Module.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-signin.png)

Click on *Create Account*, create your account, confirm your email address, and then sign in. Once you have successfully signed in, you are ready to move on to the next step!

[Connecting the Admin Module to the Backend](../CONNECTING.md)




