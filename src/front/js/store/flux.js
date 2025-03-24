const getState = ({ getStore, getActions, setStore }) => {

	const host = process.env.BACKEND_URL;

	return {
		store: {
			message: null,
			isLogged: false,
			selectedCategory: "",
			user: 'hector',
			user_id: '1',
			sos_id: '',
			password: 'password',
			notice:{},
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
			setSelectedElements: (elemento) => { setStore({ selectedElement: elemento }) },
			setIsLogged: (value) => { setStore({ isLogged: value }) },
			setiIsEditing: (valor) => { setStore({ isEditing: valor }) },

			setSelectedCategory: (category) => {

				const store = getStore();
				const actions = getActions();

				setStore({ selectedCategory: category });

				actions.getElements(event);


			},

			getAllElements: async (event) => {

				event.preventDefault();


				const store = getStore();
				const actions = getActions();




				const uri = `${host}/${store.selectedCategory}`;

				
				const options = {
					method: 'GET'
				}

				const response = await fetch(uri, options);

				if (!response.ok) {

					return
				}

				const data = await response.json();
				setStore({ elements: data.results });

			},

			login: async (dataToSend) => {
				
				const endpoint = "api/login";
				const uri = `${host}/${endpoint}`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ dataToSend })
				};
			
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error", response.status, response.statusText);
					return false;
				}
			
				const data = await response.json();
				// sessionStorage.setItem("token", data.access_token);
				setStore({
					user: data.result.first_name,
					isLogged: true,
					alert: {text: data.message, visible: true, background: 'success'}
			})
				localStorage.setItem("token", data.access_token);
				return true;

			},
			
			logout: async (event) => {


				const actions = getActions();

				setStore({ isLogged: false });
				setStore({ user: "" });


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

				const uri = `${host}/${store.user}`;
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


			},
			createNotice: async (notice) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/${store.notice}`;
				const dataToSend = {
					user_id: store.user_id,
					title: notice.title,
					body: notice.body,
					status: notice.status,
					created_at: notice.created_at,
					importance_level: notice.importance_level,
					img_url: notice.img_url
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


			},

			createAdoption: async (adoption) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/${store.adoption}`;
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


			},

			createDonation: async (donation) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/${store.donation}`;
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


			},

			createSosCases: async (soscases) => {


				const store = getStore(); // Use getStore(); to use "store" datas. 

				const uri = `${host}/${store.soscases}`;
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


			},


				//////////////////////////// END OF CREATE FUNCTIONS  ///////////////////////////////////////////////////////// 




				//////////////////////////// GET FUNCTIONS  /////////////////////////////////////////////////////////  

				getUSer: async (event) => {

					if (event) event.preventDefault();
	
	
					const store = getStore();
					const actions = getActions();
	
	
					const uri = `${host}/${store.user}`;
	
					const options = {
						method: 'GET'
					}
	
					const response = await fetch(uri, options);
	
					if (!response.ok) {
						if (response.status == "404") {
							console.log("usuario no encontrado");
							actions.createUser(store.user);
	
						}
	
						return
					}
	
					const data = await response.json();
					
	
				},
			

				//////////////////////////// END OF GET FUNTIONS  ///////////////////////////////////////////////////////// 


		}
	}
};

export default getState;
