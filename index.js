import { NativeModules } from 'react-native';

const { RNHeicConverter } = NativeModules;

const isNumber = n => !isNaN(parseFloat(n));

const isPHAssetsHEIC = path =>
    path && path.toLowerCase().startsWith('ph://');

const isAssetsHEIC = path => {
  const ph = path && path.toLowerCase();
  return ph && ph.startsWith('assets-library://asset/') && ph.endsWith('heic')
}

const alAssetUris = uri => {
  const [, localIdentifier] = uri.match('ph://([^/]+)');
  if (!localIdentifier) {
    console.error(`Unable to find localIdentifier from asset "${uri}"`);
    return uri;
  }
  return `assets-library://asset/asset.HEIC?id=${localIdentifier}&ext=HEIC`;
};

class HEICConverter {
  static convert(params) {
    const { extension, quality, path } = params;
    const options = {
      path: path.startsWith('file://') ? path.replace('file://', '') : path,
      extension: params.extension,
      isAssetsHEIC: isAssetsHEIC(path) || isPHAssetsHEIC(path),
    };

    if (isPHAssetsHEIC(path)) {
      options.path = alAssetUris(path);
    }

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
