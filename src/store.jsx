import { applyEdgeChanges, applyNodeChanges } from "reactflow";

import { create } from "zustand";

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 0 },
  needToRenderJson: {
    property1: "value1",
    property2: {
      subProperty1: "value2",
      subProperty2: [1, 2, 3],
    },
    property3: [
      {
        name: "John",
        age: 30,
      },
      {
        name: "Jane",
        age: 28,
      },
    ],
    property4: {
      nestedProperty1: {
        nestedSubProperty: "value3",
        nestedSubObject: {
          subObjectProperty: "value5",
        },
      },
      nestedProperty2: "value4",
    },
    property5: [
      {
        name: "Alice",
        children: [
          {
            name: "Bob",
            children: [
              {
                name: "Charlie",
                children: [
                  {
                    name: "Dave",
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Eve",
        children: [],
      },
    ],
    property6: {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: {
                level6: {
                  level7: "value6",
                },
              },
            },
          },
        },
      },
    },
  },
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  setNodes: (nodes) => {
    set({ nodes: [...nodes] });
  },
  setEdges: (edges) => {
    set({ edges: [...edges] });
  },
  setNeedToRenderJson: (json) => {
    console.log(json);
    set({nodes:[], edges: [], needToRenderJson: { ...json } });
  },
}));

export default useStore;
