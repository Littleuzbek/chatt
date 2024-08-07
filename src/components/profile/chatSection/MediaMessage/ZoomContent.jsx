import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CgZoomIn } from "react-icons/cg";
import { BiZoomOut } from "react-icons/bi";
import Backdrop from "../../../UI/Backdrop";
import defaultUser from '../../../../images/defaultUser.png'


export default function ZoomContent() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prev, setPrev] = useState({ x: 0, y: 0 });
  const [imgHeight, setImgHeight] = useState(false);
  const viewContnetValue = useSelector((state) => state.chat.viewContentValue);
  const imgRef = useRef(null);

  const ZoomInOut = (wheelValue) => {
    const zoomInInt = Math.trunc(scale);
    const zoomOutInt = (Math.round(scale * 100) / 100).toFixed(2);

    if (zoomInInt !== 7) {
      if (wheelValue.nativeEvent.wheelDelta > 0) {
        setScale(scale + 0.1);
      }
    }

    if (zoomOutInt !== "0.50") {
      if (wheelValue.nativeEvent.wheelDelta < 0) {
        setScale(scale - 0.1);
      }
    }
  };

  const ZoomControl = (method) => {
    const zoomInInt = Math.trunc(scale);
    const zoomOutInt = (Math.round(scale * 100) / 100).toFixed(2);

    if (zoomInInt !== 7) {
      if (method === "+") {
        setScale(scale + 0.5);
      }
    }
    if (zoomOutInt !== "0.50" && zoomOutInt > "0.50") {
      if (method === "-") {
        setScale(scale - 0.5);
      }
    }
  };

  useEffect(() => {
    const image = imgRef.current;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      if (scale !== 1 && scale > 1) {
        isDragging = true;
        prevPosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = { x: e.clientX, y: e.clientY };
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    image?.addEventListener("mousedown", handleMouseDown);
    image?.addEventListener("mousemove", handleMouseMove);
    image?.addEventListener("mouseup", handleMouseUp);

    return () => {
      image?.removeEventListener("mousedown", handleMouseDown);
      image?.removeEventListener("mousemove", handleMouseMove);
      image?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [imgRef, scale]);

  const dbClick =()=>{
    if(scale > 1){
      setScale(1)
    }
    if(scale === 1){
      setScale(3)
    }
  }

  return (
    <Fragment>
      <Backdrop />
      <div className={imgHeight ? "normalSize" : "overSize"}>
        <img
          src={viewContnetValue ? viewContnetValue : defaultUser}
          alt=""
          onClick={(e) => {e.stopPropagation()}}
          onWheel={(wheelValue) => ZoomInOut(wheelValue)}
          onDoubleClick={()=> dbClick()}
          onTouchStart={(e)=>{setPrev({x: e.touches?.[0].clientX, y: e.touches?.[0].clientY })}}
          onTouchMove={(e)=>{
            setPosition({x: e.touches?.[0].clientX - prev.x, y: e.touches?.[0].clientY - prev.y});
          }
        }
          style={{
            scale: `${scale}`,
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          ref={imgRef}
          draggable={false}
          onLoad={(e) => {
            if (e.target.clientHeight >= 1024) {
              setImgHeight(true);
            } else {
              setImgHeight(false);
            }
          }}
        />
        <div onClick={(e) => e.stopPropagation()} className="zoomControl">
          <BiZoomOut className="zoomOut" onClick={() => ZoomControl("-")} />
          <input
            type="range"
            id=""
            min={0.5}
            max={7}
            value={Number(scale)}
            onChange={(e) => setScale(Number(e.target.value))}
            onClick={(e) => setScale(Number(e.target.value))}
            onTouchMove={(e)=>setScale(Number(e.target.value))}
            onTouchStart={(e)=>setScale(Number(e.target.value))}
            step={0.1}
          />
          <CgZoomIn className="zoomIn" onClick={() => ZoomControl("+")} />
        </div>
      </div>
    </Fragment>
  );
}
