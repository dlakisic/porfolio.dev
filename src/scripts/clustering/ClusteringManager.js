// ClusteringManager.js - Main clustering visualization logic
export class ClusteringManager {
  constructor() {
    this.data = null;
    this.currentMode = 'treemap';
    this.colors = {};
    this.visibleClusters = new Set();
    this.expandedClusters = new Set();
    this.dimensions = { width: 0, height: 0 };
    this.currentRootNode = null;
    this.initialHierarchy = null;
    this.previousRootNodeRef = null;
    this.xScale = null;
    this.yScale = null;
    this.breadcrumbAncestors = [];
  }

  async init() {
    try {
      // Load external libraries
      await Promise.all([
        this.loadScript('https://d3js.org/d3.v7.min.js'),
        this.loadScript('https://cdn.plot.ly/plotly-3.0.1.min.js')
      ]);

      // Initialize D3 scales after libraries are loaded
      this.xScale = d3.scaleLinear();
      this.yScale = d3.scaleLinear();
      
      // Load data and setup
      await this.loadData();
      this.calculateInitialHierarchy();
      
      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('clusteringReady', { 
        detail: { manager: this } 
      }));
      
    } catch (error) {
      console.error('Failed to initialize clustering:', error);
      window.dispatchEvent(new CustomEvent('clusteringError', { 
        detail: { error } 
      }));
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadData() {
    const response = await fetch('/data/mock-data.json');
    this.data = await response.json();
    
    // Extract colors and setup visible clusters
    this.colors = this.data.cluster_colors || {};
    this.data.children.forEach(cluster => {
      if (!this.colors[cluster.name]) {
        this.colors[cluster.name] = this.generateColor();
      }
      this.visibleClusters.add(cluster.name);
    });
  }

  generateColor() {
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  calculateInitialHierarchy() {
    if (!this.data) return;
    
    try {
      const hierarchy = d3.hierarchy(this.data)
        .sum(d => d.value || 1)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      const treemapLayout = d3.treemap().size([1000, 1000]);
      treemapLayout(hierarchy);
      
      this.initialHierarchy = hierarchy;
      this.currentRootNode = hierarchy;
      this.previousRootNodeRef = hierarchy;
    } catch (error) {
      console.error('Error calculating hierarchy:', error);
      this.initialHierarchy = this.createEmptyHierarchy();
      this.currentRootNode = this.initialHierarchy;
    }
  }

  createEmptyHierarchy() {
    const emptyData = { name: "empty", children: [] };
    const hierarchy = d3.hierarchy(emptyData).sum(() => 1);
    d3.treemap().size([1,1])(hierarchy);
    return hierarchy;
  }

  // Mode management
  switchMode(mode) {
    this.currentMode = mode;
    window.dispatchEvent(new CustomEvent('modeChanged', { 
      detail: { mode, manager: this } 
    }));
  }

  // Cluster visibility management
  toggleClusterVisibility(clusterName) {
    if (this.visibleClusters.has(clusterName)) {
      this.visibleClusters.delete(clusterName);
    } else {
      this.visibleClusters.add(clusterName);
    }
    
    window.dispatchEvent(new CustomEvent('clusterVisibilityChanged', {
      detail: { clusterName, isVisible: this.visibleClusters.has(clusterName), manager: this }
    }));
  }

  showAllClusters() {
    this.data.children.forEach(cluster => {
      this.visibleClusters.add(cluster.name);
    });
    window.dispatchEvent(new CustomEvent('allClustersShown', { detail: { manager: this } }));
  }

  hideAllClusters() {
    this.visibleClusters.clear();
    window.dispatchEvent(new CustomEvent('allClustersHidden', { detail: { manager: this } }));
  }

  // Cluster expansion management
  toggleClusterExpansion(clusterName) {
    if (this.expandedClusters.has(clusterName)) {
      this.expandedClusters.delete(clusterName);
    } else {
      this.expandedClusters.add(clusterName);
    }
    
    window.dispatchEvent(new CustomEvent('clusterExpansionChanged', {
      detail: { clusterName, isExpanded: this.expandedClusters.has(clusterName), manager: this }
    }));
  }

  // Navigation management
  zoomIn(node) {
    this.previousRootNodeRef = this.currentRootNode;
    this.currentRootNode = node;
    window.dispatchEvent(new CustomEvent('nodeChanged', { 
      detail: { node, manager: this } 
    }));
  }

  zoomOut() {
    if (this.currentRootNode && this.currentRootNode.parent) {
      this.previousRootNodeRef = this.currentRootNode;
      this.currentRootNode = this.currentRootNode.parent;
      window.dispatchEvent(new CustomEvent('nodeChanged', { 
        detail: { node: this.currentRootNode, manager: this } 
      }));
    }
  }

  navigateToNode(targetNode) {
    if (targetNode) {
      this.previousRootNodeRef = this.currentRootNode;
      this.currentRootNode = targetNode;
      window.dispatchEvent(new CustomEvent('nodeChanged', { 
        detail: { node: this.currentRootNode, manager: this } 
      }));
    }
  }

  // Utility methods
  getSortedClusters() {
    return [...this.data.children].sort((a, b) => b.children.length - a.children.length);
  }

  isClusterVisible(clusterName) {
    return this.visibleClusters.has(clusterName);
  }

  isClusterExpanded(clusterName) {
    return this.expandedClusters.has(clusterName);
  }

  getClusterColor(clusterName) {
    return this.colors[clusterName] || '#cccccc';
  }
}

// Initialize global clustering manager
window.clusteringManager = new ClusteringManager();