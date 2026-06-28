import React from 'react';
import { renderToString } from 'react-dom/server';
import { Home01, FingerPrintScanAlt } from '@dga-icons/react';
import { ShoppingCart01 } from '@dga-icons/react/solid-rounded';

console.log('--- Testing Default Import (Home01) ---');
const homeHtml = renderToString(React.createElement(Home01, { size: 32, color: "red", className: "custom-class" }));
console.log(homeHtml);
console.log('\n');

console.log('--- Testing Style Import (ShoppingCart01 solid-rounded) ---');
const cartHtml = renderToString(React.createElement(ShoppingCart01, { size: "2em", strokeWidth: 2 }));
console.log(cartHtml);
console.log('\n');

console.log('--- Testing Renamed Icon (FingerPrintScanAlt) ---');
const scanHtml = renderToString(React.createElement(FingerPrintScanAlt));
console.log(scanHtml);
