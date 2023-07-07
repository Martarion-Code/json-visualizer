import { useCallback, useEffect, useLayoutEffect } from "react";
import "./App.css";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  Panel,
} from "reactflow";
import JsonVisNode from "./Custom Nodes/jsonVisNode";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { jsonVis: JsonVisNode }; 
const edgeTypes = {
  jsonVis: JsonVisEdge,
};

const defaultEdgeOpt = {type: 'jsonVis'}


import { shallow } from "zustand/shallow";

import ELK from "elkjs/lib/elk.bundled.js";

import Sidebar from "./components/Sidebar";
import useStore from "./store";
import convertJsonToTree from "./utils/convertJsonToTree";
import convertTreeToNodes from "./utils/convertTreeToNodes";

import "reactflow/dist/style.css";
import JsonVisEdge from "./Custom Edges/JsonVisEdge";

/**
 * Select which variable or func that will get used from store 
 * @param {*} state state from zustand store
 * @returns object that contains value from store
 */
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  viewport: state.viewport,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setViewport: state.setViewport,
  needToRenderJson: state.needToRenderJson,
});

const elk = new ELK(); 

//Elk options for layouting the tree
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.spacing.nodeNode": "150",
  "elk.edgeRouting": "SPLINES",
};

/**
 * 
 * @param {*} nodes array of nodes from store 
 * @param {*} edges array of edges from store
 * @param {*} options options from elkOptions. Used for layouting tree
 * @returns promises that contains array of nodes or edges that already get layouted or repositioned
 */
const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  console.log(isHorizontal)
  const graph = {
    id: "root",
    layoutOptions: options,
    //Passed array of nodes that contains target position and source position. The target position and source position change based on isHorizontal  
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      //Hardcode a width and height for node so that elk can use it when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  // console.log(graph);

  //Return promises
  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x` and `y` fields.
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function App() {
  //descruture variable and func that will get used from useStore
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    // onNodesChange,
    // onEdgesChange,
    needToRenderJson,
  } = useStore(selector, shallow);

  //calling instance for viewport to zoom to root node
  const { fitView } = useReactFlow();

  /**
   * @param {*} direction an object contains direction. for elkjs to know which direction layouting to use for the tree
   * @param {*} initialNodes array of nodes and edges [nodes, edges] .Using this because variable "nodes" from state still empty for the first time 
   */
  const onLayout = useCallback(
    ({ direction }, initialNodes = null) => {

      //Add direction to options for the direction of the tree
      const opts = { "elk.direction": direction, ...elkOptions };
      //initial nodes return [nodes, edges]
      console.log("render on ");
      const ns = initialNodes === null ? nodes : initialNodes[0];
      const es = initialNodes === null ? edges : initialNodes[1];
      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          
          //add layouted or repositioned nodes and edges to store, so that react flow will render the layouted or repositioned nodes and edges 
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

        }
      );
    },
    [nodes, edges]   //So that the useCallback will rememoize the nodes and edges variable if it values changed.
  );

  console.log(nodes);

  //It will render before "layout" phase happening when rendering page. So that the page will outputing layouted nodes and edges
  useLayoutEffect(() => {
    const nodeTree = convertJsonToTree(needToRenderJson); //to convert json to tree
    let convertedNodes = convertTreeToNodes(nodeTree, true); //to convert tree to nodes
    onLayout({ direction: "DOWN" }, convertedNodes); 

    //so that when needToRenderJson change, useLayoutEffect wil reexecute the callback. needToRenderJson change everytime user click run button in the page. The run button is in sidebar component.
  }, [needToRenderJson]);   

  //to zoom the viewport to the root nodes. nodes[0] is root node. everytime nodes and edges change, the callback reexecute and zoom the viewport to the root nodes 
  useEffect(() => {
    fitView({ nodes: [nodes[0], nodes[0]?.id], minZoom: 0.1, padding: 8 });
  }, [nodes, edges, fitView]);

  return (
    <>
      <div className="app-cont">
        <div
          className="react-flow-cont"
          style={{ width: "80vw", minHeight: "100vh" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            // onNodesChange={onNodesChange}
            // onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOpt}
          >
            <Background gap={30} color={'#373737'} variant={BackgroundVariant.Lines}></Background>
            <Controls showInteractive={false}></Controls>
            <Panel position="top-right" className="react-flow__panel-1">
              <button onClick={() => onLayout({ direction: "DOWN" })} className="panel__btn">
                vertical layout
              </button>

              <button onClick={() => onLayout({ direction: "RIGHT" })}>
                horizontal layout
              </button>
            </Panel>
          </ReactFlow>
        </div>
        <Sidebar></Sidebar>
      </div>
    </>
  );
}

export default App;
