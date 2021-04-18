d3.csv("https://raw.githubusercontent.com/Code-name-185/Visulalisation-de-donnees-SP2021/main/ISO_TO_Country.csv", function(data){
    //console.log("DataId",data);
    return{
        iso3I : data.ISO,
        countryI : data.Country
    }

}).then((result) => {
    console.log(iso3I)
}).catch((err) => {
    
});;

d3.csv("ISO_TO_Country2.csv", function(data){
    console.log("DataI2d",data);
    return{
        iso3I : data.ISO,
        countryI : data.Country
    }

});