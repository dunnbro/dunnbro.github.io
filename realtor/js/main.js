var rel = {};

rel.init = function() {
	//sets up tabbed browsing for map, calculator and comps pages
	tabs();

	//load event listeners
	//submits the property search
	var form = document.getElementById('form');
	form.addEventListener ('submit', getData, true);//does this need to be set to true?
	
	//add item to local storage button
	var localStorage = document.getElementById('addToWebStorage');
	localStorage.addEventListener ('click', addLocalStorage, false);
	
	//submit loan calculation
	var loanCalculatorForm = document.getElementById('loanButton');
	loanCalculatorForm.addEventListener ('click', calculatorCheck, false);
	
	//remove a property from local storage
	var deletePropertyButton = document.getElementById('stored_properties');
	deletePropertyButton.addEventListener ('click', deleteProperty, false);
	
	//loads property from local storage on button press
	var loadPropertyButton = document.getElementById('stored_properties');
	loadPropertyButton.addEventListener('click', loadTheProperty, false);
	
	//resets calculator fields when the calculator tab is clicked
	var calcTab = document.getElementById('tabbedsection');
	calcTab.addEventListener('click', calculatorClick, false);
	
	//loads existing properties saved in local storage on page load
	readContents();
	
}

//from http://www.my-html-codes.com/javascript-tabs-html-5-css3
//sets up tabbed browsing for map, calculator, and comps pages
function tabs(){
	var container = document.getElementById("tabbedsection");
	var navItem = container.querySelector(".tabs ul li");
	var ident = navItem.id.split("_")[1];
	navItem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navItem.setAttribute("class","tabActiveHeader");
	
	//hide two tab contents we don't need
    var pages = container.querySelectorAll(".tabpage");
    for (var i = 1; i < pages.length; i++) {
      pages[i].style.display="none";
    }

    //this adds click event to tabs
    var tabs = container.querySelectorAll(".tabs ul li");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', displayPage, false);
    }
}	


// on click of the tabs, the correct page will display
function displayPage() {
  var current = this.parentNode.getAttribute("data-current");
  //remove class of activetabheader and hide old contents
  document.getElementById("tabHeader_" + current).removeAttribute("class");
  document.getElementById("tabpage_" + current).style.display="none";

  var ident = this.id.split("_")[1];
  //add class of activetabheader to new active tab and show contents
  this.setAttribute("class","tabActiveHeader");
  document.getElementById("tabpage_" + ident).style.display="block";
  this.parentNode.setAttribute("data-current",ident);
}

//if you're on a different tab page (calculator or comps) and search for a new property, the map page will display
function showMap (){
	var tab1 = document.getElementById("tabpage_1");
	var tab2 = document.getElementById("tabpage_2");
	var tab3 = document.getElementById("tabpage_3");
	
	//set map page to display and be active
	tab1.style.display="block";
	tab1.setAttribute("class","tabActiveHeader");
	
	//set calculator and comps pages to hidden
	tab2.style.display="none";
	tab2.removeAttribute("class");
	
	tab3.style.display="none";
	tab3.removeAttribute("class");
	
	//call tabs function again so that after map is displayed when searching a new property, tabbed pages work properly again
	tabs();
}	

//submits property search to zillow
function getData(e){
		//Prevents form submission default behavior
		e.preventDefault();
		
		//converts spaces to + sign for url
		var addressSpaces = document.getElementById('address').value;
		var address = addressSpaces.split(" ").join("+");
		
		var citySpaces = document.getElementById('city').value;
		var city = citySpaces.split(" ").join("+");
		
		var state = document.getElementById('state').value;
		var zip = document.getElementById('zip').value;
		
		var data = address+city+state+zip;
		
		var url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1b23pmyttl7_963mm&address="+address+"&citystatezip="+city+"+"+state;
		
		url = encodeURIComponent(url);
		
		
		Ajax.sendRequest('php/getData.php', handleRequest, url);
		
		
		function handleRequest(req){

			//embed map part
			var xml = req.responseXML;
			
			//check code in response xml to make sure everything is working correctly
			var code = xml.getElementsByTagName('code')[0].firstChild.nodeValue;
			
			var mapError = document.getElementById('tabpage_1');
			var compsError = document.getElementById('tabpage_3');
			//if 0 status isn't returned from zillow, there was a problem, so an error message needs to be loaded
			if (code !== '0'){
				
				//If this paragraph tag doesn't exist, that means the map is already loaded, so hide the map and create a paragraph that contains the error message
				if (!mapError.getElementsByTagName('p')[0]){
					//display map page of the tabs section
					showMap();
					//hide the map
					var map = document.querySelector(".gm-style").style.visibility='hidden';
					var newP = document.createElement("p");
					var error = document.createTextNode("We are sorry, there is no map information for the address you entered.");
					newP.appendChild(error);
					mapError.appendChild(newP);
					
					//delete comps table and display the error message
					var table = document.getElementById('tabpage_3').getElementsByTagName('table')[0];
					table.parentNode.removeChild(table);
					var compP = document.createElement("p");
					var errorMessage = document.createTextNode("We are sorry, there is no comparison information for the address you entered.");
					compP.appendChild(errorMessage);
					compsError.appendChild(compP);
				}
				
				//error message if nothing has been successfully search for yet
				//.gmstyle is the class used by google maps -- if that doesn't exist, that means no map has been loaded yet, so get the placeholder paragraph ("map will appear here") and replace it with the error message
				else if (!document.querySelector(".gm-style")){
					//display map page of the tabs section
					showMap();
					mapError.getElementsByTagName('p')[0].innerHTML = "We are sorry, there is no map information for the address you entered.";
					compsError.getElementsByTagName('p')[0].innerHTML = "We are sorry, there is no comparison information for the address you entered.";
					
				}

			}
			
			//if there is a 0 code, some results were found
			else{
				//puts the google map on page 1 of the tabbedpage section
				var myMap = document.getElementById('tabpage_1');
				
				//display map page when a property is searched, no matter what page is currently displayed
				showMap();

				//get latitude and longitude from xml
				var latitude = xml.getElementsByTagName('latitude')[0].firstChild.nodeValue;
				var longitude = xml.getElementsByTagName('longitude')[0].firstChild.nodeValue;
				
				myMap.style.width = '590px';
				myMap.style.height = '515px';
				
				//creates google map 
				var location = new google.maps.LatLng(latitude, longitude);
				var mapOptions = {
					center: location,
					zoom: 18,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				
				var map = new google.maps.Map(myMap, mapOptions);
				
				var marker = new google.maps.Marker({
					position: location,
					map: map,
					visible: true
					
				});
				

				//need to resize the map so that the entire map loads 
				google.maps.event.trigger(map, "resize");

				
				
				function getComps (){
					var compsXml = req.responseXML;
					
					//find the property's zillow ID
					var zillowId = xml.getElementsByTagName('zpid')[0].firstChild.nodeValue;
					
					//count set to 5 to return 5 results
					var compurl = "http://www.zillow.com/webservice/GetComps.htm?zws-id=X1-ZWz1b23pmyttl7_963mm&zpid="+zillowId+"&count=5";
					url = encodeURIComponent(compurl);
					
					Ajax.sendRequest('php/getData.php', handleComps, url);
		
						//constructs the comps table on tab page 3
						function handleComps(req){
							//get data from xml returned from ajax call
							var compXml = req.responseXML;
							var compCode = compXml.getElementsByTagName('code')[0].firstChild.nodeValue;
							console.log(compCode);
							
							//if comps can't be retrieved, the code won't be 0, so post a message saying so to the comps page
							if (compCode !== '0'){
								var noComps = document.getElementById('tabpage_3').getElementsByTagName('p')[0];
								console.log(noComps);
								noComps.innerHTML = 'No comps available for this property';
								
							}
							
							//if zillow does return comps, create a table for the results
							else{
								var addressXml = compXml.getElementsByTagName('street');
								var cityXml = compXml.getElementsByTagName('city');
								var stateXml = compXml.getElementsByTagName('state');
								var zipXml = compXml.getElementsByTagName('zipcode');
								var lowXml = compXml.getElementsByTagName('low');
								var highXml = compXml.getElementsByTagName('high');
								
								//organize the comps data into a table
								var output = '<table><thead><tr><th>Address</th><th>City</th><th>State</th><th>Zip</th><th>Amount</th></tr></thead><tbody>';
								var len = cityXml.length;
								for (var i = 0; i < len; i++){
									//average high and low estimates for property amount, format using currencyformat function
									var amount = Number((Number(lowXml[i].firstChild.nodeValue) + Number(highXml[i].firstChild.nodeValue))/2);
									var formatted = CurrencyFormat(amount);
									output += '<tr>';
									//get data of elements
									output += '<td>'+addressXml[i].firstChild.nodeValue+'</td>';
									output += '<td>'+cityXml[i].firstChild.nodeValue+'</td>';
									output += '<td>'+stateXml[i].firstChild.nodeValue+'</td>';
									output += '<td>'+zipXml[i].firstChild.nodeValue+'</td>';
									output += '<td>'+'$'+formatted+'</td>';
									output += '</tr>';
									
								}
								
								output += '</tbody></table>';
								//puts the table on tab page 3 of "tabbedsection"
								var response = document.getElementById('tabpage_3');
								response.innerHTML = output;
							} //end handleComps else
						}//end handleComps
				}//end getComps 
				//send another ajax using the zillow ID to retrieve comps data
				getComps();
			}//end else
		
		}//end handleRequest
		
		
	//Once a property search is submitted, the "add to web storage" button is enabled	
	document.getElementById('addToWebStorage').disabled = false;
	
}//end getData	

function addLocalStorage(e){
	e.preventDefault();
	
	var property = {};
	 
		property.address = document.getElementById('address').value;
		property.city = document.getElementById('city').value;
		property.state = document.getElementById('state').value;
		property.zip = document.getElementById('zip').value;
		property.id = property.address+" "+property.city+" "+property.state+" "+property.zip;
			
			
		var propertyName = property.id+property.address+property.city+property.state+property.zip;
		var key = "zillow"+property.id;
		var value = JSON.stringify(property);
		
		var table = document.getElementById("stored_properties");

			var rowCount = table.rows.length;
			var row = table.insertRow(rowCount);

			row.insertCell(0).innerHTML= '<input type="button" value = "remove" id="deleteProperty">';
			row.insertCell(1).innerHTML= '<input type="button" value = "view" id="viewProperty">';
			//var output = obj['address']+" "+obj['city']+" "+ obj['state']+" "+obj['zip'];
			row.insertCell(2).innerHTML= property.id;
	
	localStorage.setItem(key, value);
	
	//disable "add to local storage" button after an item is added
	document.getElementById('addToWebStorage').disabled = true;
	
}
	
// on page load, reads relevant local storage items and loads them
function readContents () {
	var str = "";
	for (var i = 0, len = localStorage.length; i < len; i++) {
		  var k = localStorage.key(i);
		  var v = localStorage.getItem(k);
		  
		  // if substring is not found using indexOf function, it will return -1, and continue will skip over it. This prevents irrelevant local storage items (those not containing "zillow" in the key's name) from displaying in the saved properties list
		  if (k.indexOf("zillow") === -1) continue;
		  
		  var obj = JSON.parse(v);
		  
			var table = document.getElementById("stored_properties");

			var rowCount = table.rows.length;
			var row = table.insertRow(rowCount);

			row.insertCell(0).innerHTML= '<input type="button" value = "remove" id="deleteProperty">';
			row.insertCell(1).innerHTML= '<input type="button" value = "view" id="viewProperty">';
			var output = obj['address']+" "+obj['city']+" "+ obj['state']+" "+obj['zip'];
			row.insertCell(2).innerHTML= output;
	}		
}	

function deleteProperty(evt){
	var currentNode = evt.target;
	var table = document.getElementById('stored_properties');
	
	//use event delegation to determine if what was clicked was a delete button
	if (currentNode.id === 'deleteProperty'){
		//if so, go up two DOM levels to get to the table row, then find the row's index number and delete it
		var row = currentNode.parentNode.parentNode;
		var deleteRowNumber = row.rowIndex;
			table.deleteRow(deleteRowNumber);
		
		//get the property's id from the table
		var rowId = row.childNodes[2].innerHTML;
		
		//set the property's id as the local storage key value
		var key = "zillow"+rowId;
		
		//delete local storage item 
		localStorage.removeItem(key);
	}
		
}

//loads and submits saved property from local storage
function loadTheProperty(e){
	var currentNode = e.target;	
	var table = document.getElementById("stored_properties");
	//use event delegation to determine if the "view" button was clicked
	if (currentNode.id === 'viewProperty'){
		
		var row = currentNode.parentNode.parentNode;    //gets the row for the view button that was clicked
		var rowId = row.childNodes[2].innerHTML;    //gets the property name -- the contents of the third column of the stored properties table
		var key = "zillow"+rowId;   //add "zillow" to the property name, then set that as the local storage key 
		
		var view = localStorage.getItem(key);   //retrieve the property from local storage
		
		//get the address, city, state, from the stored object
		var obj = JSON.parse(view);
		var address = obj['address'];
		var city = obj['city'];
		var state = obj['state'];
		var zip = obj['zip'];
		
		//fill in the property address form with the stored object values
		document.getElementById('address').value = address;
		document.getElementById('city').value = city;
		document.getElementById('state').value = state;
		document.getElementById('zip').value = zip;
		
		//submit the form
		getData(e);
	}	
}

//if the calculator tab is clicked, calculator fields, answer, and error messages are cleared and focus is set to the loan field
function calculatorClick (evt){
	var currentNode = evt.target;
	var id = currentNode.parentNode.id;
	
	//if calculator tab is clicked
	if (id === 'tabHeader_2'){
		var fields = document.getElementById('loanCalculatorForm');
		var len = fields.getElementsByTagName('input').length;
		
		//clears input fields
		for (i=0; i < len; i++){
			fields.getElementsByTagName('input')[i].value = "";
			
			//clears any error messages or loan results that might be displaying
			var loanError = document.getElementById('error_loan');
			loanError.innerHTML = "";
			
			var interestError = document.getElementById('error_interest');
			interestError.innerHTML = "";
			
			var monthError = document.getElementById('error_months');
			monthError.innerHTML = "";
			
			var loanResult = document.getElementById('loanResult');
			loanResult.innerHTML = "";
			
			//applies focus to the loan field
			document.getElementById('loanAmount').focus();
		}	
	}
}

//checks all the calculator input values to make sure they are valid before submitting the numbers to the actual calculator
function calculatorCheck (){
	
	//make sure loan input value is a whole number greater than 0
	var loan = document.getElementById('loanAmount').value;
	var loanError = document.getElementById('error_loan');
	var loanRange = /^[1-9]+[0-9]*$/;
	
	checkLoanAmount();
	function checkLoanAmount(){
		if (loanRange.test(loan) === true) {
			loanError.innerHTML = " "; //make sure the loan error message is hidden if the loan value is acceptable	
		}
		
		else {
			loanError.innerHTML = 'You must enter a whole number greater than 0';
			loanResult.innerHTML = " "; //make sure monthly loan payment is hidden if the loan input value is not allowed
		}
	}
	
	
	var interest = document.getElementById('interest').value;
	var interestError = document.getElementById('error_interest');
	var interestRange = /^\d*\.?[1-9]\d*$/;
	// following line currently doesn't allow for numbers like 1.02
	//    /^\+?(\d*[1-9]\d*\.?|\d*\.\d*[1-9]\d*)$/;
	checkInterest();
	function checkInterest(){
		
		if (interestRange.test(interest) === true){
			interestError.innerHTML = " "; //hides error message if interest value is ok
		}
		
		else {
			interestError.innerHTML = 'You must enter a number greater or equal to .1';
			loanResult.innerHTML = " ";
		}	
	}
	
	var months = document.getElementById('months').value;
	var monthError = document.getElementById('error_months');
	
	//monthRange checks to make sure the value is between 1 and 1000
	var monthRange = /^([1-9][0-9]{0,2})$/;
	
	checkMonths();
	function checkMonths () {
		if (monthRange.test(months) === true) {
			monthError.innerHTML = " ";
		}
		
		else {
			monthError.innerHTML = 'You must enter a whole number between 0 and 1000';
			loanResult.innerHTML = " ";
			return false;			
		}
	}
	
	//only proceed to loan calculator if all input values are acceptable 
	if (monthRange.test(months) === true && interestRange.test(interest) === true && loanRange.test(loan) === true){
		loanCalculator();
	}
	
}

http://www.willmaster.com/library/generators/currency-formatting.php
function CurrencyFormat(number)
{
   var decimalplaces = 2;
   var decimalcharacter = ".";
   var thousandseparater = ",";
   number = parseFloat(number);
   var sign = number < 0 ? "-" : "";
   var formatted = new String(number.toFixed(decimalplaces));
   if( decimalcharacter.length && decimalcharacter != "." ) { formatted = formatted.replace(/\./,decimalcharacter); }
   var integer = "";
   var fraction = "";
   var strnumber = new String(formatted);
   var dotpos = decimalcharacter.length ? strnumber.indexOf(decimalcharacter) : -1;
   if( dotpos > -1 )
   {
      if( dotpos ) { integer = strnumber.substr(0,dotpos); }
      fraction = strnumber.substr(dotpos+1);
   }
   else { integer = strnumber; }
   if( integer ) { integer = String(Math.abs(integer)); }
   while( fraction.length < decimalplaces ) { fraction += "0"; }
   temparray = new Array();
   while( integer.length > 3 )
   {
      temparray.unshift(integer.substr(-3));
      integer = integer.substr(0,integer.length-3);
   }
   temparray.unshift(integer);
   integer = temparray.join(thousandseparater);
   return sign + integer + decimalcharacter + fraction;
   //console.log(sign + integer + decimalcharacter + fraction);
}

function loanCalculator(){
	//get values from calculator fields
	var months = document.getElementById('months').value;
	var principle = document.getElementById('loanAmount').value;
	var interest = document.getElementById('interest').value;
	var rate = interest/1200;
	monthlypayment = (rate + (rate/(Math.pow((1+rate),months)-1)))*principle;
	//run it through CurrencyFormat to convert to proper monetary notation
	var formatted = CurrencyFormat(monthlypayment);
	var loanResult = document.getElementById('loanResult');
	loanResult.innerHTML = 'Your monthly payment is:</br>'+'$'+formatted;
		
}

rel.init();