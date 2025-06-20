// ScatterRenderer.js - 3D scatter plot rendering logic
export class ScatterRenderer {
  constructor(manager) {
    this.manager = manager;
  }

  render() {
    const plotContainer = document.getElementById('scatter-plot');
    if (!plotContainer) return;
    
    // Prepare 3D scatter data
    const traces = this.manager.data.children
      .map(cluster => {
        const companiesInCluster = cluster.children.filter(c => 
          c.x !== null && c.x !== undefined && 
          c.y !== null && c.y !== undefined && 
          c.z !== null && c.z !== undefined
        );

        return {
          x: companiesInCluster.map(c => c.x),
          y: companiesInCluster.map(c => c.y),
          z: companiesInCluster.map(c => c.z),
          mode: 'markers',
          type: 'scatter3d',
          name: cluster.name,
          text: companiesInCluster.map(c => 
            `Cluster: ${cluster.name}<br>${c.name}${c.sector ? '<br>(' + c.sector + ')' : ''}`
          ),
          hoverinfo: 'text',
          marker: {
            size: 5,
            color: this.manager.colors[cluster.name],
            opacity: 0.8
          },
          visible: this.manager.visibleClusters.has(cluster.name)
        };
      });

    const layout = {
      title: 'Projection 3D des Entreprises (UMAP)',
      margin: { l: 0, r: 0, b: 0, t: 40 },
      scene: {
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        zaxis: { title: 'Z' }
      },
      showlegend: false,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: 'currentColor' }
    };

    const config = { responsive: true, displayModeBar: false };
    Plotly.react(plotContainer, traces, layout, config);
  }

  updateVisibility() {
    const plotContainer = document.getElementById('scatter-plot');
    if (!plotContainer) return;

    // Update visibility of existing traces
    const updates = [];
    const traceIndices = [];
    
    this.manager.data.children.forEach((cluster, index) => {
      updates.push(this.manager.visibleClusters.has(cluster.name));
      traceIndices.push(index);
    });

    // Use Plotly.restyle to update visibility without losing camera position
    Plotly.restyle(plotContainer, { visible: updates }, traceIndices);
  }

  showLegend() {
    const isMobile = window.innerWidth <= 500;
    const legendContainer = document.getElementById('scatter-legend');
    
    if (!isMobile && legendContainer) {
      legendContainer.classList.remove('hidden');
    } else if (legendContainer) {
      legendContainer.classList.add('hidden');
    }
  }
}