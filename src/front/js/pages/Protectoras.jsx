import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import Fondopr from "../../img/fprotectora.png";

export const Protectoras = () => {
	const { store, actions } = useContext(Context);

	const host = process.env.BACKEND_URL;
	const rutaImagenes = host + "";
	const [filter, SetFilter] = useState("");

	const changeFilter = (filter) => {
		SetFilter(filter);
	}
	const listarAnimalShelters = () => {

		actions.getAnimalShelter("all");
	}
	useEffect(() => {
		actions.getAnimalShelter("all");
	}, []);


	return (
		<div className="mt-2" style={{ backgroundImage: `url(${Fondopr})`, backgroundSize: "cover", height: "200vh" }}>
			<h1 className="text-center py-4">Protectoras</h1>
      					{store.userRole === "Admin" && (
								<Link to="/new-animal-shelter">
									<button className="btn btn-primary mb-2 mx-3">Nueva protectora</button>
								</Link>
							)}
			<div className="btn-group my-2 mx-5">
				<button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					Selecciona Ciudad
				</button>
				<ul className="dropdown-menu">
					<li ><a className="dropdown-item" href="#" onClick={() => changeFilter("")}>Todas</a></li>
					{store.animalShelter.map((iterator, index) => (
						<div key={iterator.id}>
							{/* Aquí va lo que quieras renderizar por cada 'iterator' */}
							<li key={index}><a className="dropdown-item" href="#" onClick={() => changeFilter(iterator.city)}>{iterator.city}</a></li>
						</div>
					))}
				</ul>
			</div>

			<div className="row mx-0">

				{/* recorre el array contact usando la función map(); */}
				{/* loop through the contact array using the map() function; */}
				{store.animalShelter
					.filter(shelter => filter === "" || shelter.city === filter)
					.map((iterator) => (
						<div key={iterator.id} className="col-md-4 mb-4">
							<div className="card">
								<div className="card-body">
									<h3 className="card-title mb-3 text-center">{iterator.shelter_name}</h3>
									<img className="card-img-top mb-2" style={{ width: '400px', height: '500px' }} src={`${rutaImagenes}/${iterator.img_url}`} alt="Card image cap"/>
									<h5 className="card-title mb-2">{iterator.city}</h5>
									<Link to="/animal-shelter-detail">
										<button type="button" className="btn btn-primary mb-2" onClick={() => actions.getAnimalShelter(iterator.id)}>Ver protectora</button>
									</Link>
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};
