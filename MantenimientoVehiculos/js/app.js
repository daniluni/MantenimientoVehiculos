(function () {
  'use strict';

  function init() {
    Models.initDefaults();

    setupNavigation();

    Dashboard.init();
    Vehicles.init();
    Systems.init();

    refreshAll();
  }

  function setupNavigation() {
    document.querySelectorAll('.app-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.app-tab').forEach((t) => t.classList.remove('app-tab--active'));
        tab.classList.add('app-tab--active');

        document.querySelectorAll('.app-view').forEach((v) => v.classList.remove('app-view--active'));
        const target = document.getElementById(tab.dataset.view);
        if (target) target.classList.add('app-view--active');

        if (tab.dataset.view === 'viewVehicles') {
          Vehicles.render();
        }
      });
    });
  }

  function refreshAll() {
    Dashboard.render();
    if (document.getElementById('viewVehicles').classList.contains('app-view--active')) {
      Vehicles.render();
    }
  }

  document.addEventListener('data:change', () => {
    refreshAll();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
