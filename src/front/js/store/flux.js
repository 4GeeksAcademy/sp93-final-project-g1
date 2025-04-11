import { Navigate } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {

	const host = process.env.BACKEND_URL;


	return {
		store: {
			message: null,
			isLogged: false,
			imageRoute: "../../img/protectoras/",
			selectedCategory: "",
			user_id: '1',
			sos_id: '',
			user: {},
			userRole:"",
			token: "",
			password: 'password',
			notice:[],
			selectedNews:[],
			animalShelter:[],
			animalShelterSelected:{},
			veterinary:[],
			veterinarySelected:{},
			adoptions: [],
			selectedAdoption:[],
						sosCase: [],
			//host: "https://playground.4geeks.com",
			selectedElement: {},
		
			
		},
		actions: {
			getMessage: async () => {
				const uri = `${host}/api/hello`
				const response = await fetch(uri)
				if (!response.ok) {
					console.log("Error:", response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
			},

			setUser: (newUser) => { setStore({ user: newUser }) },
			setNotice: (newNotice) => { setStore({ notice: newNotice }) },
			setAnimalShelter: (newAnimalShelter) => { setStore({ animalShelter: newAnimalShelter }) },		
			setAdoption: (newAdoption) => { setStore({ adoptions: newAdoption }) },
			setVeterinary: (newVeterinary) => { setStore({ veterinary: newVeterinary }) },
			setSosCase: (newSosCase) => { setStore({ sosCase: newSosCase }) },
			setDonation: (newDonation) => { setStore({ donation: newDonation }) },
			setStore: (newStore) => { setStore({ sosCase: newStore }) },
			
			setSelectedElements: (elemento) => { setStore({ selectedElement: elemento }) },
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setiIsEditing: (valor) => { setStore({ isEditing: valor }) },

			clearSelectedNews: () => {setStore({ selectedNews: {} })},
			  

			setSelectedCategory: (category) => {

				const store = getStore();
				const actions = getActions();

				setStore({ selectedCategory: category });

				actions.getElements(event);


			},

			
			login: async (dataToSend) => {
				
				const uri = `${host}/api/login`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				};
			
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error", response.status, response.statusText);
					return false
				}
			
				const data = await response.json();
				// sessionStorage.setItem("token", data.access_token);
				setStore({

					user: data.results.user_name,
					userRole: data.results.role,
					token: data.access_token,
					isLogged: true
				})
				

				localStorage.setItem("token", data.access_token);
				localStorage.setItem('user', JSON.stringify(data))
				return true
			},
			
			logout: async (event) => {


				const actions = getActions();

				setStore({ isLogged: false });
				setStore({ user: "" });
				setStore({ userRole: ""})


				const message = {
					text: `Se ha deslogueado con exito`,
					visible: true,
					background: 'warning'
				}

				actions.setAlert(message);
				

			},

	//////////////////////////// CREATE FUNCTIONS  /////////////////////////////////////////////////////////  

			createUser: async (user) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/api/sing-up`;
				const dataToSend = {
					email: user.email,
					password: user.password,
				}

				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},

					body: JSON.stringify(dataToSend)							
				}
				

				const response = await fetch(uri, options);

				if (!response.ok) {

					return
				}

				const data = await response.json();
				setStore({user: data.results});
				setStore({isLogged: "true"});
				Navigate("/home");


			},
			createNotice: async (notice) => {

				const store = getStore();
                const uri = `${host}/api/news`;
				const dataToSend = {
					user_id: store.user_id,
					title: notice.title,
					body: notice.body,
					status: notice.status,
					created_at: notice.created_at ?? new Date().toISOString(),
					importance_level: notice.importance_level,
					img_url: notice.img_url
				}

				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${store.token}`
					},
                    body: JSON.stringify(dataToSend)							
				};
				

				const response = await fetch(uri, options);

				if (!response.ok) {

					console.log("ERROR")
					return
				};

				
		 	const data = await response.json();
			console.log("Noticia creada con éxito:", data);
			// setStore({ notice: data.results });
            return true;
			
			},


			createAdoption: async (adoption) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/api/Adoptions`;
				const dataToSend = {
					user_id: store.user_id,
					status: adoption.status,
					is_active: adoption.is_active,
					how_old: adoption.how_old,
					spacie: adoption.spacie,
					race: adoption.race,
					sex: adoption.sex,
					unadopted_time: adoption.unadopted_time,
					province: adoption.province,
					description: adoption.description,
					image_url: adoption.image_url,
					adoption_priority: adoption.adoption_priority,

				}

				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},

					body: JSON.stringify(dataToSend)							
				}
				

				const response = await fetch(uri, options);

				if (!response.ok) {

					return
				}

				const data = await response.json();
				Navigate("/adoptions");
			//	setStore({adoption: data.results});

			},

			createDonation: async (donation) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/api/donations`;
				const dataToSend = {
					sos_id: store.sos_id,
					donation_date: donation.donation_date,
					is_public: donation.is_public,
					donnor_name: donation.donnor_name,
					donnor_ammount: donation.donnor_ammount,
					
				}

				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},

					body: JSON.stringify(dataToSend)							
				}
				

				const response = await fetch(uri, options);

				if (!response.ok) {

					return
				}

				const data = await response.json();
			//	setStore({donation: data.results});
			Navigate("/donations");


			},

			createSosCases: async (soscases) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/api/sos-cases`;
				const dataToSend = {
					user_id: store.user_id,
					image_url: soscases.image_url,
					province: soscases.province,
					specie: soscases.specie,
					description: soscases.spdescriptionacie,
					status: soscases.status,
					operation_cost: soscases.operation_cost,
					pending_ammount: soscases.pending_ammount,
					is_active: soscases.is_active,
										
				}

				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},

					body: JSON.stringify(dataToSend)							
				}
				

				const response = await fetch(uri, options);

				if (!response.ok) {

					return
				}

				const data = await response.json();
				Navigate("/sos-cases");
			// 	setStore({sosCase: data.results});


			},


				//////////////////////////// END OF CREATE FUNCTIONS  ///////////////////////////////////////////////////////// 




				//////////////////////////// GET FUNCTIONS  /////////////////////////////////////////////////////////  

				getUser: async (user) => {

				//	if (event) event.preventDefault();
	
	
				//	const store = getStore();
				//	const actions = getActions();
	
	
					const uri = `${host}/${user.id}`;
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("User not found");
						
						}
	
						return
					}
	
					const data = await response.json();
					setStore({user: data.results});
					setStore({isLogged: "true"});
				
					
	
				},
				

				getNotice: async (notice) => {

				
				//	const store = getStore();
				//	const actions = getActions();
				let uri = "";

				if (notice == "all"){

					 uri = `${host}/api/news`;
					

				} else { 
					 uri = `${host}/api/news/${notice}`;
					
				}

				
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("Notice not found");
						
						}
	
						return
					}
	
					const data = await response.json();

					if (notice === "all") {
						setStore({ notice: data.results });
					} else {
						setStore({ selectedNews: data.results });
					}
	
				},

				getAnimalShelter: async (shelter) => {
						
				
					const store = getStore();
					const actions = getActions();
					// const h = `https://curly-happiness-p9q77xgvq5736vr5-3001.app.github.dev`

					// const uri = `${host}/api/animal-shelters`;;
					//uri = `${host}/api/animal-shelters`;
					let uri = "";
						
	
					if (shelter == "all"){

						uri = `${host}/api/animal-shelters`;
						setStore({animalShelterSelected: ""});
   
				   } else { 
						uri = `${host}/api/animal-shelters/${shelter}`;
						setStore({animalShelter: []});
						
					   
				   }
   
						
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("Animal Shelter not found");
						
						}
	
						return
					}
	
					const data = await response.json();
				//	setStore({animalShelterSelected: data.results});
				

					if (shelter == "all"){

						setStore({animalShelter: data.results});
					//	setStore({animalShelterSelected: null});
					
   
				   } else { 
						setStore({animalShelterSelected: data.results});
						//setStore({animalShelter: []});
											   
				   }
				 
				
	
				},

				getAdoptions: async (adoptions) => {

					
					const store = getStore();
					const actions = getActions();

					let uri = "";

					if (adoptions == "all"){

						uri = `${host}/api/adoptions`;

					} else { 
						uri = `${host}/api/adoptions/${adoptions}`;
					}
	
		
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("Adoption not found");
						
						}
	
						return
					}
	
					const data = await response.json();
					if (adoptions === "all") {
						setStore({ adoptions: data.results });
					} else {
						setStore({ selectedAdoption: data.results });
					}
				
	
				},

				getSosCase: async (event) => {

					if (event) event.preventDefault();
	
	
					const store = getStore();
					const actions = getActions();
	
	
					const uri = `${host}/api/sos-case/${store.sosCase.id}`;
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("SoS Case not found");
						
						}
	
						return
					}
	
					const data = await response.json();
					setStore({sosCase: data.results});
				
	
				},

				getVeterinary: async (veterinary) => {

					const store = getStore();
					const actions = getActions();
					// const h = `https://curly-happiness-p9q77xgvq5736vr5-3001.app.github.dev`

					// const uri = `${host}/api/animal-shelters`;;
					//uri = `${host}/api/animal-shelters`;
					let uri = "";
						
	
					if (veterinary == "all"){

						uri = `${host}/api/veterinaries`;
						setStore({veterinarySelected: ""});
   
				   } else { 
						uri = `${host}/api/veterinaries/${veterinary}`;
						setStore({veterinary: []});
						
					   
				   }
   
						
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("Veterinary not found");
						
						}
	
						return
					}
	
					const data = await response.json();
				//	setStore({animalShelterSelected: data.results});
				

					if (veterinary == "all"){

						setStore({veterinary: data.results});
					//	setStore({animalShelterSelected: null});
					
   
				   } else { 
						setStore({veterinarySelected: data.results});
						//setStore({animalShelter: []});
											   
				   }
				 
				
	
				},

				getDonation: async (event) => {

					if (event) event.preventDefault();
	
	
					const store = getStore();
					const actions = getActions();
	
	
					const uri = `${host}/api/donations/${store.donation.id}`;
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("Veterinary not found");
						
						}
	
						return
					}
	
					const data = await response.json();
					setStore({donation: data.results});
				
	
				},



			

				//////////////////////////// END OF GET FUNTIONS  ///////////////////////////////////////////////////////// 


		}
	}
};

export default getState;
