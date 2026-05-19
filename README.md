# Playlist Manager — Front-end React + TypeScript

## Description du projet

Ce projet est une application de gestion de playlists développée en React avec TypeScript. Elle permet de créer des playlists, d’ajouter et supprimer des morceaux, et de charger une playlist initiale depuis une API iTunes.

L’objectif principal du projet n’est pas uniquement fonctionnel, mais architectural : l’application a été structurée en utilisant plusieurs design patterns afin de séparer les responsabilités, améliorer la maintenabilité et rendre le code plus modulaire.

L’application repose sur une architecture découpée en couches :
- une couche UI (React components)
- une couche logique (Facade)
- une couche de commandes (Command Pattern)
- une couche de communication événementielle (Observer)
- une couche d’accès aux données (Repository)
- une couche de création d’objets (Factory)

---

## Fonctionnalités

- Chargement d’une playlist depuis l’API iTunes
- Création de playlists personnalisées
- Suppression de playlists
- Ajout et suppression de morceaux
- Undo des actions via système de commandes
- Notifications automatiques selon les actions

---

# Design Patterns utilisés

## Command Pattern

Le Command Pattern est utilisé pour encapsuler les actions liées aux modifications des playlists, comme l’ajout ou la suppression de morceaux. Chaque action est transformée en objet commande avec une méthode `execute` et `undo`. Cela permet d’ajouter un système de retour arrière (undo) de manière propre et extensible. Les actions ne sont plus exécutées directement dans les composants mais passent par un gestionnaire de commandes, ce qui découple l’UI de la logique métier.

---

## Observer Pattern

Le Observer Pattern est utilisé pour gérer les notifications dans l’application. Un event bus central permet de diffuser des événements comme la création d’une playlist ou l’ajout d’une chanson. Les composants de notification s’abonnent à ces événements et réagissent automatiquement. Cela permet de découpler totalement les actions métiers de l’affichage des notifications.

---

## Factory Pattern

Le Factory Pattern est utilisé pour la création des objets de notification. Au lieu de créer les notifications directement dans les composants, une factory centralise leur construction en fonction du type (succès, erreur, information). Cela garantit une structure homogène des notifications et facilite leur évolution sans modifier les composants consommateurs.

---

## Repository Pattern

Le Repository Pattern est utilisé pour gérer la persistance des playlists. Toute interaction avec le localStorage est encapsulée dans un repository. Cela permet d’isoler la logique de stockage du reste de l’application et de rendre le code indépendant du support de données utilisé. Si demain le stockage change (API, base de données), seule cette couche devra être modifiée.

---

## Facade Pattern

Le Facade Pattern est utilisé pour simplifier l’accès aux différentes fonctionnalités de gestion des playlists. Au lieu de manipuler directement les commandes, le repository et l’event bus dans les composants, une façade centralise toutes les opérations. Elle fournit une interface simple pour l’UI et masque la complexité interne de l’application.

---

## Conclusion

Ce projet montre comment une application React peut être structurée proprement en séparant les responsabilités grâce aux design patterns. Chaque pattern répond à un problème concret et améliore la lisibilité, la maintenabilité et l’évolutivité du code.