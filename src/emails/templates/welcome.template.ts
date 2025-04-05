export function welcomeTemplate(name: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>¡Bienvenido, ${name}!</h2>
      <p>Gracias por registrarte en nuestro blog. Esperamos que disfrutes tu experiencia.</p>
      <p>— Blog </p>
    </div>
  `
}
