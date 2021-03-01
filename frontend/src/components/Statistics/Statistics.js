import React, { useState, useCallback, useMemo } from "react";
import {Bar} from "react-chartjs-2";
import axios from "axios";
import "./Statistics.css";
import {Container} from "react-bootstrap";
import { BASE_API_URL } from "../../config";

const Statistics = () => {

  const [statistics, setStatistics] = useState([]);

  const loadStatistics = useCallback(async () => {
    const res = await axios.get(BASE_API_URL + '/statistics');
    setStatistics(res.data);
    }, [])
      
    //load statistics once when page is rendered
    useMemo(() => {
    loadStatistics();
    }, [loadStatistics]);

    

    // Get chart-data for generated or selected templates
    const getChartData = (interaction) => {

        const barLabels = ["Database", "Img-Flip-Api", "Local-Upload", "Custom-Url", "Camera"]
        
        // count values for each label
        const databaseValues = statistics.filter((entry) => entry.interaction === interaction && entry.src === "database").length;
        const imgFlipbasevalues = statistics.filter((entry) => entry.interaction === interaction && entry.src === "img-flip").length;
        const localValues = statistics.filter((entry) => entry.interaction === interaction && entry.src === "local").length;
        const customUrlValues = statistics.filter((entry) => entry.interaction === interaction && entry.src === "custom-url").length;
        const cameraValues = statistics.filter((entry) => entry.interaction === interaction && entry.src === "camera").length;
           
        const values = [databaseValues, imgFlipbasevalues, localValues, customUrlValues, cameraValues]

        return {
            labels: barLabels,
            datasets: [{
                label: interaction === "select" ? "selected" : "generated",
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        }

    }

    const selectData = getChartData("select");
    const generateData = getChartData("generate");

  return (
    <Container className="statistics-container mt-5">
        <h2 className="text-center"> Statistic Charts</h2>
        <p className="text-center">Get an overview over the most popular templates of the meme-generator!</p>
        <div className="mt-5">
            <h4>How often were the templates of different sources selected in the Meme-Generator?</h4>
            <Bar data={selectData} options={{}}></Bar>
        </div>
        <div className="mt-5">
            <h4>Which source of templates do the generated memes use?</h4>
            <Bar data={generateData} options={{}}></Bar>
        </div>   
    </Container>
  );
};

export default Statistics;