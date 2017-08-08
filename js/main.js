var addItem = document.getElementById("paymentForm");
addItem.addEventListener('submit', saveData);


function saveData(e) { //grabbing and saving the data from the paymentForm
	console.log("Running savedData");
	var date = document.getElementById("date").value;
	var appName = document.getElementById("appname").value;
	var payType = document.getElementById("paymentType").value;
	var price = document.getElementById("amount").value;

	var status = document.getElementById("status").value;

	var itemId = chance.guid();

	var entry = {
		rDate: date,
		applicationName : appName,
		paymentType : payType,
		amount : price,
		id : itemId,
		status : status
	}
	if(status == "pending"){
	if(localStorage.getItem("pendingList") == null) {
		var pendingList = [];
		pendingList.push(entry);
		localStorage.setItem('pendingList',JSON.stringify(pendingList));
	}
	else{
		var pendingList = JSON.parse(localStorage.getItem('pendingList'));
		pendingList.push(entry);
		localStorage.setItem('pendingList',JSON.stringify(pendingList));
	}
}
else if(status == "recieved"){
	if(localStorage.getItem('confirmedList') == null) {
		var confirmedList = [];
		confirmedList.push(entry);
		localStorage.setItem('confirmedList',JSON.stringify(confirmedList));
	}
	else {
		var confirmedList = JSON.parse(localStorage.getItem('confirmedList'));
		confirmedList.push(entry);
		localStorage.setItem('confirmedList',JSON.stringify(confirmedList));
	}
}
	fetchData(status);
		e.preventDefault();
}

function deleteLocalItem(id,status){
	if(status === "recieved"){
		var entries = JSON.parse(localStorage.getItem("confirmedList"));

		for (var i = 0; i < entries.length; i++) {
			if(entries[i].id == id){
				entries.splice(i,1);
			}
		}
		localStorage.setItem('confirmedList',JSON.stringify(entries));
		fetchData(status);
	}
	else if(status === "pending"){
		var entries = JSON.parse(localStorage.getItem("pendingList"));

		for (var i = 0; i < entries.length; i++) {
			if(entries[i].id == id){
				entries.splice(i,1);
			}
		}
		localStorage.setItem('pendingList',JSON.stringify(entries));
		fetchData(status);
	}
}

function pendingSwitcher(id){
	var entries = JSON.parse(localStorage.getItem('pendingList'));
	var confirmedList = JSON.parse(localStorage.getItem('confirmedList'));
	if(confirmedList === null){
		confirmedList =[];
	}
	if(entries === null){
		entries =[];
	}
	for(var i = 0; i < entries.length; i++){
		if(id == entries[i].id){
			var tempEntry = entries[i];
			tempEntry.status = "recieved";
			entries.splice(i,1); //taking item out of pending list
			localStorage.setItem("pendingList",JSON.stringify(entries));
			confirmedList.push(tempEntry);
			localStorage.setItem("confirmedList",JSON.stringify(confirmedList));
		}
	}
fetchData("recieved");
fetchData("pending");
}

function fetchData(status) {
	console.log("Running fetchData");
	if(status === "recieved"){
		var entries = JSON.parse(localStorage.getItem('confirmedList'));
		var confirmedList = document.getElementById("confirmedListing");

		confirmedList.innerHTML = '';

		for(var i = 0; i < entries.length; i++){
			var rDate = entries[i].rDate;
			var appName = entries[i].applicationName;
			var paymentType = entries[i].paymentType;
			var price = entries[i].amount;
			var identity = entries[i].id;
			var status = entries[i].status;

			confirmedList.innerHTML += '<div class = "well" >'+
								'<p><span class =  "label">'+ rDate+'</span>'+
								'<span class =  "label">'+ appName+'</span>'+
								'<span class =  "label">'+ paymentType+'</span>'+
								'<span class = "label">' + price + '</span>'+
								'<a href="#" onclick="deleteLocalItem(\''+identity+'\',\''+ status+ '\')"class="btn btn-danger">Delete</a>'+
								// '<a href="#" "class="btn btn-danger">Delete</a>'+
								'</p>'+
							  '</div>';
		}
	}
	else if(status === "pending"){
		var entries = JSON.parse(localStorage.getItem('pendingList'));
		var pendingList = document.getElementById("pendListing");

		pendingList.innerHTML = '';

		for(var i = 0; i < entries.length; i++){
			var rDate = entries[i].rDate;
			var appName = entries[i].applicationName;
			var paymentType = entries[i].paymentType;
			var price = entries[i].amount;
			var identity = entries[i].id;
			var status = entries[i].status;

			pendingList.innerHTML += '<div class = "well" style = "background-color : grey ">'+
								'<p><span class =  "label">'+ rDate+'</span>'+
								'<span class =  "label">'+ appName+'</span>'+
								'<span class =  "label">'+ paymentType+'</span>'+
								'<span class = "label">' + price + '</span>'+
								'<a href="#" onclick="deleteLocalItem(\''+identity+'\',\''+ status+ '\')"class="btn btn-danger">Delete</a>'+
                              	//'<a href="#" "class="btn btn-danger">Delete</a>'+
								'<a href ="#" onclick = "pendingSwitcher(\''+identity+'\')" class="btn btn-success">Recieved</a>'+
							  '</div>';
		}
	}
}
fetchData("recieved");
fetchData("pending");