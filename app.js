// Instantiation
const textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
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