// TreemapRenderer.js - Treemap visualization rendering logic
export class TreemapRenderer {
  constructor(manager) {
    this.manager = manager;
  }

  setupDimensions(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      this.manager.dimensions.width = container.clientWidth;
      this.manager.dimensions.height = container.clientHeight;
      
      // Setup resize listener
      const resizeObserver = new ResizeObserver(() => {
        this.manager.dimensions.width = container.clientWidth;
        this.manager.dimensions.height = container.clientHeight;
        if (this.manager.currentMode === 'treemap') {
          this.render();
        }
      });
      resizeObserver.observe(container);
    }
  }

  render() {
    if (!this.manager.currentRootNode || this.manager.dimensions.width === 0) return;
    
    const svg = d3.select('#treemap-svg');
    const { width, height } = this.manager.dimensions;
    
    // Setup SVG
    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .style('width', '100%')
       .style('height', '100%');

    // Setup scales
    this.manager.xScale.domain([this.manager.currentRootNode.x0, this.manager.currentRootNode.x1]).range([0, width]);
    this.manager.yScale.domain([this.manager.currentRootNode.y0, this.manager.currentRootNode.y1]).range([0, height]);

    // Clear previous
    svg.selectAll('*').remove();
    
    // Main treemap group
    const treemapG = svg.append('g').attr('class', 'treemap-group');
    
    // Determine nodes to render
    let nodeDataForBinding = [];
    const isCompanyDetailView = this.manager.currentRootNode.depth === 2;
    
    if (isCompanyDetailView) {
      nodeDataForBinding = [this.manager.currentRootNode];
      this.renderCompanyDetails(svg, this.manager.currentRootNode.data);
    } else if (this.manager.currentRootNode.depth === 1 || this.manager.currentRootNode.depth === 0) {
      nodeDataForBinding = this.manager.currentRootNode.children || [];
    }

    // Render nodes
    const nodes = treemapG.selectAll('g.node-group')
      .data(nodeDataForBinding, d => d.data.name + d.depth)
      .enter()
      .append('g')
      .attr('class', d => `node-group ${d.children ? 'cluster-node' : 'company-node'} depth-${d.depth}`)
      .attr('transform', d => `translate(${this.manager.xScale(d.x0)},${this.manager.yScale(d.y0)})`);

    // Add rectangles
    nodes.append('rect')
      .attr('class', 'node')
      .attr('width', d => Math.max(0, this.manager.xScale(d.x1) - this.manager.xScale(d.x0)))
      .attr('height', d => Math.max(0, this.manager.yScale(d.y1) - this.manager.yScale(d.y0)))
      .attr('fill', d => this.manager.colors[d.depth === 1 ? d.data.name : d.parent?.data.name] || '#cccccc')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // Add content (titles, logos, etc.)
    nodes.each((d, i, nodes) => {
      const g = d3.select(nodes[i]);
      const width = Math.max(0, this.manager.xScale(d.x1) - this.manager.xScale(d.x0));
      const height = Math.max(0, this.manager.yScale(d.y1) - this.manager.yScale(d.y0));
      
      if (d.children) {
        // Cluster title
        this.addClusterTitle(g, d, width, height);
      } else {
        // Company content
        this.addCompanyContent(g, d, width, height);
      }
      
      // Add click handler
      if (!isCompanyDetailView) {
        g.style('cursor', 'pointer')
         .on('click', () => this.manager.zoomIn(d));
      }
    });

    // Add zoom out click handler
    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        this.manager.zoomOut();
      }
    });
  }

  addClusterTitle(g, d, width, height) {
    const fontSize = Math.min(18, Math.max(9, width / 8));
    
    g.append('foreignObject')
     .attr('width', width)
     .attr('height', height)
     .attr('x', 0)
     .attr('y', 0)
     .style('opacity', width > 40 && height > 30 ? 1 : 0)
     .html(`
       <div xmlns="http://www.w3.org/1999/xhtml" style="
         width: 100%; height: 100%; display: flex; align-items: center; 
         justify-content: center; text-align: center; color: white; 
         font-weight: bold; font-size: ${fontSize}px; padding: 5px; 
         overflow: hidden; word-wrap: break-word; box-sizing: border-box;
       ">
         ${d.data.name}
       </div>
     `);
  }

  addCompanyContent(g, d, width, height) {
    const showLogo = width > 50 && height > 50 && d.data.logo;
    const showText = !showLogo && width > 30 && height > 20;
    
    if (showLogo) {
      const logoWidth = width * 0.6;
      const logoHeight = height * 0.5;
      
      g.append('image')
       .attr('href', d.data.logo)
       .attr('x', (width - logoWidth) / 2)
       .attr('y', height * 0.15)
       .attr('width', logoWidth)
       .attr('height', logoHeight)
       .attr('preserveAspectRatio', 'xMidYMid meet')
       .on('error', function() { this.style.opacity = 0; });
    }
    
    if (showText) {
      const fontSize = Math.min(16, Math.max(10, width / 10));
      
      g.append('foreignObject')
       .attr('width', width)
       .attr('height', height)
       .attr('x', 0)
       .attr('y', 0)
       .html(`
         <div xmlns="http://www.w3.org/1999/xhtml" style="
           width: 100%; height: 100%; display: flex; align-items: center; 
           justify-content: center; padding: 5px; box-sizing: border-box;
         ">
           <div style="
             color: white; font-weight: bold; font-size: ${fontSize}px; 
             text-align: center; overflow: hidden; text-overflow: ellipsis; 
             display: -webkit-box; -webkit-line-clamp: 3; 
             -webkit-box-orient: vertical; word-wrap: break-word;
           ">
             ${d.data.name}
           </div>
         </div>
       `);
    }
  }

  renderCompanyDetails(svg, company) {
    const { width, height } = this.manager.dimensions;
    
    const detailsG = svg.append('g').attr('class', 'company-details-group');
    detailsG.append('rect')
            .attr('class', 'details-background')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(0,0,0,0.9)');

    const foreignObject = detailsG.append('foreignObject')
                                 .attr('x', 0)
                                 .attr('y', 0)
                                 .attr('width', width)
                                 .attr('height', height);

    // Company details HTML
    foreignObject.html(`
      <div xmlns="http://www.w3.org/1999/xhtml" style="
        width: 100%; height: 100%; color: white; padding: 15px; 
        overflow-y: auto; box-sizing: border-box; 
        font-family: system-ui, sans-serif; display: flex; flex-direction: column;
      ">
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 1.25rem; font-weight: bold;">
            ${company.name}
          </h3>
          ${company.sector ? `<p style="margin: 0 0 10px 0; font-size: 0.875rem; opacity: 0.8;">Sector: ${company.sector}</p>` : ''}
        </div>
        
        ${company.logo ? `
          <div style="text-align: center; margin: 15px 0;">
            <img src="${company.logo}" alt="${company.name} logo" 
                 style="max-width: 80%; max-height: 150px; object-fit: contain;"
                 onerror="this.style.display='none'" />
          </div>
        ` : ''}
        
        <div style="margin-top: 10px;">
          ${company.activiteFr ? `
            <div>
              <h4 style="margin: 0 0 5px 0; font-size: 0.875rem; font-weight: 600;">Activity</h4>
              <p style="margin: 0 0 15px 0; font-size: 0.875rem;">${company.activiteFr}</p>
            </div>
          ` : ''}
          
          ${company.description && company.description !== company.activiteFr ? `
            <div>
              <h4 style="margin: 0 0 5px 0; font-size: 0.875rem; font-weight: 600;">Description</h4>
              <p style="margin: 0 0 15px 0; font-size: 0.875rem;">${company.description}</p>
            </div>
          ` : ''}
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            ${company.technologies ? `
              <div>
                <h4 style="margin: 0 0 5px 0; font-size: 0.875rem; font-weight: 600;">Technologies</h4>
                <p style="margin: 0; font-size: 0.875rem;">${company.technologies}</p>
              </div>
            ` : ''}
            
            ${company.date_creation ? `
              <div>
                <h4 style="margin: 0 0 5px 0; font-size: 0.875rem; font-weight: 600;">Founded</h4>
                <p style="margin: 0; font-size: 0.875rem;">${company.date_creation}</p>
              </div>
            ` : ''}
          </div>
          
          <div>
            <h4 style="margin: 0 0 5px 0; font-size: 0.875rem; font-weight: 600;">Links</h4>
            <div style="display: flex; gap: 15px; align-items: center; margin-top: 5px;">
              ${company.site_web ? `
                <a href="${company.site_web}" target="_blank" rel="noopener noreferrer" 
                   style="color: #93c5fd; text-decoration: none;">Website</a>
              ` : ''}
              ${company.linkedin ? `
                <a href="${company.linkedin}" target="_blank" rel="noopener noreferrer"
                   style="color: #93c5fd; text-decoration: none;">LinkedIn</a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `);
  }
}