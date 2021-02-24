import React from 'react'
import { Line } from 'react-chartjs-2'

const Chart = (props) => {

    const countryData = props.data


    return (
    <div className="chart">
        <Line
            data={{
                labels: countryData['weeks'],
                datasets: [
                    {
                        label: 'Cases',
                        data: countryData['cases'],
                        borderColor: "rgba(75,192,192,1)",
                        fill: false
                    },
                    {
                        label: 'Deaths',
                        data: countryData['deaths'],
                        borderColor: "rgba(198,1,192,1)",
                        fill:false
                    }
                ]
            }}           
        />
    </div>
    );
}

export default Chart;