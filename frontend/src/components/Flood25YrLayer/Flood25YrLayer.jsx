import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
// Note: You might need to import your file path differently depending on your setup.
// Using a relative path for a file placed in 'src/data' or similar.
import floodTiffUrl from '../../../public/flood_25yr.tif'; 

const Flood25YrLayer = () => {
  const map = useMap(); // Gets the Leaflet map object instance

  useEffect(() => {
    // 1. Fetch the raw GeoTIFF file from its URL
    fetch(floodTiffUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        // 2. Parse the binary data into a GeoRaster object
        parseGeoraster(arrayBuffer).then(georaster => {
          
          // 3. Define the visualization logic (Coloring)
          const FloodColor = '#FF8C00'; // Deep Orange for 25-year flood area

          const layer = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            // Function to determine color based on pixel values in the TIFF file
            pixelValuesToColorFn: values => {
              const value = values[0];
              // Assuming any value > 0 means it's a flood-prone area
              if (value > 0) {
                return FloodColor;
              }
              return null; // Null means transparent (no color for dry areas)
            },
            resolution: 64 // Adjust for speed vs. detail (32 or 64 is a good start)
          });

          // 4. Add the new layer to the map
          layer.addTo(map);

          // Optional: Zoom the map to the bounds of the GeoTIFF data
          map.fitBounds(layer.getBounds());
          
          // Cleanup function: remove the layer when the component unmounts
          return () => {
            map.removeLayer(layer);
          };
        });
      })
      .catch(error => console.error("Failed to load GeoTIFF:", error));
  }, [map]);

  return null; // This component handles map side-effects, it renders nothing itself
};

export default Flood25YrLayer;