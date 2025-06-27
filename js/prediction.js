function displayPredictPage(response) {
    clearPage();
    let html = `
      <div class="card shadow-sm border-primary mb-4">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Prédiction du Type de Navire</h2>
        </div>
        <div class="card-body">
          <p class="card-text">Le type de navire prédit est : <strong class="text-primary">${response}</strong></p>
        </div>
      </div>
    `;
    $("#prediction").html(html);
}

function displayPredictionPosition(response) {
    clearPage();
    console.log(response);
    let html = `
      <div id="card-prediction" class="card shadow-sm border-primary mb-4" style="max-width: 700px; margin: auto; padding-bottom: 60px;">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Prédiction de la Position du Navire</h2>
        </div>
        <div class="card-body">
          <p class="card-text">La position prédite à la date ${response[2]} + ${minsec(response[3])} du navire est :</p>
          <ul class="list-group">
            <li class="list-group-item">Latitude : <strong class="text-primary">${response[0]}</strong></li>
            <li class="list-group-item">Longitude : <strong class="text-primary">${response[1]}</strong></li>
          </ul>
        </div>
        <div id="map" style="height: 500px; width: 100%; margin-top: 15px;"></div>
      </div>
    `;
    $("#prediction").html(html);

    // Plotly map
    const lat = parseFloat(response[0]);
    const lon = parseFloat(response[1]);
    const lat_r = parseFloat(response[4]);
    const lon_r = parseFloat(response[5]);

    const data = [
        {
            type: "scattergeo",
            mode: "markers",
            name: "Position prédite",
            lat: [lat],
            lon: [lon],
            marker: { color: "blue", size: 10 },
            text: ["Position prédite"]
        },
        {
            type: "scattergeo",
            mode: "markers",
            name: "Position avant prédiction",
            lat: [lat_r],
            lon: [lon_r],
            marker: { color: "red", size: 10 },
            text: ["Position avant prédiction"]
        }
    ];

    const layout = {
        geo: {
            projection: { type: "natural earth" },
            lonaxis: { range: [-100, -80] },
            lataxis: { range: [18, 32] },
            showland: true,
            landcolor: "#f0f0f0"
        },
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("map", data, layout);
}

function minsec(data) {
    if (data > 60 && data < 3600) return `${(data / 60).toFixed(2)} minutes`;
    if (data >= 3600) return `${(data / 3600).toFixed(2)} heures`;
    return `${data} secondes`;
}

function displayClusterResults(response) {
    clearPage();
    let html = `
      <div id="card-prediction" class="card shadow-sm border-primary mb-4" style="max-width: 700px; margin: auto; padding-bottom: 60px;">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Prédiction des clusters</h2>
        </div>
        <div id="map2" style="height: 500px; width: 100%; margin-top: 15px;"></div>
      </div>
    `;
    $("#prediction").html(html);

    setTimeout(() => {
        const clusterData = {};

        response.forEach((boat) => {
            const clusterId = parseInt(boat.cluster[0], 10);
            if (!clusterData[clusterId]) {
                clusterData[clusterId] = { lat: [], lon: [], text: [] };
            }
            clusterData[clusterId].lat.push(parseFloat(boat.latitude));
            clusterData[clusterId].lon.push(parseFloat(boat.longitude));
            clusterData[clusterId].text.push(`MMSI: ${boat.mmsi}<br>Cluster: ${clusterId}`);
        });

        const traces = Object.entries(clusterData).map(([clusterId, data]) => ({
            type: "scattergeo",
            mode: "markers",
            name: `Cluster ${clusterId}`,
            lat: data.lat,
            lon: data.lon,
            text: data.text,
            marker: {
                size: 6,
                color: getColorForCluster(parseInt(clusterId)),
                opacity: 0.8
            }
        }));

        const layout = {
            geo: {
                projection: { type: "natural earth" },
                lonaxis: { range: [-100, -80] },
                lataxis: { range: [18, 32] },
                showland: true,
                landcolor: "#f0f0f0"
            },
            margin: { t: 0, b: 0 }
        };

        Plotly.newPlot("map2", traces, layout);
    }, 50);
}

function getColorForCluster(clusterId) {
    const colors = [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
        "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
        "#bcbd22", "#17becf"
    ];
    return colors[clusterId % colors.length];
}
