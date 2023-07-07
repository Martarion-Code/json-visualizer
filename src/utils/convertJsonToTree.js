import { nanoid } from "nanoid/non-secure";

const jsonToTree = (data, newNode, isRoot = false) => {
    const node = {
      id: nanoid(),
      key: "",
      value: {},
      position: { x: 0, y: 0 },
      parentId: newNode.id,
      children: [],
    };

    Object.entries(data).forEach(([key, value]) => {
    
      if (
        typeof value !== "object" &&
        
        !Array.isArray(value)
      ) {
        if(isRoot == true){
          newNode.key = key;
          newNode.value[key] = value; 
        }else{
          node.key = newNode.key + '-children';
          node.value[key] = value;
        }
        
      } else if ( Array.isArray(value)) {
        const valObjectFind = value.find((val) => typeof val === "object");

        if (valObjectFind) {
          const childNode = {
            id: nanoid(),
            key: key,
            value: key,
            position: { x: 0, y: 0 },
            parentId: (isRoot) ? newNode.id :  node.id,
            children: [],
          };
          value.forEach((valueFromArray) =>{
            if(typeof valueFromArray === 'object'){
              jsonToTree(valueFromArray, childNode);
            }else{
              const childNodeForPropertyWithValueArray = {
                id: nanoid(),
                key: childNode.key + '-children',
                value: {},
                position: { x: 0, y: 0 },
                parentId: childNode.id,
                children: [],
              }

              childNodeForPropertyWithValueArray.value = valueFromArray;
              childNode.children.push(childNodeForPropertyWithValueArray);
            }
          })
          if(isRoot){
            newNode.children.push(childNode);
          }else{
            node.children.push(childNode);
          }
        } else {
          const childNodeAddition = {
            id: nanoid(),
            key: "",
            value: {},
            position: { x: 0, y: 0 },
            parentId: node.id,
            children: [],
          };
          childNodeAddition.key = key;
          childNodeAddition.value = key;
          for (let i = 0; i < value.length; i++) {
            const childChildNode = {
              id: nanoid(),
              key: key + "-child",
              value: {},
              position: { x: 0, y: 0 },
              parentId: childNodeAddition.id,
              children: [],
            };
            childChildNode.value = value[i];
            childNodeAddition.children.push(childChildNode);
          }
          // newNode.children.push(childNodeAddition);
          node.children.push(childNodeAddition);
        }
      } else {
        const childNode = {
          id: nanoid(),
          key: key,
          value: key,
          position: { x: 0, y: 0 },
          parentId: (isRoot) ? newNode.id : node.id,
          children: [],
        };
        
        jsonToTree(value, childNode);
        if(isRoot){
          newNode.children.push(childNode);
        }else{
          node.children.push(childNode);
        }
      }
     
    });
    if(isRoot !== true){
      newNode.children.push(node);
    }else{
      newNode.key = 'root'
    }
    return newNode;
  }

  
  function convertJsonToTree(json){

    const rootNode = {
        id: nanoid(),
        key: "root",
        value: {},
        position: { x: 0, y: 0 },
        parentId: "root",
        children: [],
      };

      jsonToTree(json, rootNode, true);
      return rootNode;
  }


  export default convertJsonToTree;