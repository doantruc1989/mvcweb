async function fetchData() {
    let url = "http://localhost:3000/user/admin/report"
    let response = await fetch(url);
    const dataChart = await response.json();
    console.log(dataChart);
    return dataChart;
}

let saleData = [];
let revenueData = [];
let labelData = [];


fetchData()
    .then(dataChart => {

        let dailyData = dataChart.dailyReport;
        console.log(dailyData)
        for (let i = dailyData.length - 1; i >= 0; i--) {
            saleData.push(dailyData[i].dailySale);
            revenueData.push(dailyData[i].dailyRevenue);
            labelData.push((dailyData[i].createdAt).slice(5, 10))

        }

        var option = {
            type: "line",
            data: {
                labels: labelData,
                datasets: [{
                    label: "Sale",
                    data: saleData,
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                },
                {
                    label: "Revenue",
                    data: revenueData,
                    backgroundColor: "rgba(235, 22, 22, .5)",
                    fill: true
                }
                ]
            },
            options: {
                responsive: true
            }
        }
        var ctx2 = $("#salse-revenue").get(0).getContext("2d");
        var myChart2 = new Chart(ctx2, option);
    })
    .catch(error => console.log(error))



window.addEventListener(onload, fetchData)

