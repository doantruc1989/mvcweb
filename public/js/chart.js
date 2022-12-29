async function fetchData() {
    let url = "http://localhost:3000/user/admin/report"
    let response = await fetch(url);
    const dataChart = await response.json();
    console.log(dataChart);
    return dataChart;
}

let saleData = [];
let revenueData = [];
fetchData()
    .then(dataChart => {
        let dailyData = dataChart.orderTotal;
        for (let i = 0; i < dailyData.length; i++) {
            let x = dailyData[i].cart.items;
            let y = Object.keys(x);
            for (let j = 0; j < y.length; j++) {
                let inititalPrice = x[y[j]].item.initialPrice;
                let salePrice = x[y[j]].item.price;
                let qty = x[y[j]].qty;
                totalSale = salePrice * qty;
                totalRevenue = (salePrice - inititalPrice) * qty;
                revenueData.push(totalRevenue);
                saleData.push(totalSale);

            }
        }

        var option = {
            type: "line",
            data: {
                labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
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





