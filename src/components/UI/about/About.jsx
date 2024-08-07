import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { auth, db } from "../../../firebase";
import { FaAngleDown } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";
import { doc, onSnapshot } from "firebase/firestore";
import { chatActions } from "../../../redux/ChatSlice";
import AboutMedia from "./AboutMedia";
import defaultUser from "../../../images/defaultUser.png";
import defaultUsers from "../../../images/defaultUsers.jpg";
import { v4 as uuid } from "uuid";
import "./About.css";
import "./AboutNight.css";
import './AboutMini.css'
import AboutsGroupAndChannel from "./AboutsGroupAndChannel";
import AboutUser from "./AboutUser";

export default function About() {
  const [chosenChat, setChosenChat] = useState(false);
  const [catogory, setCatogory] = useState("img");
  const [section, setSection] = useState(false);
  const [toggleMember, setToggleMember] = useState(false);
  const [imgError,setImgError] = useState(false)
  const user = useSelector((state) => state.chat.user);
  const nightMode = useSelector(state => state.menu.nightMode);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  const aboutImg = user.type === 'user'? defaultUser : defaultUsers;

  useEffect(() => {
    const FetchUserData = () => {
      const fetchUserData = onSnapshot(
        doc(db, "users", user?.value?.uid),
        (doc) => {
          if (doc.data()) {
            setChosenChat(doc.data());
          }
        }
      );

      const fetchGroupData = onSnapshot(
        doc(db, "userGroups", currentUser.uid),
        (doc) => {
          if (doc.data()) {
            const a = Object.entries(doc.data());
            for (let i = 0; i < a.length; i++) {
              a[i]?.[0] === user?.value?.uid && setChosenChat(a[i][1]);
            }
          }
        }
      );

      const fetchChannelData = onSnapshot(
        doc(db, "userChannels", currentUser.uid),
        (doc) => {
          if (doc.data()) {
            const a = Object.entries(doc.data());
            for (let i = 0; i < a.length; i++) {
              a[i]?.[0] === user?.value?.uid && setChosenChat(a[i][1]);
            }
          }
        }
      );

      return () =>
        user.type === "user"
          ? fetchUserData()
          :( user.type !== "group"
          ? fetchChannelData()
          : fetchGroupData());
    };
    user?.value?.uid && FetchUserData();
  }, [user, currentUser.uid]);

  const ViewContentHandler = (e, type, header) => {
    if (!header) {
      dispatch(chatActions.setViewContentValue(e.target.currentSrc));
    } else {
      dispatch(chatActions.setViewContentValue(e));
    }

    if (document.pictureInPictureElement) {
      document?.exitPictureInPicture();
      dispatch(uiActions.setViewContent(false));
    }

    if (type === "img") {
      dispatch(chatActions.setContentType("Image"));
    }
    if (type === "video") {
      dispatch(chatActions.setContentType("Video"));
    }

    setTimeout(() => {
      dispatch(uiActions.setViewContent(true));
    }, 100);
  };

  return (
    <Fragment>
      <div
        className="aboutChosenUser"
        onClick={() => dispatch(uiActions.setAbout(false))}
      >
        <div
          className={nightMode? 'chosenUserInfoNight' : "chosenUserInfo"}
          onClick={(e) => e.stopPropagation()}
          style={toggleMember ? { height: "100%"} : {}}
        >
          <div className={section ? 'noImg' : `${toggleMember ? "smallContainer" : ''}`}>
            <img
            className={toggleMember ? "smallImg" : ''}
              src={imgError ? aboutImg :
                chosenChat?.groupInfo?.photoURL ||
                chosenChat?.channelInfo?.photoURL ||
                chosenChat?.photoURL ||
                aboutImg
              }
              alt=""
              onClick={() =>
                (chosenChat?.groupInfo?.photoURL || chosenChat?.channelInfo?.photoURL || chosenChat?.photoURL) &&
                ViewContentHandler(
                  chosenChat?.groupInfo?.photoURL || chosenChat?.channelInfo?.photoURL || chosenChat?.photoURL,
                  "img",
                  "header"
                )
              }
              onError={()=>setImgError(true)}
            />
          <CgClose
            className={toggleMember? "closeAboutt relocation" : 'closeAboutt'}
            onClick={() => dispatch(uiActions.setAbout(false))}
          />
          </div>
          {section || (
            <div className={nightMode? 'infONight' : "infO"}>
              {user.type !== "user" ? (
                  <AboutsGroupAndChannel
                    chosenUserVal={chosenChat}
                    onSetToggleMember={setToggleMember}
                    toggleMemberVal={toggleMember}
                    existingMembers={chosenChat?.members}
                    />
              ) : (
                <AboutUser chosenUserVal={chosenChat} />
              )}
              <FaAngleDown
                className={nightMode? 'toMediaNight' : "toMedia"}
                onClick={() => {
                  setToggleMember(false);
                  setSection(true);
                }}
              />
            </div>
          )}
          {section && (
            <div className="mediA">
              <AboutMedia
                key={uuid()}
                onSetCatogry={setCatogory}
                onSetSection={setSection}
                onViewContentHandler={ViewContentHandler}
                categoryVal={catogory}
              />
            </div>
          )}
          <CgClose
            className="closeAbout"
            onClick={() => dispatch(uiActions.setAbout(false))}
          />
        </div>
      </div>
    </Fragment>
  );
}
