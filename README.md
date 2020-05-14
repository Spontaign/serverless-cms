# A Serverless Content Management System for Websites built with AWS
A serverless alternative to WordPress and other Content Management Systems. The project can be used to manage and host static and "semi-dynamic" websites. Easily extend to build in whatever functionality you need. This project uses AWS Serverless Application Model (SAM) to build the backend system and AWS Ampilfy and Vue.js to create a Single-Page Application (SPA) for authenticated access to manage content.

All pieces in the architecture diagram below are loosely coupled and individually relatively simple. Put together they form a serverless content management system that is highly performant for end users while being secure, redundant, AND cost effective (costing as little as a few dollars per month). All content is served to end users from CloudFront (AWS's CDN) so the website will perform at the highest level and can scale to meet any demand.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/serverless-cms-architecture.png)


## Getting Started

This project is installed in three steps. First install the backend using the SAM CLI. Second, install the Amplify/Vue.js admin module which creates the SPA used to manage the content and the corresponding authentication and API. Finally, connect the two and update your settings.

Once installed you will have a fully functioning Serverless Content Management System.

## Prerequisites

You will need the following:

* An AWS account
* General knowledge of AWS and know your way around the Console.
* AWS CLI
* AWS SAM CLI
* AWS Amplify CLI
* NPM CLI

## Installation

1) Start with the [README](sam-backend/README.md) in the sam-backend folder to install the backend. 

2) Next to the [README](amplify-vue-admin-module/README.md) in the amplify-vue-admin-module folder to install the Admin SPA, authenticaton, and the API.

3) Next connect the two by [following these instructions](CONNECTING.md).


## What does the CMS look like?

The CMS was designed to meet the following requirements:

* Provides the highest level of performance, availability, and security.
* Allows absolute control over the HTML served to end users.
* Has access control for people managing the content so they can make their own changes in real time.
* Allows business owners to EASILY manage content with the ability to make changes on their own.
* Is easily extendable to serve semi-dynamic content and process simple user data like  contact forms and image uploads.
* Is resistant to hacking / spam attacks.
* Is cost effective.

This Serverless Content Management System meets all of these requirements. The screens below give a taste.

### Admin Module Login

Secure sign using https and AWS Cognito. Once authenticated, you can manage Pages, Products, Images, Assets, Snippets, and Layouts. There is content seeded in during the installation but you can modify to fit your needs.  

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-signin.png)


### Pages

Create as many pages as you need. Products are similar to Pages and optionally allow you to host a catalog or list of your products, services or whatever the website is offering.

![Serverless Content Management System Architecture](https://spontaign-public.s3.us-west-2.amazonaws.com/serverless-cms/UI-pages-data.png)


### Layouts

Use as many layouts as you need. Snippets, resuable pieces like footers and navigation, can be added to layouts.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-layouts-data.png)


### Edit Page

Manage content with simple forms and a WYSIWYG editor and the ability to add photos. Pages and Products can be assigned different layouts.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-add-image-from-editor.png)


### Preview & Publish

Preview your changes from a staging S3 bucket before publishing to the CloudFront, then CDN.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-Publish.png)


### Published Content

Easily add your own styles, images, scripts, and content to and quickly publish pages.

![Serverless Content Management System Architecture](https://spontaign-public.s3-us-west-2.amazonaws.com/serverless-cms/UI-publised-page-with-image.png)


## AWS Compontents

The CMS was designed to meet the following requirements:






