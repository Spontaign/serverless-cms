export const pageMixin = {
  
	methods: {
		
		/* called from editor as custom fucntion to handle uploaded images */
		handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

			this.editorImageUploading = true;

			let ext = file.name.split('.').pop();

			let fType = file.type;

			if (fType == "image/jpeg" || fType == "image/png" || fType == "image/gif") {
				console.log("Correct Image Type");
			}
			else {
				console.log("Incorrect file type!");    
				console.log("Incorrect file type! Must be an image JPG or PNG!");    
				return
			}

			this.uploadName = this.uploadedImagePrefix + this.newUploadId() + "." + ext;        			         
			this.getPostPolicy(this.uploadName, {file:file,Editor:Editor,cursorLocation:cursorLocation,resetUploader});

		},

		/* when upload has completed, this function returns url to the editor */
		newImageLoaded(path,imageObj) {

			imageObj.Editor.insertEmbed(imageObj.cursorLocation, "image", path);
			imageObj.resetUploader();
			this.entry.pendingChanges = true;

			this.editorImageUploading = false;

		},		

		toggleShow() {
			this.entry.show = !this.entry.show;
			this.entry.pendingChanges = true;
		},         
		pendingChanges() {
			this.entry.pendingChanges = true;
		},       
		editRawBody() {
			this.rawHTML = this.entry.pageBody;
		},
		editRawBodySubmit() {
			this.entry.pageBody = this.rawHTML;
			this.entry.pendingChanges = true;
		}	
	}

};	