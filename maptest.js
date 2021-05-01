(function (d3,topojson) {
'use strict';

const colorLegend = (selection, props) => {
    const {                      
      colorScale,                
      circleRadius,
      spacing,                   
      textOffset,
      backgroundRectWidth        
    } = props; 
    
    const backgroundRect = selection.selectAll('rect')
      .data([null]);             
    const n = colorScale.domain().length; 
    backgroundRect.enter().append('rect')
      .merge(backgroundRect)
        .attr('x', -circleRadius * 2)   
        .attr('y', -circleRadius * 2)   
        .attr('rx', circleRadius * 2)   
        .attr('width', backgroundRectWidth)
        .attr('height', spacing * n + circleRadius * 2) 
        .attr('fill', 'white')
        .attr('opacity', 0.8);
    

    const groups = selection.selectAll('.tick')
        .data(colorScale.domain());
    const groupsEnter = groups
        .enter().append('g')
        .attr('class', 'tick');
    groupsEnter
      .merge(groups)
        .attr('transform', (d, i) =>    
          `translate(0, ${i * spacing})`  
        );
    groups.exit().remove();
    
    groupsEnter.append('circle')
      .merge(groups.select('circle')) 
        .attr('r', circleRadius)
        .attr('fill', colorScale);      
    
    groupsEnter.append('text')
      .merge(groups.select('text'))   
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };

const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append('g');

const colorLegendG = svg.append("g")
  .attr("transform", "translate(30,300)");

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));
  
svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

const colorScale =d3.scaleOrdinal();

const colorValue = d => d.properties.c_r_Regime;

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_to_all.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/party.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_OECD.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_regime.csv")
]).then(([topoJsonData,csvDataI, csvDataC, csvDataP, OECDData, regimeData]) => {
    
    const rowByINameI = {};
    csvDataI.forEach(d => {
        rowByINameI[d.country_code] = d;
    });

    const rowByCNameC = {};
    csvDataC.forEach(d => {
        rowByCNameC[d.c_code] = d;
    });

    const rowByPNameP = {};
    csvDataP.forEach(d => {
        rowByPNameP[d.p_country_code] = d;
    });

    const OECDrows = {};
    OECDData.forEach(d => {
        OECDrows[d.c_o_code] = d;
    });

    const regimerows = {};
    regimeData.forEach(d => {
        regimerows[d.c_r_code] = d;
    });
    

//console.log(rowByINameI);
//console.log(rowByCNameC);
//console.log(rowByPNameP);

const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);

    countries.features.forEach(d =>{
        Object.assign(d.properties, rowByINameI[d.id], rowByCNameC[d.id], rowByPNameP[d.id], OECDrows[d.id], regimerows[d.id]);
    });

    colorScale
        .domain(countries.features.map(colorValue))
        .domain(colorScale.domain().sort().reverse())
        .range(d3.schemeSpectral[colorScale.domain().length]);
    
    colorLegendG.call(colorLegend, {
        colorScale,
        circleRadius: 8,
        spacing: 20,
        textOffset: 12,
        backgroundRectWidth: 200
    });

    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr("fill", d => colorScale(colorValue(d)))
        .append("title")
            .text(d => d.properties.name)
});


}(d3,topojson));