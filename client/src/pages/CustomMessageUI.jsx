// CustomMessageUI.jsx
import React from 'react';
import {
  MessageSimple,
  useMessageContext,
  Avatar,
  MessageText,
  MessageTimestamp,
} from 'stream-chat-react';

export const CustomMessageUI = (props) => {
  const { message, isMyMessage } = useMessageContext();

  return (
    <MessageSimple
      {...props}
      MessageContent={() => (
        <div className="custom-message-content">
          <div className="custom-message-header">
            <Avatar
              image={message.user?.image}
              name={message.user?.name}
              size={24}
            />
            <span className="custom-message-username">
              {message.user?.name}
            </span>
          </div>
          <MessageText />
          <div className="custom-message-footer">
            <MessageTimestamp />
          </div>
        </div>
      )}
    />
  );
};
