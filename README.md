
# react-native-heic-converter [![npm version](https://badge.fury.io/js/react-native-heic-converter.svg)](https://badge.fury.io/js/react-native-heic-converter) [![npm](https://img.shields.io/npm/dt/react-native-heic-converter.svg)](https://npmcharts.com/compare/react-native-heic-converter?minimal=true) ![MIT](https://img.shields.io/dub/l/vibe-d.svg) ![Platform - iOS](https://img.shields.io/badge/platform-iOS-yellow.svg)

## Contribution

**Issues** are welcome. Please add a code snippet. Quickest way to solve issue is to reproduce it on one of the examples in demo.

**Pull requests** are welcome. If you want to change API or making something big better to create issue and discuss it first. Before submiting PR please run ```eslint .``` Also all eslint fixes are welcome.

## Getting started

`$ npm install react-native-heic-converter --save`

## Features

- [x] Returns the data for the specified image in JPEG format.
- [x] Returns the data for the specified image in PNG format.
- [x] Returns the data for the encoded image in base64 format.
- [x] Value of compression quality
- [ ] Save to the photo gallery

## Mostly automatic installation

`$ react-native link react-native-heic-converter`

## Manual installation


### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-heic-converter` and add `RNHeicConverter.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNHeicConverter.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Static Methods

#### `RNHeicConverter.convert(options{}).then(result{ success: Boolean, path: String, error: String, base64: String })`

## Options

| Property  | Type | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| `path`  | `string`  |  | Path to your `.HEIC` file  |
| `quality`  | `number`  | `1`  | Set quality `0` to `1`, for `jpg` extension only  |
| `extension`  | `string`  | `jpg`  | File extension that you want get when convert: `jpg` or `png` or `base64` |

## Usage
```jsx
import RNHeicConverter from 'react-native-heic-converter';

RNHeicConverter
    .convert({ // options
        path: '/path/to/file.heic',
    })
    .then((result) => {
        console.log(result); // { success: true, path: "path/to/jpg", error, base64, }
    });
```
  
