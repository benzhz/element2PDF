import {  Modal,List } from 'antd';
import Draggable from 'react-draggable';
import React, { useRef, useState } from 'react';

const AddLogModal = (props) => {
  const { value, onSave, onCancel } = props;
  const [open] = useState(true);
  const [mask] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <Modal
        wrapClassName={"zrjCSS"}
        width={400}
        style={{
          position: "absolute",
          top: "calc(100vh - 490px)" ,
          right: "10px"
        }}
        getContainer={false}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Selected text
          </div>
        }
        open={open}
        mask={mask}
        okText="Completed" 
        onOk={onSave}
        onCancel={onCancel}
        maskClosable={false}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div style={{height:200,overflowY:"auto"}}>
        <List
          size="small"
          bordered
          dataSource={value}
          renderItem={(item) => <List.Item>{item.text}</List.Item>}
        />
        </div>
      </Modal>
    </>
  );
};
export default AddLogModal;
