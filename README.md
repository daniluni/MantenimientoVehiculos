# MantenimientoVehiculos — Documento de Planeación

## 1. Descripción

Aplicación web SPA para que una empresa gestione el estado de mantenimiento de sus vehículos. Permite registrar vehículos, monitorear el estado de 12 sistemas clave (combustible, aceite, frenos, etc.) y visualizar una matriz de estado general para el gerente. Desarrollada con HTML5, CSS3 vanilla y JavaScript. Datos persistidos en localStorage.

## 2. Estructura del proyecto

```
/MantenimientoVehiculos/
  index.html          # Shell SPA
  plan.md             # Documento de planeación
  css/
    reset.css         # Normalización de estilos
    variables.css     # CSS custom properties
    layout.css        # Header, tabs, dashboard matrix, vehicles grid
    components.css    # Botones, cards, modales, formularios, status indicators
    responsive.css    # Media queries, dark mode, print
  js/
    app.js            # Inicialización, navegación, eventos globales
    store.js          # Capa de persistencia (localStorage)
    models.js         # Fábrica de vehículos + 12 sistemas por defecto
    dashboard.js      # Dashboard gerencial: resumen, alertas, matriz visual
    vehicles.js       # CRUD de vehículos
    systems.js        # Edición de estado de sistemas por vehículo
    utils.js          # UUID, formato fechas, escape HTML
```

## 3. Modelo de datos

### Vehículo (`localStorage.vehiculos`)

```json
{
  "id": "uuid",
  "nombre": "string",
  "placa": "string",
  "marca": "string",
  "modelo": "string",
  "anio": "number",
  "sistemas": [
    {
      "nombre": "Combustible",
      "estado": "bueno | atencion | critico",
      "ultimaRevision": "YYYY-MM-DD",
      "notas": "string"
    }
  ],
  "fechaCreacion": "ISO 8601"
}
```

### Sistemas por defecto (12)

| Sistema | Descripción |
|---------|-------------|
| Combustible | Nivel y estado del sistema de combustible |
| Aceite | Nivel y calidad del aceite del motor |
| Frenos | Estado de pastillas, discos y líquido |
| Neumáticos | Presión y desgaste de llantas |
| Batería | Carga y bornes de la batería |
| Transmisión | Estado de la transmisión |
| Suspensión | Amortiguadores y muelles |
| Luces | Funcionamiento de luces |
| Aire Acondicionado | Sistema de climatización |
| Refrigerante | Nivel del refrigerante |
| Correa Distribución | Estado de la correa |
| Filtros | Filtros de aceite, aire, combustible |

## 4. Funcionalidades (Historias de Usuario)

| ID | Historia |
|----|----------|
| HU01 | Como gerente, quiero registrar vehículos con nombre, placa, marca, modelo y año |
| HU02 | Como gerente, quiero ver el dashboard con resumen de sistemas (buenos/en atención/críticos) |
| HU03 | Como gerente, quiero ver alertas de sistemas en estado crítico o por mantenerse |
| HU04 | Como gerente, quiero ver una matriz visual (vehículos × sistemas) con colores verde/amarillo/rojo |
| HU05 | Como gerente, quiero hacer clic en una celda de la matriz para editar el estado del sistema |
| HU06 | Como gerente, quiero editar el estado de cada sistema (bueno, atención, crítico) con fecha de revisión y notas |
| HU07 | Como gerente, quiero editar y eliminar vehículos |
| HU08 | Los datos persisten al recargar la página |
| HU09 | Interfaz responsive adaptable a cualquier dispositivo |

## 5. Estados y colores

| Estado | Color | Significado |
|--------|-------|-------------|
| Bueno | `#27ae60` | Funcionando correctamente |
| Atención | `#f39c12` | Próximo a mantenimiento |
| Crítico | `#e74c3c` | Requiere atención urgente |

## 6. Vistas

- **Dashboard (Matriz Gerencial)**: Cards de resumen (4 indicadores) + alertas + matriz de calor vehículos × sistemas con celdas cliqueables de colores
- **Vehículos**: Grid de tarjetas con info del vehículo, resumen de sistemas críticos, botones para editar sistemas, editar vehículo y eliminar
- **Modal Sistemas**: Lista de todos los sistemas del vehículo con su estado, al hacer clic en uno se despliega formulario para editar estado, fecha de revisión y notas

## 7. Diseño UI

- Paleta: Header `#1a1a2e`, fondo `#f0f2f5`, accent `#0f3460`
- Matriz: Celdas cuadradas con colores de estado, hover con zoom
- Alertas: Filas con íconos y colores de fondo suaves
- Responsive: Grid adaptable, tabla con scroll horizontal
- Dark mode: Soporte automático
