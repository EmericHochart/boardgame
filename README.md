# Boardgame
Créer un jeu de plateau tour par tour en JS

Projet dans le cadre de la formation Développeur Front End d'OpenClassrooms

----
## Enoncé
Vous avez jusqu'ici développé des petites applications JavaScript. Il faut maintenant vous lancer dans la création d'un projet plus complet, plus solide... bref plus costaud. ;)

Ce projet consistera à créer un jeu en ligne en JavaScript dans lequel 2 joueurs évoluent chacun leur tour pour s'affronter. Comme dans Highlander, il ne peut en rester qu'un !


![Aperçu du jeu navigateur au tour par tour](https://sdz-upload.s3.amazonaws.com/prod/upload/apercu15.png)

### Etape 1 : génération de la carte
Commencez par générer aléatoirement la carte du jeu. Chaque case peut être soit :

* Vide
* Inaccessible (grisée)

Sur la carte, un nombre limité d’armes (4 maximum) sera placé aléatoirement et pourra être récolté par les joueurs qui passeraient dessus.

Vous inventerez au moins 4 types d’arme dans le jeu, avec des dégâts différents. L’arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts. Chaque arme a un nom et un visuel associé.

Le placement des deux joueurs est lui aussi aléatoire sur la carte au chargement de la partie. 
Ils ne doivent pas se toucher (ils ne peuvent pas être côte à côte).

### Etape 2 : les mouvements

A chaque tour, un joueur peut se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour. 
Il ne peut évidemment pas passer à travers un obstacle.

Si un joueur passe sur une case contenant une arme, il laisse son arme actuelle sur place et la remplace par la nouvelle.

### Etape 3 : le combat !

Si les joueurs se croisent sur des cases adjacentes (horizontalement ou verticalement), un combat à mort s’engage.

Lors d'un combat, le fonctionnement du jeu est le suivant :

* Chacun attaque à son tour
* Les dégâts infligés dépendent de l’arme possédée par le joueur
* Le joueur peut choisir d’attaquer ou de se défendre contre le prochain coup
* Lorsque le joueur se défend, il encaisse 50% de dégâts en moins qu’en temps normal
* Dès que les points de vie d’un joueur (initialement à 100) tombent à 0 , celui-ci a perdu. Un message s’affiche et la partie est terminée.

----
## Compétences évaluées

1. Concevoir une architecture d'application JavaScript réutilisable
2. Développer une application JavaScript orientée objet
3. Mettre en oeuvre la bibliothèque jQuery dans une application web

----
## Technologies

Les versions utilisées dans ce projet seront décrites dans cette section :

* Javascript
* [jQuery 3.3.1](https://jquery.com/)
* [jQuery UI 1.12.1](https://jqueryui.com/)
* JSON
* CSS 3
* HTML 5
* [Material Design for Bootstrap](https://mdbootstrap.com/)

----
## Documentation

### Quick Game 

* [Tutoriel Vidéo - 5 min Quick Start]()

### Custom Game

La section configuration vous permet de modifier certains paramètres du jeu.

* le nombre de lignes du plateau [5 à 12]
* le nombre de colonnes du plateau [5 à 12]
* la taille des cases [32 à 64]
* le pourcentage d'obstacles [0 à 45]
* le nombre d'armes [0 à 10]
* l'environnement du jeu [Médiéval, Forestier, Désertique, Marécageux]
* le nombre de joueurs [2 à 4]

### Créer son environnement personnalisé

Il est possible d'ajouter vos propres mondes à Boardgame.
Vous pouvez ainsi créer un environnement avec vos propres armes et personnages, ainsi qu'un terrain de jeu personnalisé.
Pour cela ,suivez ce [Guide - Pas à Pas pour créer son monde](). 

----
## Ressources

### Cours

* [Apprenez à coder avec JavaScript](https://openclassrooms.com/fr/courses/2984401-apprenez-a-coder-avec-javascript)
* [Créez des pages web interactives avec JavaScript](https://openclassrooms.com/fr/courses/3306901-creez-des-pages-web-interactives-avec-javascript)
* [Simplifiez vos développements JavaScript avec jQuery](https://openclassrooms.com/fr/courses/1631636-simplifiez-vos-developpements-javascript-avec-jquery)
* [Les bases de JavaScript, orienté objet|MDN Web Docs by Moz://a](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Basics)

### Vidéos

* ["5 min Quick Start" tutoriel]()

### Images

* [Free Assets For Everyone by gameart2d.com](https://www.gameart2d.com/freebies.html)
* [Photo by Ricardo Cruz on Unsplash](https://unsplash.com/photos/DCqvWkXF74Q)
* [Photo by Denise Jans on Unsplash](https://unsplash.com/photos/4UZBd5Zw56U)
* [Tiles](https://inscope.itch.io/)
* [Fantasy Icon Pack by Ravenmore](https://ravenmore.itch.io/fantasy-icon-pack)
* [Free 2D Knight Sprite Sheets](https://free-game-assets.itch.io/free-2d-knight-sprite-sheets)
* [Fantasy Heroes: Character Sprite Sheet](https://ragewortt.itch.io/fantasy-heroes-character-sprites)
* [Fantasy Heroes: Samurai Sprite Sheet](https://ragewortt.itch.io/fantasy-heroes-samurai-sprite-sheet)
* [Free 2D Woman Warrior Sprite Sheets](https://free-game-assets.itch.io/free-2d-woman-warrior-sprite-sheets)
* [Fantasy Heroes: Vikings Sprite Sheet](https://ragewortt.itch.io/fantasy-heroes-vikings-sprite-sheet)
* [Treasure chest](https://pngtree.com/freepng/treasure-chest_3450007.html)
* [Fist Free Vector and PNG](https://pngtree.com/freepng/fist_669076.html)
* [Free Game Icons Daggers](https://free-game-assets.itch.io/free-game-icons-daggers)
* [Cartoon Texture Pack](https://slurpcanon.itch.io/cartoon-texture-pack)
* [Free 2D Orcs Sprite Sheets](https://free-game-assets.itch.io/free-2d-orcs-sprite-sheets)

### Sons et musiques

* Pas de sons ni musiques actuellement

----
## TODO

* Code
    * Documentation détaillée
    * Optimisation
* Site
    * Responsive Design (Amélioration du site sur les autres supports tablette et mobile)
    * Ajouter des animations
    * Ajouter un environnement sonore
    * Créer un background éditorial (histoire des personnages, phrases durant le combat, etc...)
* Fonctionnalités
    * Intelligence Artificielle à implémenter
    * Rendre dynamique le formulaire de configuration en fonction de l'environnement, du Json ou du nombre de joueurs...
    * Permettre plusieurs sauvegardes
    * Système d'inventaire et d'autres items