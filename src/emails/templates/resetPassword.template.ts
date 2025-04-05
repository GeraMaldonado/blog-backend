export function resetPasswordTemplate(link: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Recuperación de contraseña</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña. Puedes hacerlo haciendo clic en el siguiente enlace:</p>
      <a href="${link}" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
      <p>Si tú no solicitaste esto, puedes ignorar este mensaje.</p>
      <p>— El equipo de Tu Blog</p>
    </div>
  `
}
