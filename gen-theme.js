const fs = require('fs');

const lightRaw = { 'on-surface': '#0c1c16', 'on-secondary-fixed': '#253D2C', 'background': '#f7f9f8', 'outline': '#2E6F40', 'surface-variant': '#f0f4f2', 'surface-container': '#ffffff', 'on-secondary': '#ffffff', 'surface-container-high': '#f5f8f6', 'inverse-primary': '#4DBF7D', 'tertiary': '#772f2c', 'error': '#ba1a1a', 'tertiary-fixed-dim': '#ffb3ae', 'on-primary': '#ffffff', 'on-tertiary': '#ffffff', 'on-primary-fixed-variant': '#2E6F40', 'secondary': '#253D2C', 'on-secondary-container': '#253D2C', 'outline-variant': '#2E6F40', 'surface-tint': '#2E6F40', 'primary-container': '#2E6F40', 'on-primary-fixed': '#0c1c16', 'secondary-fixed-dim': '#3A483F', 'secondary-container': '#ebf0ee', 'primary-fixed': '#2E6F40', 'primary-fixed-dim': '#2E6F40', 'on-tertiary-fixed-variant': '#78302d', 'on-primary-container': '#2E6F40', 'surface-container-low': '#f7f9f8', 'on-error': '#ffffff', 'inverse-on-surface': '#f7f9f8', 'on-background': '#0c1c16', 'surface-dim': '#f0f4f2', 'surface-bright': '#f7f9f8', 'secondary-fixed': '#ebf0ee', 'tertiary-container': '#954642', 'on-tertiary-fixed': '#3e0406', 'surface-container-lowest': '#ffffff', 'tertiary-fixed': '#ffdad7', 'primary': '#2E6F40', 'surface': '#ffffff', 'on-surface-variant': '#253D2C', 'on-error-container': '#93000a', 'inverse-surface': '#121A15', 'on-secondary-fixed-variant': '#253D2C', 'surface-container-highest': '#f0f4f2', 'error-container': '#ffdad6' };
const darkRaw = { 'surface-container-low': '#121A15', 'on-tertiary-fixed': '#410005', 'surface-variant': '#2E3A32', 'primary': '#4DBF7D', 'on-tertiary': '#650911', 'surface-container-high': '#2E3A32', 'on-secondary': '#121A15', 'primary-fixed': '#4DBF7D', 'on-primary-fixed-variant': '#2E6F40', 'surface-dim': '#121A15', 'on-error-container': '#ffdad6', 'tertiary-fixed-dim': '#ffb3af', 'primary-container': '#2E6F40', 'background': '#1A241F', 'tertiary': '#ffb3af', 'inverse-on-surface': '#F1F8F4', 'on-surface-variant': '#C5D9CE', 'on-tertiary-fixed-variant': '#842225', 'surface-container': '#242E28', 'inverse-primary': '#2E6F40', 'secondary-fixed-dim': '#8BA99B', 'surface-container-lowest': '#080f0c', 'tertiary-fixed': '#ffdad7', 'on-error': '#690005', 'on-primary': '#121A15', 'on-tertiary-container': '#711419', 'error': '#ffb4ab', 'secondary-container': '#3A483F', 'on-background': "#F1F8F4", 'on-secondary-fixed': '#121A15', 'on-secondary-container': '#C5D9CE', 'secondary-fixed': '#2E3A32', 'on-primary-fixed': '#121A15', 'outline': '#4DBF7D', 'surface': '#242E28', 'outline-variant': '#3A483F', 'surface-container-highest': '#2E3A32', 'surface-bright': '#3A483F', 'surface-tint': '#4DBF7D', 'on-secondary-fixed-variant': '#242E28', 'tertiary-container': '#fc7c78', 'secondary': '#8BA99B', 'error-container': '#93000a', 'on-surface': '#F1F8F4', 'inverse-surface': '#F1F8F4', 'primary-fixed-dim': '#4DBF7D', 'on-primary-container': '#121A15' };

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