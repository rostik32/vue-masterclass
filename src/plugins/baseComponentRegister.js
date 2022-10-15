export default {
  install(app) {
    const components = import.meta.globEager('@/components/common/*.vue');

    Object.entries(components).forEach(([path, definition]) => {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '');

      app.component(componentName, definition.default);
    });
  },
};
