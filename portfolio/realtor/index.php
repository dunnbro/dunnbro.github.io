<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Realtor Application</title>
		<link rel="stylesheet" type="text/css" href="css/realtorstyle.css">
	</head>
	<body>
		<div id="wrapper">
			<div id="header">
				<h1>My Properties</h1>
			</div>
			<div id="search">
				<fieldset>
					<legend>Enter Property Address</legend>
					<form id="form">
						Address:<br> 
						<input required type="text" id="address" value="40 Beachway" tabindex="1"><br>
						City:<br>
						<input required type="text" id="city" value="Whitmore Lake" tabindex="2"></br>
						State:<br>
						<input required type="text" id="state" value="MI" tabindex="3"><br>
						Zip:<br>
						<input required type="text" id="zip" value ="48109" tabindex="4"></br>
						<input type="submit" tabindex="5">
					</form>
				</fieldset>
				<button type="button" id="addToWebStorage" disabled>Add Property to List</button>
			</div>
			<div id="list">
				<h2>My Properties List</h2>
				<div id="content">
					<table id="stored_properties">
						
					</table>
				</div>
			</div>
			<div id="tabbedsection">
				<div class="tabs">
					<ul>
						<li id="tabHeader_1" tabindex= "6"><a>Map</a></li>
						<li id="tabHeader_2" tabindex= "7"><a>Calculator</a></li>
						<li id="tabHeader_3" tabindex= "8"><a>Comps</a></li>
					</ul>
				</div>
				<div id="tabcontent">
					<div class="tabpage" id="tabpage_1">
						<p>Map Will Appear Here</p>
					</div>
					<div class="tabpage" id="tabpage_2">
						<fieldset id="calculator">
							<legend>Loan Calculator</legend>
							<form id="loanCalculatorForm">
								<div class="row">
									<label for="loanamount">Loan Amount:</label><input type="text" id="loanAmount" tabindex="9"><span id="error_loan"></span>
								</div></br>
								<div class="row">
									<label for="interest">Interest:</label><input type="text" id="interest" tabindex="10"><span id="error_interest"></span>
								</div></br>
								<div class="row">
									<label for="months">Number of Months:</label><input type="text" id="months" tabindex="11"><span id="error_months"></span>
								</div></br>
								<button type="button" value="Get Monthly Amount" id="loanButton" tabindex="12">Get Monthly Amount</button>
							</form>
						</fieldset>
						<div id="loanResult">
						</div>
					</div>
					<div class="tabpage" id="tabpage_3">
						<p>Comps Will Appear Here</p>
					</div>
				</div>
			</div>
			
		</div>
	<script src="js/Ajax.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key="AIzaSyC8hvr-73bz9JJobS_Jf6GQXa1kc6PMgoM"type="text/javascript"></script>
	<script src="js/main.js"></script>
	</body>
</html>
