import comp from './component';
import $ from 'jquery'
require('./index.less');
import 'bootstrap/dist/css/bootstrap.css';
$('#app').html(comp);
var img = document.createElement("img");
img.className = 'img-circle';
img.src = require("./zfpx.jpg");
document.body.appendChild(img);
console.log('abc');
