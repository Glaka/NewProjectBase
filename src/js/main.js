"use strict";
(function(){
	var body = document.getElementById("body"),
	bodyClass = body.classList;
	//console
	console.log(body);
	console.log(body.classList);
	// action
	body.classList.add("body-addded-class");
	// new element
	var bodyText = document.createElement('h1');
	bodyText.innerHTML = bodyClass;
	body.appendChild(bodyText);
})();