
# react-native-heic-converter
[![npm version](https://badge.fury.io/js/react-native-heic-converter.svg)](https://badge.fury.io/js/react-native-heic-converter)
[![npm](https://img.shields.io/npm/dm/react-native-heic-converter.svg)](https://npmcharts.com/compare/react-native-heic-converter?minimal=true)
![MIT](https://img.shields.io/dub/l/vibe-d.svg)
![Platform - iOS](https://img.shields.io/badge/platform-iOS-yellow.svg)
[![issues](https://img.shields.io/github/issues/maxim-kolesnikov/react-native-heic-converter.svg?style=flat)](https://github.com/maxim-kolesnikov/react-native-heic-converter/issues)


## Contribution

**Issues** are welcome. Please add a code snippet. Quickest way to solve issue is to reproduce it on one of the examples in [DEMO](https://github.com/maxim-kolesnikov/react-native-heic-converter/tree/master/demo).

**Pull requests** are welcome. If you want to change API or making something big better to create issue and discuss it first. Before submiting PR please run ```eslint .``` Also all eslint fixes are welcome.

## Getting started

`$ npm install react-native-heic-converter --save`

## Features

- [x] Returns the data for the specified image in JPEG format.
- [x] Returns the data for the specified image in PNG format.
- [x] Returns the data for the encoded image in base64 format.
- [x] Value of compression quality
- [x] Support representation of an image in the Photos library.

## Mostly automatic installation

`$ react-native link react-native-heic-converter`

## Manual installation

<details>
    <summary>iOS (via CocoaPods)</summary>

Add the following lines to your build targets in your `Podfile`

```
pod 'react-native-heic-converter', :path => '../node_modules/react-native-heic-converter'
```

Then run `pod install`

</details>

<details>
    <summary>iOS (without CocoaPods)</summary>

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-heic-converter` and add `RNHeicConverter.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNHeicConverter.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

</details>

## Static Methods

#### `RNHeicConverter.convert(options{}).then(result{})`

## Options

| Property  | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| `path`  | `string`  |  | Path to your `.HEIC` file  |
| `quality`  | `number`  | `1`  | Set quality `0` to `1`, for `jpg` extension only  |
| `extension`  | `string`  | `jpg`  | File extension that you want get when convert: `jpg` or `png` or `base64` |

## Usage
```javascript
import RNHeicConverter from 'react-native-heic-converter';

RNHeicConverter
	.convert({ // options
		path: '/path/to/file.heic',
	})
	.then((result) => {
		console.log(result); // { success: true, path: "path/to/jpg", error, base64, }
	});
```
  
**Please have a look at my [example usage](https://github.com/maxim-kolesnikov/react-native-heic-converter/blob/master/demo/App.js).**

**[CHANGELOG](https://github.com/maxim-kolesnikov/react-native-heic-converter/blob/master/CHANGELOG)**
