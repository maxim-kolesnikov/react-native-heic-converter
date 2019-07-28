import React from 'react';
import {
  View,
  Alert,
  Image,
  Button,
  Dimensions,
  StyleSheet,
  ActionSheetIOS,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNImagePicker from 'react-native-image-picker';
import RNHeicConverter from 'react-native-heic-converter';
import RNDocumentPicker from 'react-native-document-picker';

const { width, height } = Dimensions.get('window');
const pickerOptions = {
  title: 'Select file to upload',
  mediaType: 'mixed',
  allowsEditing: false,
  noData: true,
  rotation: 360,
};

export default class App extends React.Component {
  state = {
    jpgUri: '',
  };

  showImage = jpgUri => {
    console.log('Result: ', jpgUri);
    this.setState({ jpgUri });
    Alert.alert('Check you console, please', '', [
      {
        text: 'Ok',
      },
      {
        text: 'Clear',
        onPress: () => this.setState({ jpgUri: '' }),
        style: 'cancel',
      },
    ]);
  };

  /**
   * RNHeicConverter callback
   * Using https://github.com/maxim-kolesnikov/react-native-heic-converter
   */
  heicConverterCallback = ({ success, path, error, base64 }) => {
    console.log({ success, path, error, base64 });
    if (!error && success && (path || base64)) {
      this.showImage(path || base64);
    } else {
      console.log('RNHeicConverter error: ', error);
    }
  };

  /**
   * Pick file from Dropbox, Drive or iCloud by RNDocumentPicker
   * Using https://github.com/react-native-community/react-native-image-picker
   */
  pickDocument = async () => {
    try {
      /**
       * Loading HEIC file from Files App
       * documents { uri: {string} }
       * "file:///private/var/mobile/Containers/Data/Application/2135A136-XXXX-YYYY-DDDD-342D9237D92C/tmp/react.native.heic.converter.demo-Inbox/IMG_1643.HEIC"
       */
      const document = await RNDocumentPicker.pick({
        type: [RNDocumentPicker.types.allFiles],
      });

      console.log({ document });

      RNHeicConverter.convert({ path: document.uri }) // default with quality = 1 & jpg extension
        // .convert({ path: document.uri, quality: 0.7 }) // with 0.7 quality & jpg extension
        // .convert({ path: document.uri, extension: 'png' }) // png extension
        // .convert({ path: document.uri, extension: 'base64' }) // base64 extension
        .then(this.heicConverterCallback);
    } catch (err) {
      console.log('RNDocumentPicker error', err);
    }
  };

  /**
   * Warning: CameraRoll has been extracted from react-native
   * core and will be removed in a future release. It can now be installed and imported
   * from '@react-native-community/cameraroll' instead of 'react-native'.
   * See https://github.com/react-native-community/react-native-cameraroll
   */
  cameraRollCallback = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(({ edges }) => {
        if (edges.length) {
          /**
           * {image: {uri}}
           * ph://B6012435-97CF-YYYY-XXXX-84EB89555F20/L0/001
           */
          const asset = edges[0].node;
          const isHeicFile =
            asset.image.filename &&
            asset.image.filename.toLowerCase().endsWith('heic');

          if (isHeicFile) {
            RNHeicConverter.convert({ path: asset.image.uri }) // default with quality = 1 & jpg extension
              // .convert({ path: asset.image.uri, quality: 0.7 }) // with 0.7 quality & jpg extension
              // .convert({ path: asset.image.uri, extension: 'png' }) // png extension
              // .convert({ path: asset.image.uri, extension: 'base64' }) // base64 extension
              .then(this.heicConverterCallback);
          }
        }
      })
      .catch(error => {
        // Error Loading Images
        console.log(error);
      });
  };

  /**
   * Pick image from the device library or directly from the camera by RNImagePicker
   * Using https://github.com/react-community/react-native-image-picker
   */
  pickerCallback = response => {
    const { error, uri, origURL } = response;
    if (error) {
      return;
    }

    /** if your format is "High efficiency"
     * check: iPhone > Settings > Formats > High efficiency (HEIC format)
     *
     * origURL {string}
     * Sample: assets-library://asset/asset.HEIC?id=E1B5A58A-XXX1-XXX2-8747-875FFD62F972&ext=HEIC
     **/
    if (origURL && origURL.endsWith('HEIC')) {
      console.log({ origURL });
      RNHeicConverter.convert({ path: origURL }).then(
        this.heicConverterCallback
      );
      return;
    }

    // But you can use JPG string instead of origURL
    if (uri && uri.startsWith('file://')) {
      this.showImage(uri.replace('file://', ''));
    } else if (uri) {
      this.showImage(uri);
    }
  };

  toggleAttachFile = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Upload document',
          'Take photo',
          'Choose HEIC photo from gallery',
          'Camera roll',
          'Cancel',
        ],
        cancelButtonIndex: 4,
      },
      index => {
        switch (index) {
          case 0:
            this.pickDocument();
            break;
          case 1:
            RNImagePicker.launchCamera(pickerOptions, response =>
              this.pickerCallback(response, 'camera')
            );
            break;
          case 2:
            RNImagePicker.launchImageLibrary(pickerOptions, response =>
              this.pickerCallback(response, 'gallery')
            );
            break;
          case 3:
            this.cameraRollCallback();
            break;
          default:
            break;
        }
      }
    );
  };

  render() {
    const { jpgUri } = this.state;

    return (
      <View style={styles.container}>
        {jpgUri ? (
          <Image
            resizeMode="contain"
            style={{ width, height }}
            source={{ uri: jpgUri }}
          />
        ) : (
          <Button
            color="#841584"
            title="Attach file"
            onPress={this.toggleAttachFile}
          />
        )}
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
