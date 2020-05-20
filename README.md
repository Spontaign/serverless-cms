# A Serverless Content Management System for Websites built with AWS
A serverless alternative to WordPress, Drupal, Joomla, and other Content Management Systems. This project can be used to create, manage, and host websites with static and frequently changing content. Easily extend to build in whatever functionality you need. This project uses AWS Serverless Application Model (SAM) to build the backend system and AWS Ampilfy and Vue.js to create a Single-Page Application (SPA) for authenticated access to manage content.

All pieces in the architecture diagram below are loosely coupled and individually relatively simple. Put together they form a serverless content management system that is highly performant for end users while being secure, redundant, AND cost effective (costing as little as a few dollars per month). All content is served to end users from CloudFront (AWS's CDN) so the website will perform at the highest level and can automatically scale to meet any demand.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/serverless-cms-architecture.png)


## Why build this?

This project is intended to be a **Proof of Concept** for a Serverless Content Management System. I have used all sorts of content management systems over the years (like WordPress, Drupal Joomla) and they all work great. However, I have never wanted ALL the functionality that comes with those systems nor the need to provision or pay for server hosting. 

There are some other options out there, like [Webiny](https://www.webiny.com/), but that uses React and I have taken to Vue.js. I really just want a lean system that can be easily deployed and then be able to quickly build, publish, and manage websites using AWS. This project is intended to show how it could work.

Installing this project will yield a working content management system. While I use it for my own production projects, there are no warranties. There are many topics covered with this project so it would be a great way to get exposed to AWS, Lambda (Node.js runtime), Amplify, Vue.js, Step Functions, and more. In particular, this project shows how you can join together AWS components to form applications.


## Getting Started

Install this serverless content management system in three steps. First install the backend using the SAM CLI. Second, install the Amplify/Vue.js admin module which creates the SPA used to manage the content and the corresponding authentication and API. Finally, connect the two and update your settings. The first two steps are automated and use command-line interfaces. The last step requires configuration in the AWS Console.

Once installed you will have a fully functioning Serverless Content Management System.

## Prerequisites

You will need the following:

* NPM CLI
* An AWS account
* General knowledge of AWS and know your way around the Console.
* AWS CLI
* AWS SAM CLI
* AWS Amplify CLI


## Installation

1) Start with the [README](sam-backend/README.md) in the sam-backend folder to install the backend. 

2) Next, go to the [README](amplify-vue-admin-module/README.md) in the amplify-vue-admin-module folder to install the Admin SPA, authentication, and the API.

3) Finally, connect the two by [following these instructions](CONNECTING.md).


## What does the CMS look like?

The Serverless Content Management System was designed to meet the following requirements:

* Provides the highest level of performance and availability to end users.
* Allows absolute control over the HTML served to end users.
* Allows non-technical users to EASILY and securely manage content with the ability to make changes on their own in real-time.
* Is easily extendable to serve frequently changing content and process simple user data like contact forms and image uploads.
* Is secure and resistant to hacking / spam attacks.
* Is cost effective.

This Serverless Content Management System meets all of these requirements. The screens below give a taste.

### Admin Module Login

Secure sign using AWS CloudFront and Cognito. Once authenticated, you can manage Pages, Products, Images, Assets, Snippets, and Layouts. 

![sign in](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-signin.png)

___

### Pages

Create as many pages as you need. Products are similar to Pages and optionally allow you to host a catalog or list of your products, services or whatever the website is offering.

![pages](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/s-pages.png)

___

### Layouts

Use as many layouts as you need. Layouts can reference your css and/or js frameworks and provide basic structure to your pages. Snippets, reusable pieces like footers, navigation, and tracking tags, can be added to layouts. 

![layouts](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-layouts.png)

___

### Edit Page

Manage content with simple forms and use WYSIWYG editors with the ability to add inline photos. Pages and Products can be assigned different layouts.

![wysiwyg editor](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-editpage.png)

___

### Preview & Publish

Preview your changes from a staging S3 bucket website before publishing for end users on CloudFront, the AWS CDN.

![preview and publish](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-publish.png)

___

### Published Content

Easily add your own styles, images, scripts, and content and quickly publish pages.

![published content](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/s-page.png)



## Additional Details


### Customizing
Out of the box you control what your pages look like with layouts, snippets, assets, and images. Add whatever css frameworks or templates you like to the your layouts. Layouts can contain snippets (like navigation or footer) and individual pages can be assigned specific layouts. Pages also can have specific css and js added to the head or at the bottom of the page.

You can create your own Lambdas and modify the Step Function for even more customization. For example, you could add a Lambda and a new Step Function path to create a catalog listing of your products that could be rebuilt and refreshed as products change.

"Products" are included in the installation and are intended to get you started. Customize "Products" however you need. Currently Products have "Features" which are tied to products and generate a simple list when the pages are built by the Step Function. Note that we are taking advantage of DynamoDB's NoSQL structure to extend Products by using a unique **Partition Key** but then different **Sort Keys**. "Product" and "Product Features" have the same Partition Key but different Sort Keys. This could easily be expanded to include additional data specific to your products. You could add a similar configuration for "Product Images" or anything else. 

> Using DynamoDB as the primary data store also provides redundancy and disaster recovery with automatic point-in-time recovery and manual backups.  


### Contact Forms
I add serverless contact forms to the sites I've built using this system. That functionality has been handled well by other folks, so I'll refer you to them. You can certainly create the contact us page in this CMS but build the API Gateway and Lambdas as described in this [blog post](https://aws.amazon.com/blogs/architecture/create-dynamic-contact-forms-for-s3-static-websites-using-aws-lambda-amazon-api-gateway-and-amazon-ses/).


### Custom Domain Names
You can use AWS Certificate Manager and AWS Route 53 to update your CloudFront distribution to use your custom domain name. 


### Future Enhancements
It should be straightforward to roll the SAM Build application (install step 1) into the Amplify framework (install step 2) thereby allowing an even simpler deployment. Further, by combining the first two steps into one, it would eliminate the need to connect them in the current third installation step. When I get some more time I will look into it!


### Sample Sites using Serverless CMS

[A Real Estate Team](https://www.bartlettre.com) uses this CMS to manage their static pages and their real estate listings. They are able to add and edit their listings and pages. Custom workflow includes rebuilding and refreshing Active and Sold pages when there are changes to listings. In addition, there is additional image processing to resize, optimize, and generate thumbnails.
