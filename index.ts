/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */

import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import axios from "axios";

const urlInput = document.getElementById("urlinput") as HTMLInputElement;
const loadUrlButton = document.getElementById("urlbutton") as HTMLInputElement;

/*
// Load external GEXF file:
fetch("./numerama-links.gexf")
  .then((res) => res.text())
  .then((gexf) => {
    // Parse GEXF string:
    const graph = parse(Graph, gexf);

    // Retrieve some useful DOM elements:
    const container = document.getElementById("sigma-container") as HTMLElement;
    const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
    const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
    const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
    const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

    // Instanciate sigma:
    const renderer = new Sigma(graph, container 
      //,{
      //minCameraRatio: 0.1,
      //maxCameraRatio: 10,
      //}
    );

  });
*/

const graph = new Graph();
const container = document.getElementById("sigma-container") as HTMLElement;
const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
const reRunBtn = document.getElementById("re-run") as HTMLButtonElement;
const runCircleBtn = document.getElementById("run-circle") as HTMLButtonElement;


const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;


import circular from "graphology-layout/circular";
import forceAtlas2 from "graphology-layout-forceatlas2";

var renderer: Sigma | null = null;

// Bind zoom manipulation buttons
zoomInBtn.addEventListener("click", () => {
  if (renderer != null){
    renderer.getCamera().animatedZoom({ duration: 600 });
  }
});
zoomOutBtn.addEventListener("click", () => {
  if (renderer != null){
    renderer.getCamera().animatedUnzoom({ duration: 600 });
  }
});
zoomResetBtn.addEventListener("click", () => {
  if (renderer != null){
    renderer.getCamera().animatedReset({ duration: 600 });
  }
});

reRunBtn.addEventListener("click", () => {
  const settings = forceAtlas2.inferSettings(graph);
  forceAtlas2.assign(graph, { settings, iterations: 1200 });
});

runCircleBtn.addEventListener("click", () => {
  circular.assign(graph);
});

// Bind labels threshold to range input
labelsThresholdRange.addEventListener("input", () => {
  if (renderer != null){
    renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
  }
});


// Set proper range initial value:
//if (renderer != null){
  //labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
//}

loadUrlButton.addEventListener("click", () => {
  console.log("Try importing");
  var url = urlInput.value;
  loadUrlButton.innerText = "Loading";

  axios(url).then(
    (response) => {
      graph.import(response.data);
      renderer = new Sigma(graph, container);
      console.log("import called");
      circular.assign(graph);
      
      const settings = forceAtlas2.inferSettings(graph);
      forceAtlas2.assign(graph, { settings, iterations: 600 });
      loadUrlButton.innerText = "Load new";
    }
  );
});
