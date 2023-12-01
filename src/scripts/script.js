
document.addEventListener('DOMContentLoaded', () => {
    var platform = new H.service.Platform({
        'apikey': 'EDvbRcDWu6Dp11D3W1b7rDdV2koyAUfICnndRCw_fbk'
    });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    const map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map,
    {
      zoom: 8,
      center: { lat: 80.73541, lng: -89.20469 }
    });

    // Create an instance of the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    let clusterData = [];



    const fileInput = document.getElementById('fileInput');

    // Event listener to handle file selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
     //   const formData = new FormData();
       // formData.append('file', file);

         const reader = new FileReader();
         // Event listener for when the file is loaded
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n'); // Split content into lines

            // Print each line to the console
            lines.forEach((line) => {
                const items = line.split(',');
                let cluster = new Point( items[0], items[1], items[2] );
                clusterData.push(cluster);
            });

           clusterData.forEach((cluster) => {
               
                addMarkerAt(map, cluster.lat, cluster.lng, "cluster", null);

                // Create an info bubble
              //  var bubble = new H.ui.InfoBubble({ lat: cluster.lat, lng: cluster.lng }, {
              //      content: '<div>' + cluster.lat + ':' + cluster.lng + '</div>'
               // });

                // Add the info bubble to the UI
                //ui.addBubble(bubble);

            });

           var center = findTheCenter(clusterData);

            // Move map to center
            map.setCenter(center);
            map.setZoom(9.5);
      //      map.getViewModel().setLookAtData(
      //          {
       //             position: center,
       //             zoom: 10
        //        },
         //       true
          //  );

        };

        // Read the file as text
        reader.readAsText(file);

    });


    document.getElementById('clusterDataForm').addEventListener('submit', function (e) {
        e.preventDefault();
            
        var formData = new FormData(this);

        var points = computeConvexHull(clusterData);

        const clusterType = document.querySelector('input[name="clusterType"]:checked');
        const broadbandTech = document.querySelector('input[name="broadbandTech"]:checked');
        if(clusterType && clusterType.value && broadbandTech && broadbandTech.value){
            if (broadbandTech.value === 'ofc') {
                constructOFCInterCluster(map, points, clusterType.value);
                addLegendItems(ofcLegendItems);
            } else if (broadbandTech.value === 'fso') {
                constructFSOInterCluster(map, points, clusterType.value);
                addLegendItems(fsoLegendItems);
            } else if (broadbandTech.value === 'wireless') {
                constructWirelessInterCluster(map, points, clusterType.value);
                addLegendItems(wirelessLegendItems);
            }

          // var html = "Total distance of cable to cover: <strong>" + distance.toFixed(2) + " miles</strong>"
        }
        else
            alert("Please select a cluster type & technology before connecting points.");

    });
});

const ofcLegendItems = [
    { iconPath: '../images/ofc_tower.png', name: 'Cluster' },
    { iconPath: '../images/ofc_central.png', name: 'Hub' },
    { iconPath: '../images/ofc_fiber.png', name: 'Optical Fiber Cable' }
];

const wirelessLegendItems = [
    { iconPath: '../images/wireless_tower.png', name: 'Cluster' },
    { iconPath: '../images/wireless_repeater.png', name: 'Repeater' },
    { iconPath: '../images/wireless_central.png', name: 'Hub' }
];

const fsoLegendItems = [
    { iconPath: '../images/fso_tower.png', name: 'FSO tower' },
    { iconPath: '../images/fso_repeater.png', name: 'Repeater' },
    { iconPath: '../images/fso_central.png', name: 'Central Hub' }
];

function addLegendItems(legendItems) {
    const footerLegend = document.getElementById('footer-legend');

    footerLegend.innerHTML = '';

    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const icon = document.createElement('img');
        icon.src = item.iconPath;
        icon.alt = item.name;
        icon.className = 'legend-icon';

        const itemName = document.createElement('span');
        itemName.textContent = item.name;

        legendItem.appendChild(icon);
        legendItem.appendChild(itemName);

        footerLegend.appendChild(legendItem);
    });
}


