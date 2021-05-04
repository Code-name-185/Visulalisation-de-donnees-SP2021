function  draw() {

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

const mapwithdata = (i) => {

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

const values = [d => d.properties.c_o_OECD, d => d.properties.c_r_Regime, d => d.properties.c_l_longevity, d => d.properties.c_rd_Dem_regime, d => d.properties.c_e_election, 
    d => d.properties.c_lb_lowerchambre, d => d.properties.c_gp_governement_parties, d => d.properties.c_bp_barriers_parties];

const colorScale = d3.scaleOrdinal();

Promise.all([
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_to_all.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_OECD.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_regime.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_longevity.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_regime_democratic.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_fair_election.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_lower_chamber.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_governement_parties.csv"),
    d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/country_barriers_parties.csv")
]).then(([topoJsonData, csvDataI, OECDData, regimeData, longevityData, regimedemData, fairelectionData, lowerchamberData, governementpartiesData, barrierspartiesData]) => {
    
    const rowByINameI = {};
    csvDataI.forEach(d => {
        rowByINameI[d.country_code] = d;
    });

    const OECDrows = {};
    OECDData.forEach(d => {
        OECDrows[d.c_o_code] = d;
    });

    const regimerows = {};
    regimeData.forEach(d => {
        regimerows[d.c_r_code] = d;
    });

    const longevityrows = {};
    longevityData.forEach(d => {
        longevityrows[d.c_l_code] = d;
    });
    
    const regimedemrows = {};
    regimedemData.forEach(d => {
        regimedemrows[d.c_rd_code] = d;
    });

    const fairelectionrows = {};
    fairelectionData.forEach(d => {
        fairelectionrows[d.c_e_code] = d;
    });

    const lowerchamberrows = {};
    lowerchamberData.forEach(d => {
        lowerchamberrows[d.c_lb_code] = d;
    });

    const governementpartiesrows = {};
    governementpartiesData.forEach(d => {
        governementpartiesrows[d.c_gp_code] = d;
    });

    const barrierspartiesrows = {};
    barrierspartiesData.forEach(d => {
        barrierspartiesrows[d.c_bp_code] = d;
    });

    const colorValue =  values[i];

const countries = topojson.feature(topoJsonData, topoJsonData.objects.countries);

    countries.features.forEach(d =>{
        Object.assign(d.properties, rowByINameI[d.id], OECDrows[d.id], regimerows[d.id], longevityrows[d.id], 
            regimedemrows[d.id], fairelectionrows[d.id], lowerchamberrows[d.id], governementpartiesrows[d.id],
            barrierspartiesrows[d.id]);
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
        backgroundRectWidth: 350
    });

    g.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr("fill", d => colorScale(colorValue(d)))
        .append("title")
            .text(d => d.properties.name)
    
});

}

function init() {
        
    d3.select('#Information').on('change', function() {
        choice = d3.event.target.value;
        mapwithdata(choice)
    });
}

init();

mapwithdata(0)

}

draw();