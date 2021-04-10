import {MDCTopAppBar} from './node_modules/@material/top-app-bar';
import {MDCTextField} from './node_modules/@material/textfield';
import {MDCRipple} from './node_modules/@material/ripple';

const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
MDCRipple.attachTo(document.querySelector('.foo-button'));