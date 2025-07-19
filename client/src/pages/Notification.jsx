import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstanace } from "../utils/axiosInstance";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendsRequests"],
    queryFn: async () => {
      const { data } = await axiosInstanace.get('/users/friend-request');
      return data;
    }
  })

  const { mutate: acceptReqsMutation, isPending } = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await axiosInstanace.put(`/users/friend-request/${requestId}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  })

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="notification-section">
      <div className="notification-panal">
        <h1 className="notification-heading">Notifications</h1>

        {isLoading ? (
          <div className="friends-loading-spinner">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading....</p>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="request-section">
                <div className="request-header">
                  <img src={assets.personIcon} alt="" className="request-header-icon" />
                  <h2 className="request-heading" >Friend Requests</h2>
                  <span className="notification-count" >{incomingRequests.length}</span>
                </div>
                <div className="incomingreqs-wrapper">
                  {incomingRequests.map((request) => (
                    <div key={request.sender._id} className="incomingreqs-card" >

                      <div className="incomingreqs-card-left">
                        <img src={request.sender.profilePic} alt="profile pic" />
                        <div className="incoming-person-info">
                          <h3 className="incoming-person-name" >{request.sender.fullName || 'John Morrison'}</h3>
                          <div className="incoming-person-langauages">
                            <span >Native: {request.sender.nativeLanguage}</span>
                            <span>Learning: {request.sender.learningLanguage}</span>
                          </div>
                        </div>
                      </div>

                      <button className="Accept-button"
                        onClick={() => acceptReqsMutation(request._id)}
                        disabled={isPending}
                      >Accept</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="incomingreqs-wrapper">
              {acceptedRequests.map((notification) => (
                <section className="request-section" >
                  <div className="request-header">
                    <img src={assets.personIcon} alt="" className="request-header-icon" />
                    <h2 className="request-heading" >New Connections</h2>
                  </div>
                  <div key={notification.recipient._id} className="incomingreqs-card" >

                    <div className="incomingreqs-card-left">
                      <img src={notification.recipient.profilePic} alt="profile pic" />
                      <div className="incoming-person-info">
                        <h3 className="incoming-person-name" >{notification.recipient.fullName || 'John Morrison'}</h3>
                        <p>{notification.recipient.fullName} accepted your friend request</p>
                      </div>
                    </div>

                    <button className="Accept-button"
                      onClick={() => navigate(`/chat/${notification.recipient._id}`)}
                      disabled={isPending}
                    >Message</button>
                  </div>
                </section>
                ))}
                </div>



            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="no-notification">
                <h2>No notifications yet</h2>
                <p>When you receive friend requests or messages, they'll appear here.</p>
              </div>
            )}

          </>
        )}

      </div>
    </div>
  )
}

export default Notification