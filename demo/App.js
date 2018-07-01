/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Alert,
  Image,
  Button,
  Dimensions,
  StyleSheet,
  CameraRoll,
  ActionSheetIOS,
} from 'react-native';
import RNImagePicker from 'react-native-image-picker';
import RNHeicConverter from 'react-native-heic-converter';
import RNDocumentPicker from 'react-native-document-picker';

const pickerOptions = {
  title: 'Select file to upload',
  mediaType: 'mixed',
  allowsEditing: false,
  noData: true,
  rotation: 360,
};

const { width, height } = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {
  state = {
    jpgUri: '',
  }

  showImage = (jpgUri) => {
    console.log('Show result: ', jpgUri);
    this.setState({ jpgUri });
    Alert.alert('Check you console, please');
  }

  /**
   * RNHeicConverter callback
   * Using https://github.com/maxim-kolesnikov/react-native-heic-converter
   */
  heicConverterCallback = ({
    success, path, error, base64,
  }) => {
    console.log({
      success, path, error, base64,
    });
    if (!error && success && (path || base64)) {
      this.showImage(path || base64);
    } else {
      console.log('RNHeicConverter error: ', error);
    }
  };

  /**
   * Pick file from Dropbox, Drive or iCloud by RNDocumentPicker
   * Using https://github.com/Elyx0/react-native-document-picker
   */
  pickDocument = async () => {
    try {
      const document = await RNDocumentPicker
        .pick({ type: [RNDocumentPicker.types.allFiles] });

      /** react-native-heic-converter@1.0.2 */
      // RNHeicConverter.getJpgPath({
      //   uri: document.uri.replace('file://', '')
      // }, this.heicConverterCallback);

      /** react-native-heic-converter@1.1.0 */
      RNHeicConverter
        .convert({ path: document.uri }) // default with quality = 1 & jpg extension
        // .convert({ path: document.uri, quality: 0.7 }) // with 0.7 quality & jpg extension
        // .convert({ path: document.uri, extension: 'png' }) // png extension
        // .convert({ path: document.uri, extension: 'base64' }) // base64 extension
        .then(this.heicConverterCallback);
    } catch (err) {
      console.log('RNDocumentPicker error', err);
    }
  }

  /**
   * Pick image from the assets library or camera by React Native CameraRoll
   * Using https://facebook.github.io/react-native/docs/cameraroll.html#getphotos
   */
  cameraRollCallback = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(({ page_info: pageInfo }) => {
        const { start_cursor: startCursor } = pageInfo;

        RNHeicConverter
          .convert({ path: startCursor }) // default with quality = 1 & jpg extension
          // .convert({ path: startCursor, quality: 0.7 }) // with 0.7 quality & jpg extension
          // .convert({ path: startCursor, extension: 'png' }) // png extension
          // .convert({ path: startCursor, extension: 'base64' }) // base64 extension
          .then(this.heicConverterCallback);
      })
      .catch((error) => {
        // Error Loading Images
        console.log(error);
      });
  }

  /**
   * Pick image from the device library or directly from the camera by RNImagePicker
   * Using https://github.com/react-community/react-native-image-picker
   */
  pickerCallback = (response) => {
    const { error } = response;
    if (error) { return; }

    if (response.uri && response.uri.startsWith('file://')) {
      this.showImage(response.uri.replace('file://', ''));
    } else if (response.uri) {
      this.showImage(response.uri);
    }
  }

  toggleAttachFile = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Upload document', 'Take photo', 'Choose photo from library', 'Camera roll', 'Cancel'],
      cancelButtonIndex: 4
    }, (index) => {
      switch (index) {
        case 0: this.pickDocument(); break;
        case 1: RNImagePicker.launchCamera(
          pickerOptions,
          response => this.pickerCallback(response, 'camera')
        );
          break;
        case 2: RNImagePicker.launchImageLibrary(
          pickerOptions,
          response => this.pickerCallback(response, 'gallery')
        );
          break;
        case 3: this.cameraRollCallback();
          break;
        default: break;
      }
    });
  }

  render() {
    const { jpgUri } = this.state;
    return (
      <View style={styles.container}>
        {jpgUri
          ? <Image
            resizeMode="contain"
            style={{ width, height }}
            source={{ uri: jpgUri }}
          />
          : <Button
            color="#841584"
            title="Attach file"
            onPress={this.toggleAttachFile}
          />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});
