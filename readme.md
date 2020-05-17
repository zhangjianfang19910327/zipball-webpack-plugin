# Introduction

A webpack plug-in for handling output directory compression files

## install
With npm do:
```js
npm install zipball-webpack-plugin
```

## useage 
Here's an example webpack config illustrating how to use these options:
```js
// webpack.config.js
const Zip=require('zipball-webpack-plugin');
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new Zip({
      customPath: 'app-1.0.0.zip',
      removeOutputFile: true
    })
  ]
}

```

## options 
*customPath: Name of your zip file,  default ->app-1.0.0.zip, type{stirng}
*removeOutputFile:Whether to delete the output directory,default ->true, type{boolean}

## license
MIT
