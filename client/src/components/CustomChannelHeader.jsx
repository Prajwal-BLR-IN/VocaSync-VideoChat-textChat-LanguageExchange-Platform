import React from "react";
import { Avatar, useChannelStateContext, useChatContext } from "stream-chat-react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { assets } from "../assets/assets";

const CustomChannelHeader = ({handleVideoCall}) => {
  const { channel, members } = useChannelStateContext();
  const { client } = useChatContext();

  const otherMembers = Object.values(members).filter(
    (m) => m.user?.id !== client.user?.id
  );

  const otherUser = otherMembers.length ? otherMembers[0].user : null;

  const displayName = otherUser?.name || "Chat";
  const displayImage = otherUser?.image || undefined;
  const isOnline = otherUser?.online;

  // Format "last seen"
  let presenceText = "Offline";
  if (isOnline) {
    presenceText = "Online";
  } else if (otherUser?.last_active) {
    try {
      const lastSeen = formatDistanceToNowStrict(
        parseISO(otherUser.last_active.toString()),
        { addSuffix: true }
      );
      presenceText = `Last seen ${lastSeen}`;
    } catch (e) {
      // fallback in case date parsing fails
      presenceText = "Last seen recently";
    }
  }

  return (
    <div className="custom-header">

      <div className="left-custom-header">
      <Avatar image={displayImage} name={displayName} size={40} />
      <div className="custom-header-info">
        <div className="custom-header-title">{displayName}</div>
        <div className="custom-header-subtitle">{presenceText}</div>
        </div>
 
      </div>
        <div className="right-custom-header">
            <button onClick={handleVideoCall}  ><img src={assets.videoIcon} alt=""  className="video-call-btn" /></button>
        </div>

    </div>
  );
};

export default CustomChannelHeader