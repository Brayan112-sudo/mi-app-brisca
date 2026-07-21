# Plan del proyecto: Brisca

## Estructura de archivos que vamos a crear

```
brisca/
├── estructura.md        ← Este archivo (el plan)
├── index.html           ← La página web (el "esqueleto")
├── css/
│   └── style.css        ← Los estilos visuales
└── js/
    ├── cards.js         ← Datos de las cartas y el mazo
    ├── game.js          ← Las reglas del juego
    └── ui.js            ← Lo que el jugador ve en pantalla
```

---

## Para qué sirve cada archivo

### `index.html`
La página principal. Define las secciones que hay en pantalla:
- Cabecera con el marcador de puntos (Tú vs Máquina)
- La mano de la máquina (cartas boca abajo)
- Zona central: el mazo, la carta de triunfo, y las cartas jugadas
- La mano del jugador (boca arriba, se puede hacer clic)
- Una caja de mensajes ("Tu turno", "¡Ganaste la baza!", etc.)
- Una pantalla de inicio y una de fin de partida

### `css/style.css`
Cómo se **ve** la aplicación:
- Fondo verde oscuro (como un tapete)
- El aspecto de las cartas
- El marcador de puntos
- Que se vea bien en pantallas pequeñas

### `js/cards.js`
Los **datos** de la baraja española de 40 cartas:
- Los 4 palos: Oros, Copas, Espadas, Bastos
- Los 10 valores por palo: As(1), 2, 3, 4, 5, 6, 7, Sota(10), Caballo(11), Rey(12)
- Los puntos de cada carta: As=11, 3=10, Rey=4, Caballo=3, Sota=2, resto=0
- La fuerza para ganar bazas: As > 3 > Rey > Caballo > Sota > 7 > 6 > 5 > 4 > 2
- La función para barajar el mazo

### `js/game.js`
Las **reglas y la lógica** del juego:
- Repartir cartas al empezar
- Controlar de quién es el turno
- Decidir quién gana cada baza (aplicando las reglas de la Brisca)
- Sumar puntos al ganador de cada baza
- Robar cartas del mazo tras cada baza
- La estrategia de la máquina (qué carta elige jugar)
- Detectar el fin de la partida y declarar ganador

### `js/ui.js`
Lo que el jugador **ve y toca** en pantalla:
- Mostrar las cartas en mano del jugador (clicables)
- Mostrar las cartas de la máquina (boca abajo)
- Actualizar el marcador
- Mostrar mensajes explicando qué pasó
- Mostrar la pantalla de inicio y de resultado final

---

## Reglas que hay que programar

### ¿Cómo se reparte?
1. Barajar las 40 cartas
2. Dar 3 cartas al jugador
3. Dar 3 cartas a la máquina
4. La siguiente carta se pone **boca arriba** bajo el mazo → ese es el **palo triunfo**
5. Esa carta de triunfo se roba como **última carta** del mazo

### ¿Quién gana una baza?
1. Si una carta es triunfo y la otra no → **gana el triunfo**
2. Si ambas son triunfo → **gana la más fuerte** (As > 3 > Rey...)
3. Si ninguna es triunfo:
   - Si la segunda carta es del **mismo palo** que la primera → gana la más fuerte
   - Si la segunda carta es de **otro palo** → gana siempre la primera (la del líder)

### ¿Cómo se roba tras cada baza?
- El ganador de la baza roba primero
- Ambos roban 1 carta
- Cuando el mazo está vacío, se sigue jugando con las cartas en mano
- Al terminar todas las cartas → fin de la partida

### Puntuación total posible: 120 puntos
(4 palos × [11 + 10 + 4 + 3 + 2])

---

## Flujo de una partida (paso a paso)

```
Jugador pulsa "Nueva Partida"
    ↓
game.js baraja y reparte cartas
    ↓
ui.js muestra las cartas en pantalla
    ↓
El jugador hace clic en una carta  ←─────────────┐
    ↓                                             │
game.js registra la carta jugada                  │
    ↓                                             │
game.js decide qué carta juega la máquina         │
    ↓                                             │
game.js compara las dos cartas → decide ganador   │
    ↓                                             │
game.js suma puntos y ambos roban una carta       │
    ↓                                             │
ui.js actualiza la pantalla                       │
    ↓                                             │
¿Quedan cartas? → Sí ─────────────────────────────┘
    ↓ No
game.js declara al ganador
    ↓
ui.js muestra la pantalla final
```

---

## Notas para recordar mientras construyes

- Los tres archivos `.js` deben cargarse **en orden** en el HTML:
  primero `cards.js`, luego `game.js`, luego `ui.js`.
  Esto es porque `game.js` usa funciones de `cards.js`,
  y `ui.js` usa funciones de ambos.

- Todo el estado del juego (manos, puntos, turno actual) vivirá
  en un objeto llamado `estado` dentro de `game.js`.

- `ui.js` **nunca toma decisiones de juego**: solo lee `estado`
  y lo convierte en HTML visible.

- `game.js` **nunca toca el DOM** directamente: delega en `ui.js`.
