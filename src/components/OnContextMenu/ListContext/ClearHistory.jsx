import React from "react";
import "../Oncontext.css";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function ClearHistory({ selectedUser }) {
  const currentUser = auth.currentUser
  const dispatch = useDispatch()

  const clearHistoryHandler = async () => {
    try{
      const chatType = selectedUser[1]?.userInfo ? 'user' : 'group'; 
      const userID = selectedUser[1]?.userInfo?.uid
      const members = selectedUser[1]?.members;
      const mutualChatId = selectedUser[0];

      dispatch(uiActions.setClickValue({
      type: 'ui',
      value: false
    }))

    await updateDoc(doc(db, "chats", mutualChatId), {
      messages: deleteField(),
    });

    if(chatType === 'user'){
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [mutualChatId + ".lastMessage"]: {
          text: "",
        },
        [mutualChatId + ".date"]: "",
      });
      
      await updateDoc(doc(db, "userChats", userID), {
        [mutualChatId + ".lastMessage"]: {
          text: "",
        },
        [mutualChatId + ".date"]: "",
      });
    }

    if(chatType === 'group'){
      await updateDoc(doc(db, "userGroups", currentUser.uid), {
        [mutualChatId + ".lastMessage"]: {
          text: "",
        },
        [mutualChatId + ".date"]: "",
      });

      for(let i = 0; i < members.length; i++){
        await updateDoc(doc(db, "userGroups", members[i].uid), {
          [mutualChatId + ".lastMessage"]: {
            text: "",
          },
          [mutualChatId + ".date"]: "",
        });
      }
    }
    
  }catch(err){console.log(err);}
  };
  
  return (
    <div className="clearHistory" onClick={()=>clearHistoryHandler()}>
      Clear history
    </div>
  );
}
