import "./styles.css";
import { useState } from "react";
import CHECKBOX_META_DATA from "./Constants.js";

const CheckBoxesData = ({ data, checkedStatus, setCheckedStatus }) => {
  const handleOnChange = (isChecked, node) => {
    setCheckedStatus((prev) => {
      const newState = { ...prev, [node.id]: isChecked };
      const changeStatusOfChildren = (node) => {
        newState[node.id] = isChecked;
        node.children.forEach((child_node) => {
          changeStatusOfChildren(child_node);
        });
      };
      changeStatusOfChildren(node);
      const unCheckParent = (node) => {
        if (node.children.length === 0) {
          return newState[node.id] || false;
        }
        const allCheckedStatus = node.children.every((child) =>
          unCheckParent(child)
        );
        newState[node.id] = allCheckedStatus;
        return allCheckedStatus;
      };
      CHECKBOX_META_DATA.forEach((node) => {
        unCheckParent(node);
      });
      return newState;
    });
  };

  return (
    <>
      {data.map((node) => (
        <div key={node.id} style={{ marginLeft: "30px" }}>
          <input
            type="checkbox"
            checked={checkedStatus[node.id]}
            onChange={(e) => handleOnChange(e.target.checked, node)}
          />
          <span>{node.name}</span>
          {node.children && node.children.length > 0 && (
            <CheckBoxesData
              data={node.children}
              checkedStatus={checkedStatus}
              setCheckedStatus={setCheckedStatus}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default function App() {
  const [checkedStatus, setCheckedStatus] = useState({});
  return (
    <div className="App">
      <h3>Nested checkboxes</h3>
      <CheckBoxesData
        data={CHECKBOX_META_DATA}
        checkedStatus={checkedStatus}
        setCheckedStatus={setCheckedStatus}
      />
    </div>
  );
}
