import { useRef } from "react";

import { shallow } from "zustand/shallow";
import useStore from "../store";

const selector = (state) => ({
  needToRenderJson: state.needToRenderJson,
  setNeedToRenderJson: state.setNeedToRenderJson,
});
function Sidebar() {
  const { needToRenderJson, setNeedToRenderJson } = useStore(selector, shallow);
  const textareaEl = useRef(null);
  
  // const defaultJson = {
  //   name: "John Doe",
  //   age: 30,
  //   email: "johndoe@example.com",
  //   address: {
  //     street: "123 Main St",
  //     city: "New York",
  //     country: "USA",
  //   },
  //   hobbies: ["reading", "playing guitar", "running"],
  //   projects: [
  //     {
  //       name: "Project A",
  //       status: "in progress"
  //     },
  //     {
  //       name: "Project B",
  //       status: "completed"
  //     }
  //   ],
  // };

  

  const jsonString = JSON.stringify(needToRenderJson, null, 2);

  
  const handleClick = () => {
    const jsonVal = textareaEl.current.value;
    setNeedToRenderJson(JSON.parse(jsonVal));
  };

  return (
    <div className="sidebar">
      <div className="sidebar__title-cont">
        <h1 className="sidebar__title-cont__title">JSON Visualizer</h1>
        <button
          className="sidebar__title-cont__render-btn"
          onClick={handleClick}
        >
          Run
        </button>
      </div>
      <textarea
        className="sidebar__text-cont"
        name=""
        id=""
        cols="30"
        rows="10"
        defaultValue={jsonString}
        ref={textareaEl}
      ></textarea>
    </div>
  );
}

export default Sidebar;
