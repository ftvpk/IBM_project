import fetch from "node-fetch";
import { useEffect } from 'react'
import { useState } from 'react'
import Chart from './Chart'
import { useParams } from 'react-router-dom'

const Main = (props) => {

    let countryData = []
    const [countrySeparatedData, setCountrySeparatedData] = useState(null)
    const [countryDoesNotExist, setCountryDoesNotExist] = useState(false)
    const { country } = useParams()

    const setDropDownValues = (countries) => {
        const dropDown = document.getElementById("country")
        for (let i = 0; i < countries.length; i++) {
            let option = countries[i]
            let element = document.createElement("option")
            element.textContent = option
            element.value = option
            dropDown.appendChild(element)
        }
    }

    const onChangeHandler = (e) => {
        const country = e.target.value           
        window.location.href ='/' + country
    }

    useEffect(() => {
        if(country){
            //Populate dropdown
            fetch('http://localhost:5000/api/list')
            .then(res => {
                if(!res.ok){
                    throw new Error("could not fetch country list")
                }
                return res.json()
            })
            .then(data => {
                setDropDownValues(data)
                const dropDown = document.getElementById("country")
                dropDown.selectedIndex = -1
            })
            .catch(err => {
                console.log(err.message)
            })

            //Choose a specific country
            fetch('http://localhost:5000/api/' + country)
            .then(res => {
                if(!res.ok){
                    throw new Error("could not fetch the country")
                }
                return res.json()
            })
            .then(data => {   
                if(data[0] == "country not found"){
                    setCountrySeparatedData(null)
                    setCountryDoesNotExist(true)
                }else {
                    countryData = data
                    setCountrySeparatedData(separate(data))
                    document.getElementById("country").value = country     
                }    
            })  
            .catch(err => {
                console.log(err.message)
            })
        } else {
            fetch('http://localhost:5000/api/list')
            .then(res => {
                if(!res.ok){
                    throw new Error("could not fetch country list")
                }
                return res.json()
            })
            .then(data => {
                setDropDownValues(data)
                const dropDown = document.getElementById("country")
                dropDown.selectedIndex = -1
            })   
            .catch(err => {
                console.log(err.message)
            })    
        }            
    }, [])

    function separate(data) {
        let cases = []
        let deaths = []
        let weeks = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].indicator === 'cases') {
                let week = data[i].week
                let count = data[i]['weekly count']
                cases.push(count)
                weeks.push(week)
            } else if (data[i].indicator === 'deaths') {
                let count = data[i]['weekly count']
                deaths.push(count)
            }
        }
        return { "cases": cases, "deaths": deaths, "weeks": weeks }
    }


    return (
        <div className="Main">
            <h2 className="countryList">Country List:</h2>
            <select name="country" id="country" onChange={(e) => { onChangeHandler(e) }}>
            </select>
            {countryDoesNotExist && <h3>The country you specfied does not exist</h3>}
            {countryDoesNotExist &&  <h3>Please try again</h3>}
            {countrySeparatedData && <Chart data={countrySeparatedData} />}
            <hr></hr>
        </div>
    );
}

export default Main;