(function (d3,topojson) {
'use strict';

const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

svg.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json'),
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    d3.csv("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv")
]).then(([topoJsonData, tsvDataI,csvDataI]) => {
    const countryName = {};
    csvDataI.forEach(d => {
        countryName[d.country-code] = d.name;
    });
    const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);
    svg.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .append("title")
            .text(d => countryName[d.id]);
});


}(d3,topojson));