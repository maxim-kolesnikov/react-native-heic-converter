import { NativeModules } from 'react-native';

const { RNHeicConverter } = NativeModules;

const isNumber = n => !isNaN(parseFloat(n));

class HEICConverter {
  static convert(params) {
    const { extension, quality, path, filename } = params;
    if (path.startsWith('file://')) {
      path = path.replace('file://', '');
    } elseif (path.startsWith('ph://')) {
      path = path.replace('ph://', '');
    }

    const options = {
      path,
      extension,
      isAssetsHEIC: path && path.toLowerCase().startsWith('assets-library://asset/')
        && path.toLowerCase().endsWith('heic'),
      isPH: param.path && param.path.toLowerCase().startsWith('ph://')
      	&& filename && filename.toLowerCase().endsWith('heic'),
    };

    switch (extension) {
      case 'png':
        options.extensionType = 1;
        break;
      case 'base64':
        options.extensionType = 2;
        break;
      default:
        options.extensionType = 0;
        options.extension = 'jpg';
    }

    if (quality && isNumber(quality) && quality <= 1) {
      options.quality = quality;
    } else {
      options.quality = 1;
    }

    return RNHeicConverter
      .convert(options)
      .then(result => (result));
  }
}

export default HEICConverter;
