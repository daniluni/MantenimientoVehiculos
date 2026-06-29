const Vehicles = {
  _editingId: null,

  init() {
    this.overlay = document.getElementById('vehicleOverlay');
    this.form = document.getElementById('vehicleForm');
    this.titleEl = document.getElementById('vehicleFormTitle');
    this.submitBtn = document.getElementById('vehicleFormSubmit');

    document.getElementById('btnNuevoVehiculo').addEventListener('click', () => this.open());
    document.getElementById('vehicleFormCancel').addEventListener('click', () => this.close());
    document.getElementById('vehicleFormCancel2').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._save();
    });
  },

  open(vehiculo) {
    this._editingId = vehiculo ? vehiculo.id : null;
    this.titleEl.textContent = vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo';
    this.submitBtn.textContent = vehiculo ? 'Guardar Cambios' : 'Agregar';

    document.getElementById('vehNombre').value = vehiculo ? vehiculo.nombre : '';
    document.getElementById('vehPlaca').value = vehiculo ? vehiculo.placa : '';
    document.getElementById('vehMarca').value = vehiculo ? vehiculo.marca : '';
    document.getElementById('vehModelo').value = vehiculo ? vehiculo.modelo : '';
    document.getElementById('vehAnio').value = vehiculo ? vehiculo.anio : '';

    this.overlay.classList.add('modal-overlay--open');
    document.getElementById('vehNombre').focus();
  },

  close() {
    this.overlay.classList.remove('modal-overlay--open');
    this._editingId = null;
    this.form.reset();
  },

  _save() {
    const nombre = document.getElementById('vehNombre').value.trim();
    const placa = document.getElementById('vehPlaca').value.trim();
    const marca = document.getElementById('vehMarca').value.trim();
    const modelo = document.getElementById('vehModelo').value.trim();
    const anio = document.getElementById('vehAnio').value;

    if (!nombre) { alert('El nombre del vehículo es obligatorio.'); return; }

    if (this._editingId) {
      Store.updateInCollection('vehiculos', this._editingId, { nombre, placa, marca, modelo, anio });
    } else {
      Store.addToCollection('vehiculos', Models.crearVehiculo({ nombre, placa, marca, modelo, anio }));
    }

    this.close();
    document.dispatchEvent(new CustomEvent('data:change'));
  },

  render() {
    const container = document.getElementById('vehiclesList');
    const vehiculos = Store.getCollection('vehiculos');

    if (vehiculos.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🚗</div><div class="empty-state__text">No hay vehículos registrados</div></div>';
      return;
    }

    container.innerHTML = vehiculos.map((v) => {
      const critCount = v.sistemas.filter((s) => s.estado === 'critico').length;
      const atenCount = v.sistemas.filter((s) => s.estado === 'atencion').length;
      return `
        <div class="vehicle-card">
          <div class="vehicle-card__title">${Utils.escapeHtml(v.nombre)}</div>
          <div class="vehicle-card__plate">${Utils.escapeHtml(v.placa || 'Sin placa')}</div>
          <div class="vehicle-card__details">
            <div><span class="vehicle-card__detail-label">Marca:</span> ${Utils.escapeHtml(v.marca || '—')}</div>
            <div><span class="vehicle-card__detail-label">Modelo:</span> ${Utils.escapeHtml(v.modelo || '—')}</div>
            <div><span class="vehicle-card__detail-label">Año:</span> ${Utils.escapeHtml(v.anio || '—')}</div>
            <div style="display:flex;gap:var(--space-sm);align-items:center">
              ${critCount > 0 ? `<span style="color:var(--status-critico);font-weight:600">🔴 ${critCount} crítico${critCount > 1 ? 's' : ''}</span>` : ''}
              ${atenCount > 0 ? `<span style="color:var(--status-atencion);font-weight:600">🟡 ${atenCount} atención</span>` : ''}
            </div>
          </div>
          <div class="vehicle-card__actions">
            <button class="btn btn--sm btn--primary" data-veh-systems="${v.id}">🔧 Sistemas</button>
            <button class="btn btn--sm btn--secondary" data-veh-edit="${v.id}">Editar</button>
            <button class="btn btn--sm btn--danger" data-veh-delete="${v.id}">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-veh-systems]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const veh = Store.getById('vehiculos', btn.dataset.vehSystems);
        if (veh) Systems.open(veh);
      });
    });
    container.querySelectorAll('[data-veh-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const veh = Store.getById('vehiculos', btn.dataset.vehEdit);
        if (veh) this.open(veh);
      });
    });
    container.querySelectorAll('[data-veh-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('¿Eliminar este vehículo y todos sus registros?')) {
          Store.removeFromCollection('vehiculos', btn.dataset.vehDelete);
          document.dispatchEvent(new CustomEvent('data:change'));
        }
      });
    });
  },
};
