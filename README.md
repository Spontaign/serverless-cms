# A Serverless Content Management System for Websites built with AWS
A serverless alternative to WordPress, Drupal, Joomla, and other Content Management Systems. This project can be used to create, manage, and host websites with static and frequently-changing content. Easily extend to build in whatever functionality you need. This project uses AWS Serverless Application Model (SAM) to build the backend system and AWS Ampilfy and Vue.js to create a Single-Page Application (SPA) for authenticated access to manage content.

All pieces in the architecture diagram below are loosely coupled and individually relatively simple. Put together they form a serverless content management system that is highly performant for end users while being secure, redundant, AND cost effective (costing as little as a few dollars per month). All content is served to end users from CloudFront (AWS's CDN) so the website will perform at the highest level and can automatically scale to meet any demand.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/serverless-cms-architecture.png)


## Why build this?

Good question! This project is intended to be a **Proof of Concept** of a Serverless Content Management System. I have used all sorts of content management systems over the years (like WordPress, Drupal Joomla) and they all work great. However, I have never wanted ALL the functionality that comes with those systems nor the need to provide or pay for server hosting. A Serverless alternative is definitely achievalble and this project is intended to prove the point.

Installing this project will yield a working content management system. While I use it for my own production projects, you can use it at your own risk. There are many topics covered with this project so it would be a great way to get exposed to AWS, Lambda, Amplify, Vue.js, Step Functions, and more. In particular, this project shows how you can join together AWS components to form applications.


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

2) Next, go to the [README](amplify-vue-admin-module/README.md) in the amplify-vue-admin-module folder to install the Admin SPA, authenticaton, and the API.

3) Finnally, connect the two by [following these instructions](CONNECTING.md).


## What does the CMS look like?

The Serverless Content Management System was designed to meet the following requirements:

* Provides the highest level of performance and availability to end users.
* Allows absolute control over the HTML served to end users.
* Allows business owners to EASILY and securly manage content with the ability to make changes on their own in real-time.
* Is easily extendable to serve semi-dynamic content and process simple user data like contact forms and image uploads.
* Is secure and resistant to hacking / spam attacks.
* Is cost effective.

This Serverless Content Management System meets all of these requirements. The screens below give a taste.

### Admin Module Login

Secure sign using AWS CloudFront and Cognito. Once authenticated, you can manage Pages, Products, Images, Assets, Snippets, and Layouts. 

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-signin.png)

___

### Pages

Create as many pages as you need. Products are similar to Pages and optionally allow you to host a catalog or list of your products, services or whatever the website is offering.

![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/UI-pages-data.png)

___

### Layouts

Use as many layouts as you need. Snippets, resuable pieces like footers and navigation, can be added to layouts.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-layouts-data.png)

___

### Edit Page

Manage content with simple forms and use WYSIWYG editors with the ability to add inline photos. Pages and Products can be assigned different layouts.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-add-image-from-editor.png)

___

### Preview & Publish

Preview your changes from a staging S3 bucket website before publishing for end users on CloudFront, the AWS CDN.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-Publish.png)

___

### Published Content

Easily add your own styles, images, scripts, and content and quickly publish pages.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-publised-page-with-image.png)



## Additional Details


### Customizing
Out of the box you control what your pages look like with layouts, snippets, assets, and images. Add whatever css frameworks or templates you like to the your layots. Layouts can contain snippets (like navigation or footer) and individual pages can be assigned specific layouts. Pages also can have specific css and js added to the head or at the bottom of the page.

You can create your own Lambdas and modify the Step Function for even more customation. For example, you could add a Lambda and a new Step Funciton path to create a catalog listing of your products that could be rebuild as products change.

"Products" are included in the installation and are intended to get you started. Customize "Products" however you need. Currently Products have "Features" which are tied to products and generate a simple list when the pages are built by the Step Function. Note that we are taking advantage of DynamoDB's NoSQL structure to extend Products by using a unique **Partition Key** but then different **Sort Keys**. "Product" and "Product Features" have the same Partition Key but different Sort Keys. This could easily be expanded to include additional data specific to your products. You could add a similar configuration for "Product Images" or anything else. 

> Using DynamoDB as the primary data store also provides redundancy and disaster recovery with automatic point-in-recovery and manual backups.  


### Contact Forms
I add serverless contact forms to the sites I've built using this system. Those have been handled well by other folks so here is a link to add the form to your site. You can certainly create the contact us page in this CMS but build the API Gateway and Lambdas as described in this [blog post](https://aws.amazon.com/blogs/architecture/create-dynamic-contact-forms-for-s3-static-websites-using-aws-lambda-amazon-api-gateway-and-amazon-ses/).


### Custom Domain Names
You can use AWS Certificate Manager and AWS Route 53 to update your CloudFront distribution to use your custom domain name. 


### Sample Sites using Serverless CMS

[A Luxury Real Estate Team](https://www.bartlettre.com) using this CMS to manage their static pages and their real estate listings. They are able to add and edit their listings and pages. Custom workflow includes Active and Sold pages that change as listing statuses change plus image optimization.
