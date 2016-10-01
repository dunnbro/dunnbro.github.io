var rel = {};

//from http://www.my-html-codes.com/javascript-tabs-html-5-css3
rel.init = function() {
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
      tabs[i].onclick=displayPage;
    }
	
	// on click of one of tabs
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
	//load event listeners
	var form = document.getElementById('form');
	
	//does this need to be set to true?
	form.addEventListener ('submit', getData, true);
	
	var localStorage = document.getElementById('addToWebStorage');
	localStorage.addEventListener ('click', addLocalStorage, false);
	
}
function getData(e){
		//Prevents form submission default behavior
		e.preventDefault();
		
		//converts spaces to + sign
		var addressSpaces = document.getElementById('address').value;
		var address = addressSpaces.replace(" ","+");
		
		var citySpaces = document.getElementById('city').value;
		var city = citySpaces.replace(" ","+");
		
		var state = document.getElementById('state').value;
		var zip = document.getElementById('zip').value;
		
		var data = address+city+state+zip;
		
		var url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1b23pmyttl7_963mm&address="+address+"&citystatezip="+city+"+"+state;
		
		url = encodeURIComponent(url);
		console.log(url);
		
		Ajax.sendRequest('php/getData.php', handleRequest, url);
		
		//var response = document.getElementById('tabpage_1');
		function handleRequest(req){
			
			//embed map part
			var xml = req.responseXML;
			
			var myMap = document.getElementById('tabpage_1');
			
			//parse xml, get latitude
			var latitude = xml.getElementsByTagName('latitude')[0].firstChild.nodeValue;
			
			var longitude = xml.getElementsByTagName('longitude')[0].firstChild.nodeValue;
			
			myMap.style.width = '640px';
            myMap.style.height = '480px';
			
			var mapOptions = {
				center: new google.maps.LatLng(latitude, longitude),
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.SATELLITE
			}
			console.log(latitude);
			var map = new google.maps.Map(myMap, mapOptions)


			
			
			//myMap.innerHTML = req.responseXML;
		}
}	

function addLocalStorage(e){
	e.preventDefault();
	
	var property = {};
	 
		property.address = document.getElementById('address').value;
		property.city = document.getElementById('city').value;
		property.state = document.getElementById('state').value;
		property.zip = document.getElementById('zip').value;
		property.id = property.address+property.city+property.state+property.zip;
	
		var propertyName = property.id+property.address+property.city+property.state+property.zip;
		var key = "zillow"+property.id;
	
	
	localStorage.setItem(key, JSON.stringify(property));
	console.log(property);
	refreshContents();
	
	function refreshContents(){
        var str = "";
		
		
        for (var i = 0; i < localStorage.length; i++) {
		//alert(localStorage.getItem(localStorage.key(i)));
			var k = localStorage.key(i);
			
			var v = localStorage.getItem(k);
			var obj = JSON.parse(v);
			
			var output = obj['address']+" "+obj['city']+" "+ obj['state']+" "+obj['zip'];
			
			/*var content = document.getElementsByTagName('table')[0];
			var row = document.createElement('tr');
		    var cell1 = document.createElement('td');
			var cell2 = document.createElement('td');
			var cell3 = document.createElement('td');
			var button1 = document.createElement('input');
				button1.id = "removeFromStorage";
				button1.type = "button";
				button1.value = "remove";
			var button2 = document.createElement('input');
				button2.id = "search";
				button2.type = "button";
				button2.value = "search";
			var addressTableValue = document.createTextNode(output);
			*/
			//var propertyID = obj['id'].value;
			
			
		  
		  // if substring is not found using indexOf function, it will return -1, and continue will skip over it. This prevents irrelevant local storage items (those not containing "zillow" in the key's name) from displaying in the saved properties list
		  if (k.indexOf("zillow") === -1 && k === "zillow"+property.id) continue;
			
		  //else if () continue;
			
			/*content.appendChild(row);
			row.appendChild(cell1);
			row.appendChild(cell2);
			row.appendChild(cell3);
			cell1.appendChild(button1);
			cell2.appendChild(button2);
			cell3.appendChild(addressTableValue);
			*/
		 }
			str +=  output + "<br />";
		  
		  
		  
		  
		  
		  
		  
		  content.innerHTML = str;
		  
		 /* var button = document.createElement('input');
		  button.id = "removeFromStorage";
		  button.type = "button";
		  button.value = "remove";
		  var removeButtonPlaceholder = document.getElementById('content');
		  removeButtonPlaceholder.appendChild(button);
		  
		  var remove = document.getElementById('removeFromStorage')
		  remove.addEventListener
		  */
		  
    }
	
	
	
	
}

	
	
	
rel.init();