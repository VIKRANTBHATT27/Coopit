import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import chroma from 'chroma-js';
import L from 'leaflet';

// Use a custom Leaflet control to display the color legend
// You can define the colors outside of the component
const LAYER_COLORS = {
  '10yr': chroma('yellow').hex(),
  '25yr': chroma('orange').hex(),
  '50yr': chroma('darkred').hex(),
};

const TiffLayer = ({ url, year, displayColor, opacity = 0.6 }) => {
  const map = useMap();
  const layerRef = React.useRef(null);

  useEffect(() => {
    // 1. Fetch the GeoTIFF file
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        // 2. Parse the array buffer into a GeoRaster object
        parseGeoraster(arrayBuffer).then(georaster => {
          
          // Determine the display range of the data (e.g., water depth values)
          // const min = georaster.mins[0]; 
          // const max = georaster.ranges[0] + min;

          // 3. Create the GeoRaster Layer
          const newLayer = new GeoRasterLayer({
            georaster: georaster,
            opacity: opacity,
            // Simple color function: anything > 0 is colored with the layer's designated color
            pixelValuesToColorFn: values => {
              const value = values[0];
              // Assuming '0' or 'NoData' is dry area, and anything above is flooded
              if (value > 0) { 
                return displayColor;
              }
              return null; // Transparent for non-data/dry areas
            },
            resolution: 64 
          });

          // 4. Add the layer to the map
          newLayer.addTo(map);
          layerRef.current = newLayer; // Store the reference

          // 5. Optionally, fit bounds to the first layer loaded
          if (year === '50yr') {
            map.fitBounds(newLayer.getBounds());
          }

          // Cleanup function
          return () => {
            if (layerRef.current && map.hasLayer(layerRef.current)) {
              map.removeLayer(layerRef.current);
            }
          };
        });
      })
      .catch(error => console.error(`Error loading ${url}:`, error));
      
  }, [map, url, displayColor, opacity, year]);

  return null;
};

export default TiffLayer;