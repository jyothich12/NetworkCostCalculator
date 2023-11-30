
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

                var marker = new H.map.Marker({ lat: cluster.lat, lng: cluster.lng});
                marker.setData(cluster.zipcode);
               
                map.addObject(marker);

                // Create an info bubble
              //  var bubble = new H.ui.InfoBubble({ lat: cluster.lat, lng: cluster.lng }, {
              //      content: '<div>' + cluster.lat + ':' + cluster.lng + '</div>'
               // });

                // Add the info bubble to the UI
                //ui.addBubble(bubble);

            });

           var center = findTheCenter(clusterData);

            // Move map to center
            //map.setCenter(center);
            map.setZoom(9);
            map.getViewModel().setLookAtData(
                {
                    position: center,
                    zoom: 10
                },
                true
            );

        };

        // Read the file as text
        reader.readAsText(file);

    });


    document.getElementById('clusterDataForm').addEventListener('submit', function (e) {
        e.preventDefault();
            
        var formData = new FormData(this);

        var points = computeConvexHull(clusterData);

        const selectedOption = document.querySelector('input[name="clusterType"]:checked');
        if(selectedOption && selectedOption.value){
           var distance = drawShape(map, points, selectedOption.value);

           var html = "Total distance of cable to cover: <strong>" + distance.toFixed(2) + " miles</strong>"
           document.getElementById('distanceDiv').innerHTML = html;
        }
        else
            alert("Please select a cluster type before connecting points.");

    });
});


