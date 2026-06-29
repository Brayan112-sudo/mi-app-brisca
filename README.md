# Ficha de Idea de Producto

**Nombre tentativo de la app:**
Brisca IA – Juega a La Brisca contra la máquina

**Problema que resuelve:**
Los fanáticos de La Brisca no siempre tienen con quién jugar. No existe una app móvil nativa, bien diseñada y en español que permita jugar La Brisca contra una IA en cualquier momento.

**Usuario objetivo (perfil):**
Persona hispanohablante de 20–55 años, familiarizada con juegos de cartas tradicionales, que quiere entretenerse en momentos de ocio (transporte, descanso) sin depender de otros jugadores.

**Jobs-to-be-done:**
1. **Entretenimiento inmediato:** quiero abrir la app y empezar una partida en menos de 30 segundos, sin registros ni configuraciones.
2. **Desafío progresivo:** quiero sentir que la IA me representa un reto real y que puedo mejorar mi nivel de juego con el tiempo.
3. **Nostalgia y familiaridad:** quiero que las cartas y el ambiente visual me recuerden al juego tradicional que aprendí de pequeño.

**Propuesta de valor en 1 oración:**
La forma más rápida y fiel de jugar La Brisca en tu celular, con una IA que se adapta a tu nivel.

**Tipo de app:** Juego – nicho / casual

---

# Backlog Inicial

## Prioridad Alta

# Historia de Usuario

| 1 | Como jugador, quiero ver mis cartas en mano claramente en pantalla para poder elegir cuál jugar.
| 2 | Como jugador, quiero que la IA juegue sus cartas automáticamente después de la mía para que la partida fluya sin interrupciones.
| 3 | Como jugador, quiero ver cuántos puntos llevo yo y cuántos lleva la IA para saber cómo va la partida.
| 4 | Como jugador, quiero ver el palo de triunfo (brisca) en todo momento para tenerlo presente en mi estrategia.
| 5 | Como jugador, quiero que al terminar la partida se muestre un resumen con el resultado (ganaste / perdiste) y los puntos finales.

## Prioridad Media

# Historia de Usuario

| 6 | Como jugador, quiero poder iniciar una nueva partida con un solo botón para jugar otra ronda rápidamente.
| 7 | Como jugador, quiero elegir la dificultad de la IA (fácil / medio / difícil) para ajustar el desafío a mi nivel.
| 8 | Como jugador, quiero ver una animación cuando se gana o pierde una baza para que el juego se sienta más dinámico.
| 11 | Como jugador, quiero ver cuántas cartas quedan en el mazo para calcular cuándo se acaban los robos y ajustar mi estrategia de cierre de partida.
| 12 | Como jugador, quiero recibir una notificación o aviso cuando "canto" (Las 40 / Las 20) para no perder puntos por no darme cuenta.
| 13 | Como jugador, quiero ver estadísticas básicas acumuladas (partidas jugadas, % de victorias, mejor racha) para entender mi progreso general, no solo partida por partida.

## Prioridad Baja

# Historia de Usuario

| 9 | Como jugador, quiero ver un historial de mis últimas partidas para llevar el control de mis victorias y derrotas.
| 10 | Como jugador, quiero poder activar o desactivar el sonido del juego según mi preferencia.
| 14 | Como jugador, quiero elegir entre distintos diseños de mazo (clásico español, retro, moderno) para personalizar la apariencia del juego.
| 15 | Como jugador, quiero poder jugar partidas a distintos puntajes de cierre (ej. a 1 o a varias manos) para variar la duración de la partida.
| 16 | Como jugador, quiero un modo "revancha" que recuerde la dificultad y configuración de la última partida para jugar de nuevo sin reconfigurar todo.
| 17 | Como jugador, quiero compartir el resultado de una partida ganada (captura o texto) para presumir o invitar a amigos a jugar.
| 18 | Como jugador, quiero un breve recordatorio de reglas (cantos, valores de cartas) accesible desde un menú, para consultarlo sin que interrumpa la partida si ya sé jugar.

---

## Formato de entrega
- **Archivo:** `docs/product-idea.md`
- **Repositorio:** `mi-app-brisca` (Git personal)
- **Commit:** antes del inicio de la Semana 2

## Prompt utilizado para generar el backlog
> "Actúa como un product manager senior especializado en juegos móviles casuales. Tengo una app de La Brisca (juego de cartas tradicional español) para 1 jugador vs IA, en plataforma móvil iOS/Android. Por favor: (1) identifica los 5 ítems de backlog de mayor prioridad, (2) sugiere 3 ítems de prioridad media, (3) sugiere 2 ítems de prioridad baja. Usa el formato: 'Como [usuario], quiero [acción]'. Ordena por probabilidad de impacto en la experiencia del jugador."

*Backlog ampliado posteriormente con ítems adicionales (#11–18) para enriquecer la cobertura de mecánicas de juego (cantos, mazo restante, estadísticas), personalización y retención.*

---

# Ideas de Expansión Futura (post-MVP)

Estas ideas no son parte del backlog inicial, pero sirven como visión de hacia dónde podría crecer la app más adelante.

## Progresión y motivación a largo plazo

# Idea

| 19 | Sistema de niveles/rango del jugador (ej. Novato → Experto → Maestro de la Brisca) que sube según victorias y dificultad enfrentada.
| 20 | Logros/medallas por hitos específicos (ej. "Ganar cantando Las 40", "Ganar sin perder ninguna baza", "10 victorias seguidas").
| 21 | Misiones diarias o semanales (ej. "Gana 3 partidas hoy") que fomenten abrir la app todos los días.
| 22 | Curva de dificultad adaptativa: la IA ajusta su nivel de juego según el rendimiento reciente del usuario, sin que él tenga que cambiarlo manualmente.

## Multijugador y social

# Idea

| 23 | Modo multijugador online 1vs1 contra otra persona real (no solo IA), con matchmaking simple.
| 24 | Modo Brisca de 4 jugadores (2vs2) combinando humanos y/o IAs, fiel a cómo se juega tradicionalmente en mesa.
| 25 | Tabla de clasificación (leaderboard) global o entre amigos, para comparar puntos y rango.
| 26 | Invitar amigos por enlace o código para jugar una partida privada juntos.

## Contenido y variantes del juego

# Idea

| 27 | Variantes regionales del juego (Brisca italiana, portuguesa/Sueca) seleccionables desde un menú de reglas.
| 28 | Modo "torneo" contra varias IAs consecutivas con dificultad creciente, como una escalera de retos.
| 29 | Modo práctica/análisis: revisar una partida jugada baza por baza para entender qué decisiones cambiarían el resultado.
| 30 | Mazos temáticos coleccionables (regional, festivo, edición especial) como contenido visual desbloqueable

## Negocio y sostenibilidad de la app

# Idea

| 31 | Modelo freemium: app gratuita con anuncios opcionales, y versión "Pro" sin anuncios con mazos/temas exclusivos.
| 32 | Compras dentro de la app únicamente cosméticas (mazos, tapetes, avatares), sin afectar la jugabilidad ni dar ventajas competitivas.
| 33 | Modo sin conexión (offline) completo para jugar contra la IA sin necesidad de internet, pensado para el caso de uso de transporte/movilidad mencionado en el problema original.

## Accesibilidad y alcance

# Idea

| 34 | Soporte multi-idioma (portugués, italiano, inglés) para abrir la app a comunidades donde también se juegan variantes similares.
| 35 | Modo de accesibilidad visual (cartas con mayor contraste, tamaños ajustables) para jugadores con dificultades de visión.
| 36 | Tutorial interactivo opcional para nuevos usuarios que nunca han jugado Brisca, sin que esto sea obligatorio para quien ya sabe (mencionado como riesgo a evitar en el enfoque competitivo original, pero útil como expansión de audiencia más adelante).

## Personalidad e inteligencia del oponente IA

# Idea

| 37 | Distintos "personajes" de IA con estilo de juego propio (uno agresivo cantando rápido, otro conservador, otro impredecible), más allá de solo fácil/medio/difícil.
| 38 | La IA "habla" o reacciona con frases cortas según el momento de la partida (al cantar, al ganar una baza importante, al perder), para darle más personalidad sin saturar.
| 39 | Modo "espejo": la IA aprende y replica patrones del propio estilo de juego del usuario, como un reto de jugar "contra uno mismo".
| 40 | Explicación post-partida de la IA sobre 1-2 jugadas clave (ej. "Aquí debiste guardar el triunfo"), como complemento al modo análisis ya propuesto.

## Bienestar y juego responsable

# Idea

| 41 | Recordatorio suave de tiempo de juego (ej. "Llevas 1 hora jugando") sin ser intrusivo, pensado especialmente si más adelante se agregan apuestas o dinero virtual.
| 42 | Si se llega a implementar algún sistema de apuestas con fichas virtuales, incluir límites diarios configurables y dejar claro que no hay dinero real involucrado.

## Datos y mejora continua

# Idea

| 43 | Panel interno (no visible al usuario final) para analizar en qué punto de la partida los usuarios abandonan más, y así detectar fricciones de diseño.
| 44 | Recolección anónima de partidas para entrenar/ajustar la dificultad de la IA con datos reales de juego, no solo reglas fijas.
| 45 | Encuesta corta opcional post-partida ("¿Qué tan justa sintió la dificultad?") para calibrar el balance de la IA con feedback directo.

## Pulido de experiencia (detalles que se notan)

# Idea

| 46 | Modo zurdo / espejo de interfaz para jugadores que prefieren la mano de cartas en el lado opuesto.
| 47 | Vibración táctil sutil al jugar una carta o ganar una baza, aprovechando el feedback háptico del celular.
| 48 | Modo "partida rápida" con temporizador por turno opcional, para quienes quieran una sesión más corta y dinámica.
| 49 | Widget de pantalla de inicio (Android/iOS) que muestre la racha actual o invite a jugar la partida del día.
| 50 | Soporte para modo oscuro/claro automático según el sistema del dispositivo.