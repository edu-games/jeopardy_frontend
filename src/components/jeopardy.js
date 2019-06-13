import React, { useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';
import Games from './game/games';

import Login from './authentication/login';
import UserInfo from './user/userInfo';
import GameView from './game/gameView';

import { useStateValue } from 'react-conflux';
import { userContext } from '../conflux/userReducer';
import { SET_USER } from '../conflux/constants';

//Firebase
let firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');
// firebase.initializeApp(fbaseConfig);
let db = firebase.firestore();
firebase.auth().useDeviceLanguage();

function Jeopardy() {
    const [state, dispatch] = useStateValue(userContext);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                let userProfile = {
                    uid: user.uid,
                    email: user.email,
                    photo: user.photoURL,
                    name: user.displayName
                };
                // setUser(userProfile);
                dispatch({ type: SET_USER, payload: userProfile });
                console.log('Already signed in!');
            } else {
                // No user is signed in.
                console.log('Not signed in!');
            }
        });
    }, [dispatch, state.userProfile.uid]);

    const Links = () => {
        return (
            <>
                <NavLink
                    to="/user"
                    style={{
                        margin: '5px',
                        padding: '5px 10px',
                        textDecoration: 'None'
                    }}>
                    User
                </NavLink>
                <NavLink
                    to="/games"
                    style={{
                        margin: '5px',
                        padding: '5px 10px',
                        textDecoration: 'None'
                    }}>
                    Games
                </NavLink>
            </>
        );
    };

    return (
        <div>
            <Login />
            {state.userProfile.uid ? Links() : null}
            <Route path="/user" render={props => <UserInfo {...props} />} />
            <Route
                exact
                path="/games"
                render={props => <Games {...props} db={db} />}
            />
            <Route
                path="/games/:id"
                render={props => <GameView {...props} db={db} />}
            />
        </div>
    );
}

export default Jeopardy;
