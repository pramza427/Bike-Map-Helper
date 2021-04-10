import {MDCTopAppBar} from './node_modules/@material/top-app-bar';
import {MDCTextField} from './node_modules/@material/textfield';
import {MDCRipple} from './node_modules/@material/ripple';

const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);