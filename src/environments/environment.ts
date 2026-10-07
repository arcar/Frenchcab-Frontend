// Environnement de production (image publiée sur Docker Hub, déployée sur la VM Azure)
// URL relative : la page est servie en https, le nginx du front redirige /api vers la gateway
export const environment = {
  gatewayUrl: '/api',
};
