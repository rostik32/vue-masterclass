import { defineRule, configure } from 'vee-validate';
import { required, min, email, size } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

export default () => {
  defineRule('required', required);
  defineRule('min', min);
  defineRule('email', email);
  defineRule('size', size);

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} is required field',
        min: '{field} must be 0:{min} characters long',
        email: '{field} must be email',
        size: 'Image weight must be less than 0:{size} kbs',
      },

      names: {
        email: 'Email',
        password: 'Password',
        name: 'Name',
        username: 'Username',
        avatar: 'Avatar',
      },
    }),
  });
};
