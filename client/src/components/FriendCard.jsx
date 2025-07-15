import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants/langaues';
import { Link } from 'react-router-dom';

export const getCountryFlag = (lang) => {
    if(!lang) return null


    const langLower = lang.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if(countryCode){
        return(
            <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={`${langLower} flag`}/>
        )
    }

    return null;


}

const FriendCard = ({friend}) => {
  return (
    <div className="friend-card-wrapper">
        <div className="friend-info">
            <img src={friend.profilePic} alt="profile pic" className='friend-profile-pic'/>
            <h3 className='friend-profile-fullname' >{friend.fullName}</h3>
        </div>
        <div className="friend-language">
            <span className='native-lang' >
                {getCountryFlag(friend.nativeLanguage)}
                <span>Native: {friend.nativeLanguage} </span>
            </span>
            <span className='learing-lang'>
                 {getCountryFlag(friend.learningLanguage)}
                <span>Native: {friend.LearningLanguage} </span>
            </span>
        </div>
        <Link to={`/chat/${friend._id}`} className='friend-card-button' >Message</Link>
    </div>
  )
}

export default FriendCard