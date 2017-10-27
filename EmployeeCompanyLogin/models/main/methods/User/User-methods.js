
model.User.entityMethods.validatePassword = function(password) {
	var ha1 = directory.computeHA1(this.ID, password);
	return (ha1 === this.HA1Key); //true if validated, false otherwise.
};


model.User.methods.addUser = function(signUpData) {
	// Add a new user account.
	var passwordRegexStr, isValid,
		newUser;

		//Check if the password is at least 7 characters and one digit.
		if (signUpData.password !== null) {
			passwordRegexStr = /[0-9a-zA-Z]{5,}/;
			isValid = passwordRegexStr.test(signUpData.password);
			if (!isValid) {
				return {error: 8025, errorMessage: "Password must be at least 5 characters."};
			}
		}
		
		var user = ds.User({email: signUpData.email}); // Get the user
		if (user) {
			return {error: 8030, errorMessage: "Email already exists."};
		}
		
		if (!signUpData.fullName) {
			return {error: 8030, errorMessage: "Name must be provided."};
		}
		if (!signUpData.email) {
			return {error: 8030, errorMessage: "Email must be provided."};
		}
		
		//Check if password is enterd the same both times on the Sign Up form.
		if (signUpData.password !== signUpData.verifyPassword) {
			return {error: 8030, errorMessage: "Verification of password failed."};
		}
		
		newUser =  ds.User.createEntity();
       	newUser.fullName = signUpData.fullName;  
       	newUser.email = signUpData.email;    
       	newUser.password = signUpData.password;
       	
       	//*** Best Pratice ***
       	//Save the new User in a Try Catch block and put your validation code for the email address in the User 
       	// onValidate() method (see model.User.events.onValidate below). This is better than doing validation checks in this 
       	// function because you may create other methods in the future that save a new User.
       	
       	try {
			newUser.save(); //Save the entity.
		}
		catch(e) {
			return {error: 8099, errorMessage: e.messages[1]};
		}
};

//Class methods scope.
model.User.methods.addUser.scope ="public";