import React from "react";
import "./Profile.css";
import ListSection from "./listSection/ListSection";
import ChatSection from "./chatSection/ChatSection";
import Menu from "./menu/Menu";
import ViewContent from "./chatSection/MediaMessage/ViewContent";
import { useSelector } from "react-redux";
import ForwardList from "../UI/ForwardList";
import DoubleDelete from "../UI/DoubleDelete";
import About from "../UI/about/About";
import ChatTheme from "./menu/ChatTheme";
import NewGroup from './menu/NewGroup'
import AddMembers from "../UI/addMembers/AddMembers";
import NewChannel from './menu/newChannel'

export default function Profile() {
  const backDrop = useSelector((state) => state.ui.backDrop);
  const viewContnet = useSelector((state) => state.ui.viewContent);
  const forwardList = useSelector((state) => state.ui.forwardList);
  const doubleDelete = useSelector((state) => state.ui.doubleDelete);
  const about = useSelector((state) => state.ui.about);
  const chatTheme = useSelector(state=>state.menu.chatTheme)
  const newGroup = useSelector(state=>state.menu.newGroup);
  const newChannel = useSelector(state=>state.menu.newChannel);
  const addMembers = useSelector(state=>state.ui.addMembers);

  return (
    <div className="mainPage">
      {backDrop && <Menu />}
      <ListSection />
      <ChatSection />
      {about && <About />}
      {viewContnet && <ViewContent />}
      {forwardList && <ForwardList />}
      {doubleDelete && <DoubleDelete />}
      {chatTheme && <ChatTheme />}
      {newGroup && <NewGroup />}
      {addMembers && <AddMembers />}
      {newChannel && <NewChannel />}
    </div>
  );
}
