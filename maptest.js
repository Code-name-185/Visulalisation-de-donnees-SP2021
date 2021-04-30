(function (d3,topojson) {
'use strict';

const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

svg.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));


const g = svg.append('g');

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));
  
svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_to_all.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Country_data.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Party_data.csv")
]).then(([topoJsonData, csvDataI, csvDataC, csvDataP]) => {
    const rowByIDI = {};
    
    csvDataI.forEach(d => {
        rowByIDI[d.country_code] = d;
    });
    
    const rowByCNameC = {};

    csvDataC.forEach(d => {
        rowByCNameC[d.Country] = d;
    });

    const rowByPNameP = {};

    csvDataP.forEach(d => {
        rowByPNameP[d.Partyname] = d;
    });

//console.log(rowByIDI); 
//console.log(rowByCNameC);
//console.log(rowByPNameP);

const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);

    countries.features.forEach(d =>{
        Object.assign(d.properties, rowByIDI[d.id], rowByCNameC[d.Country], rowByPNameP[d.Partyname]);
    });

    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr("fill", d => colorScale(d.properties.GDP))
        .append("title")
            .text(d => d.properties.name)
//        .style('fill', )
});


}(d3,topojson));