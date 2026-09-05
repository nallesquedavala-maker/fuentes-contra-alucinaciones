# Fuentes contra alucinaciones

Juego móvil para tres equipos y tablero de resultados en tiempo real.

## Publicar en Vercel

1. Crea un proyecto nuevo en Firebase y activa **Realtime Database** en modo bloqueado.
2. Activa **Authentication > Anónimo**.
3. Copia la configuración web del proyecto en `firebase-config.js`, incluyendo `databaseURL`.
4. Copia el contenido de `database.rules.json` en las reglas de Realtime Database y publícalas.
5. Sube esta carpeta a Vercel como un sitio estático.
6. Abre `/tablero` en la computadora que se proyectará. Los equipos usan la página principal.

El código de sesión inicial es `UTEL0905`. Puedes cambiarlo al comenzar el taller. Usa un código poco predecible para cada aplicación real.

## Probar sin Firebase

La aplicación inicia en modo demostración local. Abre la página principal y el tablero en pestañas del mismo navegador; los cambios se sincronizan en ese dispositivo.

## Privacidad

El registro solicita los nombres completos de los integrantes y los asocia con su equipo. Cada dispositivo recibe una identidad anónima temporal y solo puede modificar el expediente que creó. Conviene informar a los participantes sobre este tratamiento de datos y utilizar un código de sesión nuevo en cada evento.
