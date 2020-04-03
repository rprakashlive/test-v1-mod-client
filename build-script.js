const fs = require('fs-extra');
const concat = require('concat');    

(async function build() {

    const files =[
        './dist/custom-element-v1/runtime-es2015.js',
        './dist/custom-element-v1/polyfills-es2015.js',
        './dist/custom-element-v1/main-es2015.js'
    ]
    await fs.copyFile('./dist/custom-element-v1/styles.css', 'elements/styles.css')

    await fs.ensureDir('elements')
    
    await concat(files, 'elements/sample-element.js')
    console.info('Angular Elements created successfully!')

})()