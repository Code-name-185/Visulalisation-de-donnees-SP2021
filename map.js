const svg = select('svg');

const width = 900;
const heigth = 600;

json('C:\Users\vmuld\Documents\UNIL\2S\Visualisation de données\Projet\Visulalisation-de-donnees-SP2021\custom.geo.topojson')
    .then(data => {
        console.log(data);
    });
