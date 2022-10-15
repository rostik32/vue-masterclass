import { debounce } from 'lodash-es';

const __pageScrollDirective__ = {
  mounted(el, binding) {
    el.__pageScrollHandler__ = debounce(
      () => {
        binding.value();
      },
      200,
      { leading: true }
    );

    document.addEventListener('scroll', el.__pageScrollHandler__);
  },
  unmounted(el) {
    document.removeEventListener('scroll', el.__pageScrollHandler__);
  },
};

export default (app) => {
  app.directive('page-scroll', __pageScrollDirective__);
};
