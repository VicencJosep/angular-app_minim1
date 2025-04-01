# AngularApp
#Implementació:
- L' exercici era fer un historial de canvis, en el cas del nostre projecte he implementat que quan canvies de propietari de paquet l'historial s'actulitzi amb la data en la que s'ha fet el canvi, el nom del nou usuari al que s'ha asignat el paquet, la llista d'antics "destinataris" del paquet i l'objecte del paquet que estem canviant d'usuari.
- A més a més, he creat un nou component al qual pots accedir quan clickes en el botó "Historial" i que ensenya per pantalla els diferents historials que hi ha a la api.
#Coses a millorar:
-Quan envió a la API la llista de usuaris antics, puc veure en la consola del navegadro com les credentials s'envien en el format correccte, tot i això, l'atribut de user_antiguos[] sempre surt buit en la base de dades. Sospito que es un error relacionat amb que el format de les dades en el backend no es el mateix que com les envío en el forntend.

   
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
