import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

const defaults = {
  position: 'top-right',
  effect: 'scale',
  timeout: 3500,
  offset: 45,
};

export { Alert };

export const success = (message: string, options = {}) => {
  Alert.success(message, Object.assign(defaults, options));
};

export const info = (message: string, options = {}) => {
  Alert.info(message, Object.assign(defaults, options));
};

export const warning = (message: string, options = {}) => {
  Alert.warning(message, Object.assign(defaults, options));
};

export const error = (message: string, options = {}) => {
  Alert.error(message, Object.assign(defaults, options));
};
