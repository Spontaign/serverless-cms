import { API } from "aws-amplify";
import axios from 'axios'

export const fileUploadMixin = {

	methods: {

		/* returns unique id for uploaded images */
		newUploadId() {
			return Math.floor(Date.now() / 1000).toString() + Math.random().toString(36).substring(2, 10);
		},

		/* get a post policy from AWS to allow client to post a file directly to the S3 bucket */
		getPostPolicy(fileName, imageObj) {

			let vm = this;

			let apiName = 'AdminModule';
			let path = '/post-policy';
			let apiInit = {
				queryStringParameters: {  
					fileName: fileName            
				}
			};

			API.get(apiName, path, apiInit).then(response => {        
				console.log("response from AWS is... ", response)
				vm.handleImagePost(response,imageObj)
			}).catch(error => {
				console.log(error.response)
			});

		},

		/* received post policy and actually uploades the file to S3 via POST */
		handleImagePost(ap,imageObj) {

			let vm = this

			let fd = new FormData();

			fd.append("Policy",ap.fields.Policy);
			fd.append("key",ap.fields.key);
			fd.append("X-Amz-Algorithm",ap.fields['X-Amz-Algorithm']);
			fd.append("X-Amz-Credential",ap.fields['X-Amz-Credential']);
			fd.append("X-Amz-Date",ap.fields['X-Amz-Date']);
			fd.append("X-Amz-Security-Token",ap.fields['X-Amz-Security-Token']);
			fd.append("X-Amz-Signature",ap.fields['X-Amz-Signature']);

			fd.append("file", imageObj.file, ap.fields.key);

			axios({
				method: 'post',
				url: ap.url,
				data: fd,
				headers: {'Content-Type': 'multipart/form-data','Accept': 'text/html,application/xhtml+xml,application/xml,application/json, text/plain, */*' }
			})      
			.then(response => {                 

				console.log("Passing to handleNewImage... => response is...", response);
				let path = vm.stageWebBase + ap.fields.key;
				vm.handleNewImage(path,imageObj);

			})

		},

		/* after successful upload, test to make sure file is available */
		async handleNewImage(path,imageObj) {

			let vm = this;

			console.log("Testing this image...", path);   

			for (let i = 0; i < 10; i++) {

			console.log("Waiting 3 seconds for image to load. Try#", (i+1) );       

				await new Promise(resolve => setTimeout(resolve,3000));
					let imageTest = await vm.testImage(path);
					console.log("imageTest is ", imageTest);
					if(imageTest) {
					vm.newImageLoaded(path,imageObj);
					i = 10;
				}   

			}

		},        

		/* tries to get newly uploaded image to be sure it is available */
		async testImage(path) {
			console.log("Testing if image exists => ", path);
			let image = new Image();
			image.src = path;
			console.log("image is ", image);
			console.log("image.width is ", image.width);
			if (image.width !== 0) {
				return true;
			} else {
				return false;
			}            
		}



	}
};
