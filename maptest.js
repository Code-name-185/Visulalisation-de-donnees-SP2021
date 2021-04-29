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

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_to_all.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Country_data.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Party_data.csv")
]).then(([topoJsonData, csvDataI, csvDataC, csvDataP]) => {
    const countryName = {};
    csvDataI.forEach(d => {
        countryName[d.country_code] = d.name;
    });

const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);
    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .append("title")
            .text(d => countryName[d.id])
//        .style('fill', )
});


}(d3,topojson));