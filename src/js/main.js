// Import examples : 

import './modules/example-module'; // the way imports your module 
// import { resizeVars } from './modules/another-example-module'; // the way imports your module if need certain variable use in current enviroment 

// import { resizeVars } from '.././modules/another-example-module'; // way you import module in another module 

// import 'gsap'; // the way fast imports external modules from node_modules 
// import { TweenLite, TimelineLite } from 'gsap'; // the way fast imports external modules from node_modules with certain name

// import { TimelineLite } from 'gsap/TimelineLite'; // the way imports external modules from node_modules if need to import not all lib but just one js file // if you need to find name of a certain js lib , the most comfortable way to install VS code package https://marketplace.visualstudio.com/items?itemName=jasonnutter.search-node-modules
// open command pallete type 'node' and choose Search node_modules , than find by name of library for example if gsap type 'gsap' and deeper until you find js you need 

// import exampleVendor from "./vendor/example-vendor.js";  // the way imports your vendor js 

// Import examples END 

(function () {
    "use strict";
})();
