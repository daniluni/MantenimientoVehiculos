const Systems = {
  _currentVehiculo: null,
  _editingSistemaIdx: null,

  init() {
    this.overlay = document.getElementById('systemsOverlay');
    this.form = document.getElementById('systemForm');
    this.titleEl = document.getElementById('systemsFormTitle');

    document.getElementById('systemsCancel').addEventListener('click', () => this.close());
    document.getElementById('systemsCancel2').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._saveSystem();
    });

    document.querySelectorAll('.status-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.status-option').forEach((o) => o.classList.remove('status-option--active'));
        opt.classList.add('status-option--active');
      });
    });
  },

  open(vehiculo) {
    this._currentVehiculo = vehiculo;
    this._editingSistemaIdx = null;
    this.titleEl.textContent = `Sistemas: ${Utils.escapeHtml(vehiculo.nombre)}`;
    this._renderSystems();
    this.overlay.classList.add('modal-overlay--open');
  },

  close() {
    this.overlay.classList.remove('modal-overlay--open');
    this._currentVehiculo = null;
    this._editingSistemaIdx = null;
    this.form.style.display = 'none';
  },

  _renderSystems() {
    if (!this._currentVehiculo) return;
    const container = document.getElementById('systemsList');
    const vehiculo = Store.getById('vehiculos', this._currentVehiculo.id);
    if (!vehiculo) { this.close(); return; }

    this._currentVehiculo = vehiculo;

    container.innerHTML = vehiculo.sistemas.map((s, idx) => {
      const statusClass = `system-dot--${s.estado || 'na'}`;
      const estadoLabel = { bueno: 'Bueno', atencion: 'Atención', critico: 'Crítico' };
      return `
        <div class="config-item" style="cursor:pointer" data-sys-edit="${idx}">
          <span class="system-dot ${statusClass}"></span>
          <div class="config-item__info">
            <div class="config-item__name">${Utils.escapeHtml(s.nombre)}</div>
            <div class="config-item__meta">
              ${estadoLabel[s.estado] || 'Sin estado'}
              ${s.ultimaRevision ? ` · Últ. revisión: ${Utils.formatDateShort(s.ultimaRevision)}` : ' · Sin revisión'}
              ${s.notas ? ` · ${Utils.escapeHtml(s.notas)}` : ''}
            </div>
          </div>
          <div class="config-item__actions">
            <button class="btn btn--sm btn--secondary" data-sys-edit="${idx}">Editar</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-sys-edit]').forEach((btn) => {
      btn.addEventListener('click', () => this._editSystem(parseInt(btn.dataset.sysEdit)));
    });
  },

  _editSystem(idx) {
    if (!this._currentVehiculo) return;
    const sistema = this._currentVehiculo.sistemas[idx];
    if (!sistema) return;

    this._editingSistemaIdx = idx;
    this.form.style.display = 'block';

    document.getElementById('sysNombreLabel').textContent = sistema.nombre;

    document.querySelectorAll('.status-option').forEach((o) => {
      o.classList.toggle('status-option--active', o.dataset.estado === sistema.estado);
    });

    document.getElementById('sysUltimaRevision').value = sistema.ultimaRevision || '';
    document.getElementById('sysNotas').value = sistema.notas || '';
  },

  _saveSystem() {
    if (this._editingSistemaIdx === null || !this._currentVehiculo) return;

    const activeOption = document.querySelector('.status-option--active');
    const estado = activeOption ? activeOption.dataset.estado : 'bueno';
    const ultimaRevision = document.getElementById('sysUltimaRevision').value;
    const notas = document.getElementById('sysNotas').value.trim();

    const vehiculo = Store.getById('vehiculos', this._currentVehiculo.id);
    if (!vehiculo) return;

    vehiculo.sistemas[this._editingSistemaIdx] = {
      ...vehiculo.sistemas[this._editingSistemaIdx],
      estado,
      ultimaRevision,
      notas,
    };

    Store.updateInCollection('vehiculos', vehiculo.id, { sistemas: vehiculo.sistemas });
    this._currentVehiculo = vehiculo;

    this._editingSistemaIdx = null;
    this.form.style.display = 'none';
    this._renderSystems();
    document.dispatchEvent(new CustomEvent('data:change'));
  },
};
