// Environnement de production (image publiée sur Docker Hub, déployée sur la VM Azure)
// La gateway est servie en https sur son propre sous-domaine par le nginx de la VM
export const environment = {
  gatewayUrl: 'https://api2.valentinduflot.fr',
};
