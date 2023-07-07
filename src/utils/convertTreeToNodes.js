import { nanoid } from "nanoid/non-secure";

let nodes = [];
let edges = [];

function addRootNode(node) {
  const newNode = {
    id: node.id,
    data: { label: node.value },
    position: { x: 0, y: 0 },
    type: 'jsonVis',
  };

  nodes = [...nodes, newNode];
}

function addChildNode(node, parentNode) {
  const newNode = {
    id: node.id,
    data: {
      label:
        typeof node.value === "string" || typeof node.value === "number"
          ? node.value
          : node.value,
    },
    type: 'jsonVis',
    position: { x: 0, y: 0 },
    parent: parentNode.id,
  };
  const newEdge = {
    id: nanoid(),
    source: `${parentNode.id}`,
    target: `${node.id}`,
  };

  nodes = [...nodes, newNode];
  edges = [...edges, newEdge];
}

function traverseNodeChild(arrayOfNode, parentNode) {
  if (arrayOfNode.length <= 0) {
    return;
  }
  arrayOfNode.forEach((node) => {
    addChildNode(node, parentNode);
    if (node.children.length > 0) {
      traverseNodeChild(node.children, node);
    }
  });
}

function convertTreeToNodes(nodeTree, isRoot = false) {
  if (isRoot === true) {
    nodes = [];
    edges = [];
    addRootNode(nodeTree);
    convertTreeToNodes(nodeTree);
} else {
    traverseNodeChild(nodeTree.children, nodeTree);
  }

  return [nodes, edges];
}

export default convertTreeToNodes;

// export {nodes, edges}
