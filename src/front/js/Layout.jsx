import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import injectContext from "./store/appContext.js";
// Custom components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom pages or views
import { Home } from "./pages/Home.jsx";
import { Error404 } from "./pages/Error404.jsx";
import { Adopciones } from "./pages/Adopciones.jsx";
import { Donaciones } from "./pages/Donaciones.jsx";
import { Login } from "./pages/Login.jsx";
import { Noticias } from "./pages/Noticias.jsx";
import { Protectoras } from "./pages/Protectoras.jsx";
import { SitiosInteres } from "./pages/SitiosInteres.jsx";
import { SosAnimal } from "./pages/SosAnimal.jsx";
import { Tiendas } from "./pages/Tiendas.jsx";
import { Veterinarias } from "./pages/Veterinarias.jsx";
import { VeterinariasVistaDetalle } from "./pages/VeterinariasVistaDetalle.jsx";
import { ListadoNoticias } from "./pages/ListadoNoticias.jsx";
import { CrearNoticia } from "./pages/CrearNoticia.jsx";
import { DetalleNoticia } from "./pages/DetalleNoticia.jsx"
import { ProtectorasVistaDetalle } from "./pages/ProtectorasVistaDetalle.jsx"
import { NewVeterinary } from "./pages/NewVeterinary.jsx"


import { SignUp } from "./pages/SignUp.jsx";
import { NewAdoption } from "./pages/NewAdoption.jsx";
import { AdoptionDetails } from "./pages/AdoptionDetails.jsx";
import { ContactForm } from "./pages/ContactForm.jsx";
import { NewAnimalShelter } from "./pages/NewAnimalShelter.jsx";

const basename = process.env.BASENAME || "home";
console.log(basename);

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  

    // if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
 

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                     <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route element={<Home />} path="/home" />
                        <Route element={<Error404 />} path="*" />
                        <Route element={<Adopciones />} path="/adopciones" />
                        <Route element={<NewAdoption/>} path="/new-adoption"/>
                        <Route element={<AdoptionDetails/>} path="/adoption-details"/>
                        <Route element={<Donaciones />} path="/donaciones" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<SignUp/>} path="/sign-up" />
                        <Route element={<Noticias />} path="/noticias" />
                        <Route element={<ListadoNoticias />} path="/listado-noticias" />
                        <Route element={<CrearNoticia/>} path="/crear-noticia" />
                        <Route element={<DetalleNoticia />} path="/detalle-noticia" />
                        <Route element={<Protectoras />} path="/protectoras" />
                        <Route element={<SitiosInteres />} path="/sitios-interes" />
                        <Route element={<SosAnimal />} path="/sos-animal" /> 
                        <Route element={<Tiendas />} path="/Tiendas" />
                        <Route element={<Veterinarias />} path="/veterinarias" />
                        <Route element={<VeterinariasVistaDetalle />} path="/vista-detalles" />
                        <Route element={<ProtectorasVistaDetalle />} path="/animal-shelter-detail" />
                        <Route element={<ContactForm />} path="/contact-form"/>
                        <Route element={<NewAnimalShelter />} path="/new-animal-shelter" />
                        <Route element={<NewVeterinary />} path="/new-veterinary" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
