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

const colorScale =d3.scaleOrdinal();

const colorValueGDP = d => d.properties.GDP;
const colorValueOECD = d => d.properties.OECD;

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/party.csv")
]).then(([topoJsonData,  csvDataC, csvDataP]) => {
    
    const rowByCNameC = {};

    csvDataC.forEach(d => {
        rowByCNameC[d.code] = d;
    });

    const rowByPNameP = {};

    csvDataP.forEach(d => {
        rowByPNameP[d.Partyname] = d;
    });

//console.log(rowByCNameC);
//console.log(rowByPNameP);

const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);

    countries.features.forEach(d =>{
        Object.assign(d.properties, rowByCNameC[d.id], rowByPNameP[d.id]);
    });

    colorScale
        .domain(countries.features.map(colorValueOECD))
        .domain(colorScale.domain().sort().reverse())
        .range(d3.schemeSpectral[colorScale.domain().length - 1]);

    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr("fill", d => colorScale(colorValueOECD(d)))
        .append("title")
            .text(d => d.properties.name)
//        .style('fill', )
});


}(d3,topojson));