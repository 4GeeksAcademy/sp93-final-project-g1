import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import emailjs from "emailjs-com";
import Fcontactform from "../../img/fondpformu.png";

export const ContactForm = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [comments, setComments] = useState("")
    const [animalShelterEmail, setanimalShelterEmail] = useState(store.correo);
    console.log(store.correo);

    const handleSubmit = (event) => {
        event.preventDefault()
        const templateParams = {
            name: name,
            email: email,
            email_protectora: store.correo,
            message: comments,
        };

        emailjs
            .send(
                "service_adlun34",       // reemplaza con tu Service ID
                "template_x5bo8xs",      // reemplaza con tu Template ID
                templateParams,
                "VHaGhIzd45DY-Oyqk"           // reemplaza con tu Public Key
            )
            .then((response) => {
                alert("Correo enviado con éxito");
                setName("");
                setEmail("");
                setComments("");
            })
            .catch((error) => {
                alert("Hubo un error al enviar el correo");
                console.error(error);
            });

    }
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(${Fcontactform})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <form className="container d-flex flex-column align-items-center justify-content-center" onSubmit={handleSubmit} style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div className="text-center">
                    <h2>Formulario de contacto</h2>
                </div>
                <div>
                    <div className="input-group mb-3">
                        <span className="text-white">Nombre
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ width: "600px" }} required />
                        </span>
                    </div>
                    <div className="input-group mb-3" >
                        <span className="text-white">Email
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" style={{ width: "600px" }} required />
                        </span>
                    </div>
                    <div className="input-group mb-3" >
                        <span className="text-white">Comentarios
                            <textarea type="text" value={comments} onChange={(e) => setComments(e.target.value)} className="form-control" style={{ width: "600px", height: "300px" }} required />
                        </span>
                    </div>
                    <div className="input-group mb-3 justify-content-center" >
                        <span>
                            <button type="submit" className="form-control btn btn-primary" required>Enviar</button>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
};
