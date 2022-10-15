const clickOutsideDirective = {
  mounted(el, bindings) {
    el.__clickOutsideHandler__ = (e) => {
      if (!(e.target === el || el.contains(e.target))) {
        bindings.value(e);
      }
    };

    document.body.addEventListener('click', el.__clickOutsideHandler__);
  },

  unmounted(el) {
    document.body.removeEventListener('click', el.__clickOutsideHandler__);
  },
};

export default (app) => {
  app.directive('click-outside', clickOutsideDirective);
};
