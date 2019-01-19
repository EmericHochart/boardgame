# Boardgame
Créer un jeu de plateau tour par tour en JS
## Enoncé
Vous avez jusqu'ici développé des petites applications JavaScript. Il faut maintenant vous lancer dans la création d'un projet plus complet, plus solide... bref plus costaud. ;)

Ce projet consistera à créer un jeu en ligne en JavaScript dans lequel 2 joueurs évoluent chacun leur tour pour s'affronter. Comme dans Highlander, il ne peut en rester qu'un !

### Etape 1 : génération de la carte
Commencez par générer aléatoirement la carte du jeu. Chaque case peut être soit :

* Vide
* Inaccessible (grisée)

Sur la carte, un nombre limité d’armes (4 maximum) sera placé aléatoirement et pourra être récolté par les joueurs qui passeraient dessus.

Vous inventerez au moins 4 types d’arme dans le jeu, avec des dégâts différents. L’arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts. Chaque arme a un nom et un visuel associé.

Le placement des deux joueurs est lui aussi aléatoire sur la carte au chargement de la partie. 
Ils ne doivent pas se toucher (ils ne peuvent pas être côte à côte).
