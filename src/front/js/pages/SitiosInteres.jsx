import React, { useContext } from "react";
import { Context } from "../store/appContext.js";

export const SitiosInteres = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>SITIOS DE INTERES</h1>	
						
		</div>
	);
};
