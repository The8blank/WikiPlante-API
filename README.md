
# Wikiplante-Api

L'API WikiPlante permet de créer des fiches techniques sur les végétaux et de les stocker dans une base de données SQL. 
La création d'un compte utilisateur est nécessaire pour utiliser l'API WikiPlante.

Le projet est développé en JavaScript, Node.js, et Express.js, avec l'utilisation de Sequelize pour la gestion de la base de données.

## Authentification

L'authentification des utilisateurs est gérée avec JSON Web Token (JWT). Une fois connecté avec votre compte utilisateur, vous recevrez un token qui vous permettra d'accéder aux routes protégées pour le CRUD des plantes.

## Installation

1. Clonez le dépôt depuis GitHub :

 `git clone https://github.com/The8blank/wikiplante-api.git
`

2. Accédez au répertoire du projet : 

`cd wikiplante-api
`

3. Installez les dépendances du projet :

`npm install
`

4. Assurez-vous d'avoir configuré les variables d'environnement nécessaires dans le fichier `.env` à la racine du projet telles que DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, etc. Assurez-vous que ces valeurs sont correctement configurées pour votre environnement de développement.

5. Créez la base de données en utilisant Sequelize CLI avec la commande suivante :
`npx sequelize-cli db:create
`

Cela créera la base de données avec le nom spécifié dans votre configuration Sequelize.

6. Ensuite, vous pouvez effectuer les migrations pour créer les tables dans la base de données en utilisant la commande suivante :


`npx sequelize-cli db:migrate
`

7. Une fois le projet installé et configuré, vous pouvez lancer le serveur en utilisant la commande suivante : 

`npm start
`

## routes

CRUD USER :

    route pour crée un utilisateur :    http://localhost:8080/wikiplante-api/user/inscription          methode: Post
    route pour se connecter :           http://localhost:8080/wikiplante-api/user/connexion             methode: Post
    route pour se deconnecter :         http://localhost:8080/wikiplante-api/user/deconnexion            methode: Get

    route pour avoir tout les utilisateur :       http://localhost:8080/wikiplante-api/user/            methode: Get
    route pour avoir un utilisateur :            http://localhost:8080/wikiplante-api/user:id          methode: Get
    route pour modifier un utilisateur :         http://localhost:8080/wikiplante-api/user:id          methode: Put
    route pour supprimer un utilisateur :        http://localhost:8080/wikiplante-api/user:id          methode: Delete

**_Une fois connecté avec votre compte utilisateur, vous recevrez un token qui vous permetra d'acceder au CRUD plante _**
