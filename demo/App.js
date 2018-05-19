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
   * Using https://github.com/makskolesnikov/react-native-heic-converter
   */
  heicConverterCallback = (e, r) => {
    if (!e && r.success && r.path) {
      this.showImage(r.path);
    } else {
      console.log('RNHeicConverter error: ', e);
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
      const pathToLocal = document.uri.startsWith('file://')
        ? document.uri.replace('file://', '')
        : document.uri;

      RNHeicConverter.getJpgPath({ uri: pathToLocal }, this.heicConverterCallback);
    } catch (err) {
      console.log('RNDocumentPicker error', err);
    }
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
      options: ['Upload document', 'Take photo', 'Choose photo from library', 'Cancel'],
      cancelButtonIndex: 3
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
