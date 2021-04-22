// Instantiation
const textFields = document.querySelectorAll('.mdc-text-field');
textFields.forEach(text => {
	new mdc.textField.MDCTextField(text);
});

const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));

// Set text input bar to ripple
mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));

const list = mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

// Set topbar and add listener to open side bar
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

// checkbox and form
const checkbox = new mdc.checkbox.MDCCheckbox(document.querySelector('.mdc-checkbox'));
const formField = new mdc.formField.MDCFormField(document.querySelector('.mdc-form-field'));
formField.input = checkbox;

// Left bar list and listener
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});

document.querySelector(".foo-button").addEventListener("click", evt => {
		document.querySelector(".mdc-snackbar__label").innerHTML = 
		"You entered: " + document.querySelector("input").value;
	snackbar.open();
});

var links = document.querySelectorAll(".mdc-list-item");
links.forEach( link => {
	link.addEventListener("click", e => {
		var name = link.getAttribute("data-toScreen");
		document.querySelectorAll(".myPage").forEach(page => { 
			page.style.display = "none";
		});
		document.querySelector(".myPage#" + name).style.display = "block";

	});
});

// Create a database
const db = new Dexie('My Database');
db.version(3).stores({
	racks: 'address,ward,latitude, longitude, name'
});

// get the Schools data and populate the database
fetch("https://data.cityofchicago.org/resource/cbyb-69xx.json")
.then ( (response) => {return response.json() })
.then ( (result) => {
 	for(rack of result){
   		db.racks.put({address: rack.address, 	
   						ward: rack.ward, 
   						latitude: parseFloat(rack.latitude),
   						longitude: parseFloat(rack.longitude),
   						name: rack.community_name});		
   	}
});




