var map;
function initMap() {
    let options = {
        zoom: 4,
        center: { lat: -25.35, lng: 131.03 } //Uluru 
    };
    let map = new google.maps.Map(document.getElementById("map"), options);

    function addmarker(prop) {
        let marker = new google.maps.Marker({ position: prop.coords, map: map })
        if (prop.content) {
            let infowindow = new google.maps.InfoWindow({
                content: prop.content
            });

            marker.addListener("click", function () {
                infowindow.open(map, marker)
            })
        }
    }

    for(let i = 0;i < quake_lst.length;i++){
        // Add marker
        addmarker(quake_lst[i]);
      }
}