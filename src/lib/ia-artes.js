// Piloto da geração de artes com IA: só admins e a Érica (adm_at) enxergam.
export const IA_ARTES_USUARIOS = new Set(['gs', 'adm_at'])

export function podeUsarIaArtes(user) {
  return !!user && (user.role === 'admin' || IA_ARTES_USUARIOS.has(String(user.id)))
}
