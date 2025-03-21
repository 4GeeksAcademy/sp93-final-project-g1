import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import LogoURL from "../../img/logo.jpeg";
import "../../styles/home.css";


export const Home = () => {
	

	return (
		<div className="text-center mt-5">
		
		
			<p>
				<img src={LogoURL} />
			</p>
						
		</div>
	);
};
