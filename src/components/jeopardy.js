import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { GlobalStyles } from "../styles";
//Conflux
import { useStateValue } from "react-conflux";
import { userContext } from "../conflux/userReducer";
import { SET_USER, SET_GAMES } from "../conflux/constants";
//Components
import Login from "./authentication/login";
import UserInfo from "./user/userInfo";
import GameView from "./game/gameView";
import NavBar from "./navigation/NavBar";
import Games from "./game/games";
import Dashboard from "./dashboard/Dashboard";
import Questions from "./questions/Questions";
//Firebase
require("firebase/firestore");
require("firebase/auth");
let firebase = require("firebase/app");
firebase.auth().useDeviceLanguage();
let db = firebase.firestore();

//Component
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
				console.log("Already signed in!", userProfile);
			} else {
				// No user is signed in.
				console.log("Not signed in!");
			}
		});
	}, [dispatch, state.userProfile.uid]);

	useEffect(() => {
		db.collection("games")
			.where("author", "==", state.userProfile.uid)
			.onSnapshot(function(snapshot) {
				// let changes = snapshot.docChanges();
				let update = [];
				snapshot.docs.forEach(doc => {
					let document = doc.data();
					document.id = doc.id;
					update.push(document);
				});
				update.sort(function(a, b) {
					let gameA = a.gameName.toLowerCase();
					let gameB = b.gameName.toLowerCase();
					if (gameA < gameB)
						//sort string ascending
						return -1;
					if (gameA > gameB) return 1;
					return 0; //default return value (no sorting)
				});
				dispatch({ type: SET_GAMES, payload: update });
			});
	}, [dispatch, state.userProfile.uid]);

	return (
		<>
			<GlobalStyles />
			<NavBar />
			<div className='body'>
				{state.userProfile.uid ? <Dashboard db={db} /> : <p>Please Login</p>}
			</div>
		</>
	);
}

export default Jeopardy;
