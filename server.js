const express = require("express")
const app = express()
const fetch = require('node-fetch')
const port = 5000;
const fs = require('fs')
const path = require("path")

const url = 'https://opendata.ecdc.europa.eu/covid19/nationalcasedeath/json/'


app.get('/api/list', (req, res) => {
    const countries = getCountryList()
    res.header({ "Access-Control-Allow-Origin": "*" })
    res.json(countries)
})

app.get('/api/:id', (req, res) => {
    const id = req.params.id
    const countryValues = findCty(id)
    res.header({ "Access-Control-Allow-Origin": "*" })
    res.json(countryValues)    
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

fetchJSON()

function loadData(data) {
    //if folder does not exist, create it
    if (!fs.existsSync("./data")) {
        fs.mkdir(path.join(__dirname, "data"), (err) => {
            if (err) {
                return console.log(err)
            }
            console.log("Directory successfully created")
        })
    }
    //if data file does not exist, create it
    if (!fs.existsSync("./data/info.json")) {
        try {
            fs.writeFileSync(path.join(__dirname, "data/info.json"), JSON.stringify(data))
        } catch (err) {
            console.log(err)
        } 
        console.log("Covid data saved")
    }
}

function findCty(country) {

    let found = false
    let rawdata = fs.readFileSync('./data/info.json')
    let json = JSON.parse(rawdata)
    let data = []
    
    switch(country){
        case "Myanmar or Burma":
              country ="Myanmar/Burma"
        break
        case "the Holy See or Vatican City State":
            country = "the Holy See/ Vatican City State"
        break
        default:
        break
    }

    for (let i = 0; i < json.length; i++) {
        if (json[i].country === country) {
            found = true
            let obj = {
                "week": json[i].year_week,
                "indicator": json[i].indicator,
                "weekly count": json[i].weekly_count
            }
            data.push(obj)
        }
    }
    if(found){
        return data
    } else {
        return ["country not found"]
    }
    
}

function fetchJSON (){
    fetch(url, { method: "get" })
    .then(res => {
        if (!res.ok) {
            throw new Error(`an error occured: ${res.statusText}`)
        }
        return res.json()
    })
    .then(json => {        
        loadData(json)     
    })
    .catch(err => console.log(err))
}

function getCountryList() {
    let rawdata = fs.readFileSync('./data/info.json')
    let json = JSON.parse(rawdata)
    let countries = []

    for (let i = 0; i < json.length; i++) {
        country = json[i].country

        // if(country == "Myanmar/Burma"){
        //     country = "Myanmar or Burma"
        // }
        // if(country == "the Holy See/Vatican City State"){
        //     country = "the Holy See or Vatican City State"
        // }

        if (!countries.includes(country) && !country.includes('total')) {  
            countries.push(country)
        }
    }
    return countries
}

