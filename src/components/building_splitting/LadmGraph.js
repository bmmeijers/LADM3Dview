import G6 from '@antv/g6';

/**
 * AntV G6 
 */
export class LadmGraph {
 
  constructor(htmlId) {
    this.myData = {
      nodes: [],
      edges: []
    }
    const container = document.getElementById(htmlId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    G6.registerNode("customNode", {
      draw(cfg, group) {
       
        const {label, title, size, color} = cfg;

        const keyShape = group.addShape('rect', {
          attrs: {
            x: -size[0] / 2,
            y: -(size[1] + 10) / 2,
            width: size[0], 
            height: size[1] + 10, 
            fill: color,
            stroke: '#5B8FF9', 
            radius: 4, 
          },
          draggable: true,
          capture: false, 
          name: 'rect-shape',
        });

        if (title) {
          
          group.addShape('text', {
            attrs: {
              text: title,
              x: -size[0] / 2 + 10,
              y: -(size[1] + 10) / 2 + 17,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#1',
              fontWeight: 'bold', 
            },
          });
        }

        if (label) {
          group.addShape('text', {
            attrs: {
              text: label,
              x: -size[0] / 2 + 10,
              y: -(size[1] + 10) / 2 + size[1],
              textAlign: 'left',
              // textBaseline: 'middle',
              fill: '#000000',
            },
          });
        }
        return keyShape;
      },
      getAnchorPoints() {
        return [
          [0, 0.5], 
          [1, 0.5], 
        ];
      },
    }, 'single-node'); 
    this.graph = new G6.Graph({
      container: htmlId,
      width,
      height,
      fitView: true,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      minZoom: 0.2,  
      maxZoom: 2.5,   
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'DL',
        ranksep: 50,
        nodesep: 5,
      },
      defaultNode: {
        size: [150, 100],
        type: 'rect',
        style: {
          lineWidth: 2,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
        },
      },
      nodeStateStyles: {
        hover: {
          fill: '#ffd666', 
          cursor: 'pointer',
        }
      },
      defaultEdge: {
        type: 'line',
        size: 2,
        color: '#FF',
      },
    });
    this.graph.data(this.myData);
    this.graph.render();
    
    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!this.graph || this.graph.get('destroyed')) return;
        if (!container || !container.clientWidth || !container.clientHeight) return;
        this.graph.changeSize(container.clientWidth, container.clientHeight);
      };
  }

  updateGraph(data) {
    this.graph.data(data);
    this.graph.render();
  }
}
