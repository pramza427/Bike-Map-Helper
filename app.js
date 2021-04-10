import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
MDCRipple.attachTo(document.querySelector('.foo-button'));