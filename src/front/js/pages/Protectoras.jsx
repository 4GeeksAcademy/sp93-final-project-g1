import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import Fondopr from "../../img/fprotectora.jpeg";

export const Protectoras = () => {
	const { store, actions } = useContext(Context);

	const host = process.env.BACKEND_URL;
	const rutaImagenes = host + "";
	const [filter, SetFilter] = useState("");
	console.log(store.animalShelterSelected)

	const changeFilter = (filter) => {
		SetFilter(filter);
	}
	const listarAnimalShelters = () => {

		actions.getAnimalShelter("all");	
	//	console.log(store.Protectoras) 
	  }
	 //  actions.getAnimalShelter("all");
	useEffect(() => {
		actions.getAnimalShelter("all");
	}, []);


	return (
		<div className="container" style={{ backgroundImage: `url(${Fondopr})`, backgroundSize: "cover", height: "200vh" }}>
			<h1 className="text-center my-4">PROTECTORAS</h1>
      					{store.userRole === "Admin" && (
								<Link to="/new-animal-shelter">
									<button className="btn btn-primary mb-2">Nueva protectora</button>
								</Link>
							)}
			<div className="btn-group my-2">
						<button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Selecciona Ciudad
						</button>
						<ul className="dropdown-menu">
						{store.animalShelter.map((iterator, index) => (
								<div key={index}>
									{/* Aquí va lo que quieras renderizar por cada 'iterator' */}
									<li key={index}><a className="dropdown-item" href="#" onClick={() => changeFilter(iterator.city)}>{iterator.city}</a></li>
								</div>
						))}
						</ul>
			</div>

		<div className="row">
					  
				{/* recorre el array contact usando la función map(); */}  
				{/* loop through the contact array using the map() function; */}
				{store.animalShelter
									.filter(shelter => filter === "" || shelter.city === filter)
									.map((iterator, index) =>
				<div className="col-md-4 mb-4">				   
						{ <div className="card" >								
								<div className="card-body">
									<h5 className="card-title mb-2 text-center">{iterator.shelter_name}</h5>
									<img class="card-img-top" src={`${rutaImagenes}/${iterator.img_url}`} alt="Card image cap"/>
									<h5 className="card-title mb-2">{iterator.city}</h5>
								
																						
									<Link to="/animal-shelter-detail" >
												<button type="button" className="btn btn-primary mb-2" onClick={(event) => actions.getAnimalShelter(iterator.id)} >Ver protectora</button>
									</Link>
									
								{/*} 	<button 
										className="btn btn-outline-warning"
										onClick={() => actions.addFavorite(iterator, store.selectedCategory)}
									>
										<i className="fas fa-heart"></i> Add to Favorites
										</button>
								*/}	
								
								</div>
							</div>}	
				</div>
					)}
			</div>
		</div>
	);
};
