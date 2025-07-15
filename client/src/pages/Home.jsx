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

        <div className="friends-card-wrapper">
          {loadingFriends ? (
            <div className="friends-loading-spinner">
              <div className="loading-spinner"></div>
              <p className="loading-text">Your Friend list is loading....</p>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="friend-card">
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
                  {hasRequestBeenSent ? 'Request Sent' : 'Send Friend Request'}
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
