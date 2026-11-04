// Aplica el tema guardado (o el del sistema) antes de que React pinte la página, para evitar
// el parpadeo de tema claro. Es un archivo externo (no inline) para poder usar una
// Content-Security-Policy estricta (script-src 'self') en Nginx.
;(function () {
  try {
    var theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  } catch (e) {
    // localStorage puede no estar disponible (modo privado): se usa el tema claro
  }
})()
