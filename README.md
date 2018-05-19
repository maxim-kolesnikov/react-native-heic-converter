
# react-native-heic-converter [![npm version](https://badge.fury.io/js/react-native-heic-converter.svg)](https://badge.fury.io/js/react-native-heic-converter) [![npm](https://img.shields.io/npm/dt/react-native-heic-converter.svg)](https://npmcharts.com/compare/react-native-heic-converter?minimal=true) ![MIT](https://img.shields.io/dub/l/vibe-d.svg) ![Platform - iOS](https://img.shields.io/badge/platform-iOS-yellow.svg)

## Getting started

`$ npm install react-native-heic-converter --save`

## Features

- [x] Returns the data for the specified image in JPEG format.
- [ ] Returns the data for the specified image in PNG format.
- [ ] Returns the data for the encoded image in base64 format.
- [ ] Value of compression quality
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

### `RNHeicConverter.getJpgPath: (options{}, (error{}, result{}) => callback)`

## Usage
```jsx
import RNHeicConverter from 'react-native-heic-converter';

RNHeicConverter.getJpgPath({
    uri: you_string_uri,
}, (error, result) => {
    console.log(error, result); // null, { success: true, path: "path/to/jpg" }
});

```
  
