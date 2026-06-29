const Models = {
  SISTEMAS_POR_DEFECTO: [
    'Combustible',
    'Aceite',
    'Frenos',
    'Neumáticos',
    'Batería',
    'Transmisión',
    'Suspensión',
    'Luces',
    'Aire Acondicionado',
    'Refrigerante',
    'Correa Distribución',
    'Filtros',
  ],

  PRESET_VEHICULOS: [
    {
      nombre: 'Toyota Hilux 2020',
      placa: 'GH-4521',
      marca: 'Toyota',
      modelo: 'Hilux',
      anio: 2020,
      sistemas: [
        { nombre: 'Combustible', estado: 'bueno', ultimaRevision: '2026-05-15', notas: '' },
        { nombre: 'Aceite', estado: 'bueno', ultimaRevision: '2026-06-01', notas: 'Cambio realizado' },
        { nombre: 'Frenos', estado: 'atencion', ultimaRevision: '2026-04-20', notas: 'Pastillas al 40%' },
        { nombre: 'Neumáticos', estado: 'bueno', ultimaRevision: '2026-03-10', notas: 'Rotación realizada' },
        { nombre: 'Batería', estado: 'bueno', ultimaRevision: '2026-01-15', notas: '' },
        { nombre: 'Transmisión', estado: 'bueno', ultimaRevision: '2025-12-01', notas: '' },
        { nombre: 'Suspensión', estado: 'bueno', ultimaRevision: '2026-02-20', notas: '' },
        { nombre: 'Luces', estado: 'bueno', ultimaRevision: '2026-05-10', notas: '' },
        { nombre: 'Aire Acondicionado', estado: 'critico', ultimaRevision: '2026-04-01', notas: 'No enfría, revisar compresor' },
        { nombre: 'Refrigerante', estado: 'bueno', ultimaRevision: '2026-06-01', notas: 'Nivel OK' },
        { nombre: 'Correa Distribución', estado: 'atencion', ultimaRevision: '2025-11-20', notas: 'Próximo cambio a los 100.000 km' },
        { nombre: 'Filtros', estado: 'bueno', ultimaRevision: '2026-06-01', notas: 'Filtro de aire cambiado' },
      ],
    },
    {
      nombre: 'Ford Transit 2022',
      placa: 'KT-7890',
      marca: 'Ford',
      modelo: 'Transit',
      anio: 2022,
      sistemas: [
        { nombre: 'Combustible', estado: 'bueno', ultimaRevision: '2026-05-20', notas: '' },
        { nombre: 'Aceite', estado: 'critico', ultimaRevision: '2026-03-15', notas: 'Vence en 200 km, cambiar urgente' },
        { nombre: 'Frenos', estado: 'bueno', ultimaRevision: '2026-04-10', notas: '' },
        { nombre: 'Neumáticos', estado: 'bueno', ultimaRevision: '2026-05-01', notas: 'Presión correcta' },
        { nombre: 'Batería', estado: 'bueno', ultimaRevision: '2026-02-10', notas: '' },
        { nombre: 'Transmisión', estado: 'atencion', ultimaRevision: '2026-04-25', notas: 'Leve fugas, monitorear' },
        { nombre: 'Suspensión', estado: 'bueno', ultimaRevision: '2026-01-15', notas: '' },
        { nombre: 'Luces', estado: 'bueno', ultimaRevision: '2026-05-10', notas: '' },
        { nombre: 'Aire Acondicionado', estado: 'bueno', ultimaRevision: '2025-12-20', notas: 'Mantenimiento preventivo' },
        { nombre: 'Refrigerante', estado: 'bueno', ultimaRevision: '2026-04-01', notas: '' },
        { nombre: 'Correa Distribución', estado: 'bueno', ultimaRevision: '2026-01-20', notas: 'En buen estado' },
        { nombre: 'Filtros', estado: 'bueno', ultimaRevision: '2026-05-01', notas: '' },
      ],
    },
  ],

  initDefaults() {
    if (!Store.get('vehiculos')) {
      Store.set('vehiculos', this.PRESET_VEHICULOS.map((v) => this.crearVehiculo(v)));
    }
  },

  crearVehiculo(data) {
    const sistemas = data.sistemas
      ? data.sistemas
      : this.SISTEMAS_POR_DEFECTO.map((nombre) => ({
          nombre,
          estado: 'bueno',
          ultimaRevision: '',
          notas: '',
        }));

    return {
      id: Utils.uuid(),
      nombre: data.nombre.trim(),
      placa: (data.placa || '').trim().toUpperCase(),
      marca: (data.marca || '').trim(),
      modelo: (data.modelo || '').trim(),
      anio: data.anio || '',
      sistemas,
      fechaCreacion: Utils.getNowISO(),
    };
  },
};
