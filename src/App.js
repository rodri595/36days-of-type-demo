/* eslint-disable */
import React, { useRef, useEffect, useState } from "react";
import { Map, TileLayer, LayersControl } from "react-leaflet";
import L from "leaflet";

const App = () => {
  const mapRef = useRef();
  const [opupOpen, setpopupOpen] = useState(false);
  const [BannerOpen, setBannerOpen] = useState(true);
  const [popupLetter, setpopupLetter] = useState("a");
  const [bounds, setbounds] = useState([
    [-90, -180],
    [90, 180],
  ]);

  useEffect(() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
    if (!map) return;
    fetch("./data.json")
      .then((r) => r.json())
      .then((dataset) => {
        var groupLayer = new L.FeatureGroup();
        dataset.map((o) => {
          L.marker(o.coords, {
            icon: new L.Icon({
              iconUrl: require(`./assests/img/Letters/Markers_${o.name}.svg`)
                .default,
              iconSize: [70, 70],
            }),
          })
            .bindTooltip(o.name)
            .on("click", function (e) {
              setpopupOpen(false);
              setpopupLetter(o.name);
              setTimeout(() => {
                setpopupOpen(true);
              }, 500);
            })
            .addTo(groupLayer);
        });
        groupLayer.addTo(map);
        setbounds(groupLayer.getBounds());
        map.fitBounds(groupLayer.getBounds());
      });
  }, []);

  return (
    <body>
      <div className={opupOpen ? "custom-popup-open" : "custom-popup-close"}>
        <div className="custom-popup-content">
          <div
            className="media-icon"
            style={{
              position: "absolute",
              color: "white",
              fontSize: "25px",
              fontWeight: "700",
              transform: "translateY(-25px) translateX(190px) ",
            }}
            onClick={() => setpopupOpen(false)}
          >
            <div style={{ transform: "rotate(45deg) " }}>+</div>
          </div>
          {opupOpen ? (
            <>
              <video
                src={
                  require(`./assests/img/Timelapse/${popupLetter}.mp4`).default
                }
                loop
                autoPlay
                className="popup-video"
              />
              <br />
              <video
                src={require(`./assests/img/Poster/${popupLetter}.mp4`).default}
                loop
                autoPlay
                style={{ marginTop: "20px" }}
                className="popup-video"
              />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {BannerOpen ? (
        <div className="banner-map">
          <div
            className="media-icon close-option"
            onClick={() => setBannerOpen(false)}
          >
            <div style={{ transform: "rotate(45deg) " }}>+</div>
          </div>
          <img
            src={require("./assests/img/title.svg").default}
            className="banner-img"
          />
        </div>
      ) : (
        <></>
      )}
      <Map
        ref={mapRef}
        center={[0, 0]}
        zoom={3}
        maxZoom={19}
        minZoom={2}
        bounceAtZoomLimits={true}
        maxBoundsViscosity={0.95}
        maxBounds={bounds}
      >
        <TileLayer
          noWrap={false}
          url="https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}"
          minZoom={0}
          maxZoom={22}
          subdomains="abcd"
          accessToken="Q6TlPD96qItYafHxj0s1kyNNU0DsHrLO95GdtHi64FISFxXecpHBAVTJ2KAOxm6b"
        />
      </Map>
    </body>
  );
};

export default App;
