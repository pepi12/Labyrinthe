import React from 'react';
import Graph from "react-graph-vis";
/*
    Auteur : Bastien Boulanger
    DA : 1838295
    Nom : AffichageGraph
    Description : S'occupe de l'affichage du labyrinthe. La case bleu est le départ, et la case rouge est la fin. Cette fonction
                  appelle aussi la methode qui démare la création des murs.
*/
class AffichageGraph extends React.Component {
    constructor(props) {
        super(props);
        //Instancie les variables
        var tableauNodes = [];
        var tableauEdges = [];
        var cmpty = 0;
        var cmptx = 0;
        var compteur = 1;

        //Ici on indique la taille du labyrinthe. Le chiffre apres le * est la variation que notre chiffre pourrais avoir dans les positifs
        // et le chiffre apres le + indique la plus petite valeur. La largeur du labyrithe est alératoire, mais la hauteur seras toujours
        // 4 de plus que la largeur.
        var labyrintheWidth = Math.floor(Math.random() * 10) + 30;
        while (labyrintheWidth % 3 === 0) {
            labyrintheWidth = Math.floor(Math.random() * 10) + 30;
        }
        var labyrintheHeight = labyrintheWidth + 4;
        //Ici on instancie le nombre maximum de node
        var nbNodes = labyrintheWidth * labyrintheHeight;

        //Cette section sert a inserer les nodes dans le tableau tableauNodes en leur associant une couleur et une position.
        for (var i = 0; i < nbNodes; i++) {

            //Indique le debut du labyrinthe
            if (i === 0) {
                tableauNodes.push({ id: i, color: "#6DB1E5", groupe: "Chemin", x: cmptx, y: cmpty });
            }

            //Indique la fin du labyrinthe
            else if (i === nbNodes - 1) {
                tableauNodes.push({ id: i, color: "#D83D3D", groupe: "Chemin", x: cmptx, y: cmpty });
            }

            //Indique les murs du labyrinthe
            else {
                tableauNodes.push({ id: i, color: "#D5C586", groupe: "Chemin", x: cmptx, y: cmpty });
            }

            //Gestion de position pour affichage
            cmptx += 100;
            if (i === (labyrintheWidth * compteur) - 1) {
                cmpty += 100;
                cmptx = 0;
                compteur++;
            }

        }

        //Appele la fonction pour créer les murs du labyrinthe
        this.creerMurs(labyrintheWidth, labyrintheHeight, tableauNodes);

        //Instancie le state pour le graphique
        this.state = {
            nodes: tableauNodes,
            edges: tableauEdges,
        }
    }

    /*
    Auteur : Bastien Boulanger
    Paramettres
        width : la largeur du labyrinthe
        height : la hauteur du labyrinthe
        tableauNodes : le tableau avec toutes les nodes
    Description : Démare le processus de création des murs, il divise le tableau en 2 (de haut en bas) et indique ou la méthode creerMursGaucheDroite devras commencer
    Valeur de retour : Aucune
    */
    creerMurs(width, height, tableauNodes) {
        var tabIdNodesTemp = [];
        var cheminTemp = 0;

        //Insitancie les murs de haut en bas
        for (var i = 0; i < height; i++) {
            tableauNodes.forEach(node => {
                if (node.id === (width * i) + Math.round(width / 2) - 1) {
                    node.color = "#6D6D6D";
                    tabIdNodesTemp.push(node.id);
                }
            });
        }

        //Creer le trou dans le mur qui est néscéssaire pour permettre que le labyrinthe soi finissable
        cheminTemp = Math.floor(Math.random() * (tabIdNodesTemp.length - 1));
        while (cheminTemp === Math.round(tabIdNodesTemp.length / 2) - 1) {
            cheminTemp = Math.floor(Math.random() * (tabIdNodesTemp.length - 1));
        }
        tableauNodes[tabIdNodesTemp[cheminTemp]].color = "#D5C586";

        this.creerMursGaucheDroite(tabIdNodesTemp[Math.round(tabIdNodesTemp.length / 2) - 1], Math.round(width / 2), tableauNodes, height, width);
    }

    /*
    Auteur : Bastien Boulanger
    Paramettre 
        depart : la valeur de l'id qui représente la moitier du murs sur lequelle l'algoritme est.
        maxmin : représente la valeur du maximum de nodes que l'algoritme peu aller vers la gauche et la droite
        tableauNodes : le tableau avec toutes les nodes
        maxminHautBas : représente la valeur du maximum de nodes que l'algoritme peu aller vers le haut et le bas
        width : la largeur du labyrinthe
    Description : Cette fonction créer les murs a gauche et a droite de la node dont l'id est 'depart'. La fonction
                  fait aussi les trous dans ces murs pour que le labyrinthe soit faisable.
    Valeur de retour : Aucune
    */
    creerMursGaucheDroite(depart, maxmin, tableauNodes, maxminHautbas, width) {
        // Stop l'algoritme si il est rendu trop proche d'un mur
        if (maxmin > 4) {
            var cheminTemp = 0;

            //Instancie les murs de chaque côté du depart
            tableauNodes.forEach(node => {
                if (node.id > depart - maxmin + 1 && node.id < depart + maxmin - 1) {
                    node.color = "#6D6D6D";
                }
            });

            //Créer le trou dans le murs du coté gauche
            cheminTemp = Math.floor(Math.random() * (maxmin)) + depart - maxmin;
            while (cheminTemp === depart || cheminTemp === depart - Math.round(maxmin / 2)) {
                cheminTemp = Math.floor(Math.random() * (maxmin)) + depart - maxmin;
            }
            tableauNodes[cheminTemp].color = "#D5C586";

            //Créer le trou dans le murs du coté droit
            cheminTemp = Math.floor(Math.random() * (maxmin)) + depart - 1;
            while (cheminTemp === depart || cheminTemp === depart + Math.round(maxmin / 2)) {
                cheminTemp = Math.floor(Math.random() * (maxmin)) + depart;
            }
            tableauNodes[cheminTemp].color = "#D5C586";

            //Appele la fonction pour faire les murs d'en haut et bas de chaque coter
            this.creerMursHautBas(depart - Math.round(maxmin / 2), Math.round(maxminHautbas / 2) - 1, tableauNodes, maxmin, width);
            this.creerMursHautBas(depart + Math.round(maxmin / 2), Math.round(maxminHautbas / 2) - 1, tableauNodes, maxmin, width);
        }

    }

    /*
    Auteur : Bastien Boulanger
    Paramettre 
        depart : la valeur de l'id qui représente la moitier du murs sur lequelle l'algoritme est.
        maxmin : représente la valeur du maximum de nodes que l'algoritme peu aller vers le haut et le bas
        tableauNodes : le tableau avec toutes les nodes
        maxminGaucheDroite : représente la valeur du maximum de nodes que l'algoritme peu aller vers la gauche et la droite
        width : la largeur du labyrinthe
    Description : Cette fonction créer les murs du haut et du bas de la node dont l'id est 'depart'. La fonction
                  fait aussi les trous dans ces murs pour que le labyrinthe soit faisable.
    Valeur de retour : Aucune
    */
    creerMursHautBas(depart, maxmin, tableauNodes, maxminGaucheDroite, width) {
        // Stop l'algoritme si il est rendu trop proche d'un mur
        if (maxmin > 6) {
            var tabIdNodesPlus = [];
            var tabIdNodesMoins = [];
            var cheminTemp = 0;

            //Instancie les murs en haut et en bas de depart (on commence par les mettre dans un tableau pour les appelés apres)
            for (var i = 1; i <= maxmin; i++) {
                tabIdNodesPlus.push(depart - i * width);
                tabIdNodesMoins.push(depart + i * width);
            }
            //ici on appele toutes les nodes qui étais en haut ou en bas de depart et on change leurs couleurs
            tableauNodes.forEach(node => {
                for (var i = 0; i < tabIdNodesMoins.length; i++) {
                    if (node.id === depart || node.id === tabIdNodesMoins[i] || node.id === tabIdNodesPlus[i]) {
                        node.color = "#6D6D6D";
                    }
                }
            });

            //Créer le trou dans le murs en bas
            cheminTemp = Math.floor(Math.random() * (tabIdNodesMoins.length - 1));
            while (cheminTemp === Math.round(tabIdNodesMoins.length / 2)) {
                cheminTemp = Math.floor(Math.random() * (tabIdNodesMoins.length - 1));
            }
            tableauNodes[tabIdNodesMoins[cheminTemp]].color = "#D5C586";

            //Créer le trou dans le murs en haut
            cheminTemp = Math.floor(Math.random() * (tabIdNodesPlus.length - 1));
            while (cheminTemp === Math.round(tabIdNodesPlus.length / 2)) {
                cheminTemp = Math.floor(Math.random() * (tabIdNodesPlus.length - 1));
            }
            tableauNodes[tabIdNodesPlus[cheminTemp]].color = "#D5C586";

            //Appele la fonction pour faire les murs a gauche et a droite de chaque direction (haut et bas)
            this.creerMursGaucheDroite(tabIdNodesPlus[Math.round(tabIdNodesMoins.length / 2)], Math.round(maxminGaucheDroite / 2), tableauNodes, maxmin, width);
            this.creerMursGaucheDroite(tabIdNodesMoins[Math.round(tabIdNodesPlus.length / 2)], Math.round(maxminGaucheDroite / 2), tableauNodes, maxmin, width);
        }
    }

    render() {
        var retour = [];
        var graph = {
            edges: this.state.edges,
            nodes: this.state.nodes,
        }
        var options = {
            layout: {
                hierarchical: false,
            },
            nodes: {
                shape: 'square',
                size : 50
            },
            interaction: {
                dragNodes: false,
                zoomView: false,
            },
            physics: {
                enabled: false,
            },
            edges: {
                color: "#fff",
                width: 81,
                arrows: {
                    to: false,
                },
            }
        };
        retour.push(<Graph graph={graph} options={options} style={{ height: "1000px", width: "100%" }} />);
        return retour;
    }
}
export default AffichageGraph;