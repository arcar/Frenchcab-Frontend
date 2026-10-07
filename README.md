# Frenchcab-Compose!

## Contexte 
Vous intégrez une équipe chargée de développer, sur cinq semaines, une application exploitant les données réelles des taxis de New York publiées par la NYC Taxi & Limousine Commission (TLC).

## Structuration du projet
Projet avec **4 repos** `Github`
```
Frenchcab-compose
-> Frenchcab-Backend + Frenchcab-Frontend + Frenchcab-Gateway
```
Le dossier `Frenchcab-compose` contient les autres dossiers du projet (`Frenchcab-Backend`, `Frenchcab-Frontend`, `Frenchcab-Gateway`) il est là pour orchetrer tous le projet.

## Installation 

### 1. Github

1. Cloner les autres repos dans le dossier `Frenchcab-compose` :
- `Frenchcab-Frontend` :
```powershell
https://github.com/arcar/Frenchcab-Frontend.git
```
Demander l'accès en tant que membre à `mmorkos-cyber`, puis lire le `contributing`.

2. Secrets **Github**
Dans ce repo ont été ajouté des secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`), afin de pouvoir lancer le `workflows`.

3. `.github`
Dans `Frenchcab-Frontend` a été créé un dossier `.github` qui contient le `workflows` avec un fichier `ci.yml`.
Le fichier `ci.yml` lance les tests sur chaque `push` et pull request vers `dev`, puis `docker build` et `docker push` uniquement sur un `push` sur `dev`.

### 2. VM

1. Pour accéder à la VM :
```bash
ssh -i ~/Downloads/myKey.pem groupe2@{numéro api dans VM-linux.txt}
```
Il existe 4 utilisateurs crées (`utilisateur1`, `utilisateur2`, `utilisateur3`, `utilisateur4`). Chacun a un mot de passe qui se trouve dans le fichier text `VM-linux.txt`.

2. `deploy.sh`
Dans la VM a été crée un fichier `deploy.sh` qui avec `cron` se déclenche à intervalle de ....... pour faire un `docker pull` et un `docker up`.

### 3. Docker

Le Frontend a été dockerisé.

Les images docker sont sur **Dockerhub**, et s'active via le fichier `ci.yml` dans ce repo, il suffit donc de faire un `push` (ou de merger une pull request) sur la branche `dev`.

Ainsi pour le lancer la première fois et récupérer l'image, il vous faudra faire un push sur `dev`.

### 4. Frontend S1

Angular a été intialisé, deux components ont été ajouté (`taxi-rides` et `service`).
- `taxi-rides` affiche le tableau avec deux boutons (précédent et suivant), pour le moment il n'y a pas d'affichage des données dans celu-ci ni CSS.
- `service` a été crée pour récupérer l'API du backend pour pouvoir affiché par la suite les données. Il n'est pas oppérationnel à ce jour.
