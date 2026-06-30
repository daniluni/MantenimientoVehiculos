const Dashboard = {
  init() {
    this.summaryEls = {
      total: document.getElementById('sumTotal'),
      bueno: document.getElementById('sumBueno'),
      atencion: document.getElementById('sumAtencion'),
      critico: document.getElementById('sumCritico'),
    };
    this.alertsEl = document.getElementById('alertsContainer');
    this.matrixBody = document.getElementById('matrixBody');
    this.matrixHeader = document.getElementById('matrixHeader');
  },

  render() {
    const vehiculos = Store.getCollection('vehiculos');
    this._renderSummary(vehiculos);
    this._renderAlerts(vehiculos);
    this._renderMatrix(vehiculos);
  },

  _renderSummary(vehiculos) {
    let totalSistemas = 0;
    let countBueno = 0;
    let countAtencion = 0;
    let countCritico = 0;

    vehiculos.forEach((v) => {
      v.sistemas.forEach((s) => {
        totalSistemas++;
        if (s.estado === 'bueno') countBueno++;
        else if (s.estado === 'atencion') countAtencion++;
        else if (s.estado === 'critico') countCritico++;
      });
    });

    this.summaryEls.total.textContent = vehiculos.length;
    this.summaryEls.bueno.textContent = countBueno;
    this.summaryEls.atencion.textContent = countAtencion;
    this.summaryEls.critico.textContent = countCritico;
  },

  _renderAlerts(vehiculos) {
    const alerts = [];

    vehiculos.forEach((v) => {
      v.sistemas.forEach((s) => {
        if (s.estado === 'critico') {
          alerts.push({ tipo: 'critico', vehiculo: v.nombre, sistema: s.nombre });
        } else if (s.estado === 'atencion') {
          alerts.push({ tipo: 'atencion', vehiculo: v.nombre, sistema: s.nombre });
        }
      });
    });

    if (alerts.length === 0) {
      this.alertsEl.innerHTML = '<div class="alert-item" style="color:var(--status-bueno);background:#e8f8f0">✅ Todos los sistemas en buen estado</div>';
      return;
    }

    this.alertsEl.innerHTML = alerts.slice(0, 10).map((a) => `
      <div class="alert-item alert-item--${a.tipo}">
        ${a.tipo === 'critico' ? '🔴' : '🟡'}
        <strong>${Utils.escapeHtml(a.vehiculo)}</strong> — ${Utils.escapeHtml(a.sistema)}: ${a.tipo === 'critico' ? 'Requiere atención urgente' : 'Próximo a mantenimiento'}
      </div>
    `).join('');

    if (alerts.length > 10) {
      this.alertsEl.innerHTML += `<div class="alert-item" style="color:var(--color-text-secondary)">... y ${alerts.length - 10} más</div>`;
    }
  },

  _renderMatrix(vehiculos) {
    const sistemasNombres = Models.SISTEMAS_POR_DEFECTO;

    this.matrixHeader.innerHTML = `
      <th>Vehículo</th>
      ${sistemasNombres.map((s) => `<th>${s}</th>`).join('')}
    `;

    if (vehiculos.length === 0) {
      this.matrixBody.innerHTML = `
        <tr><td colspan="${sistemasNombres.length + 1}">
          <div class="empty-state"><div class="empty-state__text">Registra vehículos para ver la matriz</div></div>
        </td></tr>
      `;
      return;
    }

    this.matrixBody.innerHTML = vehiculos.map((v) => {
      const sysMap = {};
      v.sistemas.forEach((s) => { sysMap[s.nombre] = s; });

      return `
        <tr>
          <td>
            <strong>${Utils.escapeHtml(v.nombre)}</strong>
            <div style="font-size:0.75rem;color:var(--color-text-secondary)">${v.placa || ''}</div>
          </td>
          ${sistemasNombres.map((sysName) => {
            const sys = sysMap[sysName];
            const estado = sys ? sys.estado : 'na';
            const label = { bueno: '✓', atencion: '!', critico: '✗', na: '—' };
            const title = sys
              ? `${sysName}: ${estado}${sys.ultimaRevision ? ` (Rev: ${Utils.formatDateShort(sys.ultimaRevision)})` : ''}`
              : `${sysName}: Sin datos`;
            return `<td>
              <button class="status-cell status-cell--${estado}" title="${Utils.escapeHtml(title)}" data-matrix-edit="${v.id}" data-matrix-sys="${Utils.escapeHtml(sysName)}">
                ${label[estado]}
              </button>
            </td>`;
          }).join('')}
        </tr>
      `;
    }).join('');

    this.matrixBody.querySelectorAll('[data-matrix-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const veh = Store.getById('vehiculos', btn.dataset.matrixEdit);
        if (veh) Systems.open(veh);
      });
    });
  },
};
