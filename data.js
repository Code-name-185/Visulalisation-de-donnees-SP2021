let DataI = d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_TO_Country.csv", function(d){
    return{
        iso3I : d.ISO,
        paysI : d.Country
    }
}).then(dataI => {
    console.log("DataI2", dataI);
});

let DataC = d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Country_data.csv", function(d){
    return{
        paysC : d.Country,
        annee_election : d.Elec_year,
        electeur : +d.WVS_LR_MedianVoter,
        ocde : d.OECD,
        auth_dem : +d.polity2,
        regime : d.FH_Regime,
        gdp : +d.GDP,
        esp_vie : +d.Longevity
    }
}).then(dataC => {
    console.log("DataC2", dataC);

    let empan_gdp = d3.extent(dataC, d => gdp)
    console.log("EmpanC GDP", empan_gdp);

});

//d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/Party_data.csv", function(d){
//    return{
//        d
//    }
//}).then(dataP => {
//    console.log("DataP", dataP);
//});


