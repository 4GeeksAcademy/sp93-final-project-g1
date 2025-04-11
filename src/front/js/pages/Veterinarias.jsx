import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import Fondovet from "../../img/fondovet.png";

export const Veterinarias = () => {
	const { store, actions } = useContext(Context);

	const host = process.env.BACKEND_URL;
	const rutaImagenes = host + "";



	useEffect(() => {
		actions.getVeterinary("all");
	}, []);


	return (

		<div className="container">
			<h1 className="text-center my-4">VETERINARIAS</h1>
			{store.userRole === "Admin" && (
				<Link to="/new-veterinary">
					<button className="btn btn-primary mb-2">Nueva veterinaria</button>
				</Link>
			)}
			<div className="row">
				{/* recorre el array contact usando la función map(); */}
				{/* loop through the contact array using the map() function; */}
				{store.veterinary.map((iterator) =>
					<div className="col-md-4 mb-4">
						<div className="card" >
							<div className="card-body">
								<h5 className="card-title mb-2 text-center">{iterator.veterinary_name}</h5>
								<img class="card-img-top" src={`${rutaImagenes}/${iterator.img_url}`} alt="Card image cap" />
								<h5 className="card-title mb-2">{iterator.city}</h5>
								<Link to="/vista-detalles" >
									<button type="button" className="btn btn-primary mb-2" onClick={(event) => actions.getVeterinary(iterator.id)} >Ver veterinaria</button>
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="text-center mt-5" style={{ backgroundImage: `url(${Fondovet})`, backgroundSize: "cover", height: "190vh" }}>
			</div>

		</div>
	);
};
