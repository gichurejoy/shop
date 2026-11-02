/**
* Theme: Larkon - Responsive Bootstrap 5 Admin Dashboard
* Module/App: Theme Config Js
*/

(function () {
     var savedConfig = null;
     try {
          savedConfig = localStorage.getItem("__LARKON_CONFIG__") || sessionStorage.getItem("__LARKON_CONFIG__");
     } catch(e) {}

     var html = document.getElementsByTagName("html")[0];

     var defaultConfig = {
          theme: "light",             // ['light', 'dark']

          topbar: {
               color: "light",       // ['light', 'dark']
          },

          menu: {
               size: "sm-hover-active",   // [ 'default', 'sm-hover-active', 'condensed', 'full']
               color: "light",            // ['light', 'dark']
          },
     };

     var config = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), {});

     if (savedConfig !== null) {
          try {
               config = JSON.parse(savedConfig);
          } catch(e) {}
     } else {
          config.theme = html.getAttribute('data-bs-theme') || defaultConfig.theme;
          config.topbar.color = html.getAttribute('data-topbar-color') || defaultConfig.topbar.color;
          config.menu.color = html.getAttribute('data-menu-color') || defaultConfig.menu.color;
          config.menu.size = html.getAttribute('data-menu-size') || defaultConfig.menu.size;
     }

     window.defaultConfig = JSON.parse(JSON.stringify(defaultConfig));
     window.config = config;

     if (config) {
          html.setAttribute("data-bs-theme", config.theme);
          html.setAttribute("data-topbar-color", config.topbar.color || config.theme);
          html.setAttribute("data-menu-color", config.menu.color || config.theme);

          if (window.innerWidth <= 1140) {
               html.setAttribute("data-menu-size", "hidden");
          } else {
               html.setAttribute("data-menu-size", config.menu.size || "sm-hover-active");
          }
     }
})();
