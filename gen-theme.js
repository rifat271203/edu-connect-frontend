const fs = require('fs');

const lightRaw = { 'on-surface': '#191c1d', 'on-secondary-fixed': '#012114', 'background': '#f8f9fa', 'outline': '#6f7a72', 'surface-variant': '#e1e3e4', 'surface-container': '#edeeef', 'on-secondary': '#ffffff', 'surface-container-high': '#e7e8e9', 'inverse-primary': '#81d8ad', 'tertiary': '#772f2c', 'error': '#ba1a1a', 'tertiary-fixed-dim': '#ffb3ae', 'on-primary': '#ffffff', 'on-tertiary': '#ffffff', 'on-primary-fixed-variant': '#005236', 'secondary': '#466554', 'on-secondary-container': '#4c6b5a', 'outline-variant': '#bec9c0', 'surface-tint': '#006c49', 'primary-container': '#006c49', 'on-primary-fixed': '#002113', 'secondary-fixed-dim': '#acceba', 'secondary-container': '#c8ebd5', 'primary-fixed': '#9df4c8', 'primary-fixed-dim': '#81d8ad', 'on-tertiary-fixed-variant': '#78302d', 'on-primary-container': '#93eabe', 'surface-container-low': '#f3f4f5', 'on-error': '#ffffff', 'inverse-on-surface': '#f0f1f2', 'on-background': '#191c1d', 'surface-dim': '#d9dadb', 'surface-bright': '#f8f9fa', 'secondary-fixed': '#c8ebd5', 'tertiary-container': '#954642', 'on-tertiary-fixed': '#3e0406', 'surface-container-lowest': '#ffffff', 'tertiary-fixed': '#ffdad7', 'primary': '#005136', 'surface': '#f8f9fa', 'on-surface-variant': '#3f4943', 'on-error-container': '#93000a', 'inverse-surface': '#2e3132', 'on-secondary-fixed-variant': '#2e4d3d', 'surface-container-highest': '#e1e3e4', 'error-container': '#ffdad6' };
const darkRaw = { 'surface-container-low': '#1c1b1b', 'on-tertiary-fixed': '#410005', 'surface-variant': '#353534', 'primary': '#4edea3', 'on-tertiary': '#650911', 'surface-container-high': '#2a2a2a', 'on-secondary': '#013824', 'primary-fixed': '#6ffbbe', 'on-primary-fixed-variant': '#005236', 'surface-dim': '#131313', 'on-error-container': '#ffdad6', 'tertiary-fixed-dim': '#ffb3af', 'primary-container': '#10b981', 'background': '#131313', 'tertiary': '#ffb3af', 'inverse-on-surface': '#313030', 'on-surface-variant': '#bbcabf', 'on-tertiary-fixed-variant': '#842225', 'surface-container': '#201f1f', 'inverse-primary': '#006c49', 'secondary-fixed-dim': '#9ed2b5', 'surface-container-lowest': '#0e0e0e', 'tertiary-fixed': '#ffdad7', 'on-error': '#690005', 'on-primary': '#003824', 'on-tertiary-container': '#711419', 'error': '#ffb4ab', 'secondary-container': '#21523c', 'on-background': "#e5e2e1", 'on-secondary-fixed': '#002113', 'on-secondary-container': '#91c4a8', 'secondary-fixed': '#baeed1', 'on-primary-fixed': '#002113', 'outline': '#86948a', 'surface': '#131313', 'outline-variant': '#3c4a42', 'surface-container-highest': '#353534', 'surface-bright': '#3a3939', 'surface-tint': '#4edea3', 'on-secondary-fixed-variant': '#1e4f3a', 'tertiary-container': '#fc7c78', 'secondary': '#9ed2b5', 'error-container': '#93000a', 'on-surface': '#e5e2e1', 'inverse-surface': '#e5e2e1', 'primary-fixed-dim': '#4edea3', 'on-primary-container': '#00422b' };

let css = ':root {\n';
for (let key in lightRaw) {
    css += '  --color-' + key + ': ' + lightRaw[key] + ';\n';
}
css += '}\n\n.dark {\n';
for (let key in darkRaw) {
    css += '  --color-' + key + ': ' + darkRaw[key] + ';\n';
}
// any missing from dark that are in light?
for (let key in lightRaw) {
    if (!darkRaw[key]) {
        css += '  --color-' + key + ': ' + lightRaw[key] + ';\n';
    }
}
css += '}\n';
fs.writeFileSync('generated-theme.css', css);

let tw = '';
for (let key in lightRaw) {
    tw += '        \'' + key + '\': \'var(--color-' + key + ')\',\n';
}
for (let key in darkRaw) {
    if (!lightRaw[key]) {
        tw += '        \'' + key + '\': \'var(--color-' + key + ')\',\n';
    }
}
fs.writeFileSync('generated-tw.txt', tw);