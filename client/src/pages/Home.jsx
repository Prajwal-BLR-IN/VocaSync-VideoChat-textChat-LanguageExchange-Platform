import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { axiosInstanace } from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import FriendCard, { getCountryFlag } from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import NoRecommenedUserFound from '../components/NoRecommenedUserFound';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const Home = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await axiosInstanace.get('/users/friends');
      return data;
    }
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosInstanace.get('/users');
      return data;
    }
  });

  const { data: outgoingFriendReqs = [], isLoading: loadingOutgoingFriendReqs } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: async () => {
      const { data } = await axiosInstanace.get('/users/outgoing-friend-request');
      return data;
    }
  });

  const { mutate: sendFriendReqsMutation, isPending } = useMutation({
    mutationFn: async (userID) => {
      const { data } = await axiosInstanace.post(`/users/friend-request/${userID}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] })
  });

  useEffect(() => {
    const outgoingIDs = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIDs.add(req.recipient._id);
      });
      setOutgoingRequestIds(outgoingIDs);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="home-wrapper">
      <div className="friends-panal">
        <div className="friends-panal-header">
          <h2 className="home-heading">Your Friends</h2>
          <div className="your-friend-wrapper">
            <img src={assets.friendsIcon} alt="friends" />
            <Link to="/notifications">Friend Requests</Link>
          </div>
        </div>

        <div>
          {loadingFriends ? (
            <div className="friends-loading-spinner">
              <div className="loading-spinner"></div>
              <p className="loading-text">Your Friend list is loading....</p>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="recommendedUser-wrapper">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="recommendedUser-panal">
        <div className="recommendedUser-panal-header">
          <h2 className="home-heading">Meet New Learners</h2>
          <p className="home-paragraph">
            Discover perfect language exchange partners based on your profile
          </p>
        </div>
      </section>

      {loadingUsers ? (
        <div className="friends-loading-spinner">
          <div className="loading-spinner"></div>
          <p className="loading-text">Recommended users loading....</p>
        </div>
      ) : recommendedUsers.length === 0 ? (
        <NoRecommenedUserFound />
      ) : (
        <div className="recommendedUser-wrapper">
          {recommendedUsers.map((user) => {
            const hasRequestBeenSent = outgoingRequestIds.has(user._id);

            return (

              <div key={user._id} className="friend-card-wrapper">
                <div className="friend-info">
                  <img
                    src={user.profilePic}
                    alt="profile pic"
                    className="friend-profile-pic"
                  />
                  <div className="name-location-info">
                    <h3 className="friend-profile-fullname">{user.fullName}</h3>
                    <div className="location">
                      <img src={assets.locationIcon} alt="location icon" />
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>

                <div className="friend-language">
                  <span className="native-lang lang-wrapper ">
                    <span>{getCountryFlag(user.nativeLanguage)}</span>
                    <span>{'  '}Native: {capitalize(user.nativeLanguage)}</span>
                  </span>
                  <span className="learning-lang lang-wrapper">
                    {getCountryFlag(user.learningLanguage)}
                    <span>{'  '}Learning: {capitalize(user.learningLanguage)}</span>
                  </span>
                </div>

                {user.bio && <p className="bio">{user.bio}</p>}

                <button
                  className={`${hasRequestBeenSent ? 'btn-disable' : 'btn-primary'}`}
                  onClick={() => sendFriendReqsMutation(user._id)}
                  disabled={hasRequestBeenSent || isPending}
                >
                  {hasRequestBeenSent ? (
                    <div className="request-sent">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q32 0 62-6t58-17l60 61q-41 20-86 31t-94 11Zm280-80v-120H640v-80h120v-120h80v120h120v80H840v120h-80ZM424-296 254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
                      <span>Request Sent</span>
                    </div>
                  ) : (
                    <div className='send-request'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>
                      <span>Send Friend Request</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
