import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Fnewveterinary from "../../img/fondop.jpeg";

export const NewVeterinary = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [veterinary_name, setVeterinary_name] = useState("");
    const [address, setAdress] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [city, setCity] = useState("");
    const [email, setEmail] = useState("");
    const [web_url, setWeb_url] = useState("");
    const [img_url, setImg_url] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let uploadedImageUrl = null;

        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            const uploadRes = await fetch(`${process.env.BACKEND_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok || !uploadData.img_url) {
                setError("Error al subir la imagen.");
                return;
            }

            uploadedImageUrl = uploadData.img_url;
            setImg_url(uploadedImageUrl);
        }

        const response = await fetch(`${process.env.BACKEND_URL}/api/veterinaries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.token}`,
            },
            body: JSON.stringify({
                veterinary_name,
                address,
                phone_number,
                city,
                email,
                web_url,
                img_url: uploadedImageUrl
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("Protectora añadida correctamente, por favor espere...");
            setTimeout(() => navigate("/veterinarias"), 2000);
        } else {
            setError(data.message || "Error al crear protectora.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: `url(${Fnewveterinary})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "70vh",
            }}>
            <form
                className="container d-flex flex-column align-items-center justify-content-center"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-3">
                    <h2>Nueva veterinaria</h2>
                </div>
                <div>
                    <div className="input-group mb-3">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {file && <p className="text-white">Imagen lista para subir</p>}
                        {img_url && <img src={img_url} alt="Subida" style={{ maxWidth: "300px" }} />}
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Nombre veterinaria
                            <input
                                onChange={(e) => setVeterinary_name(e.target.value)}
                                type="text"
                                value={veterinary_name}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Dirección
                            <input
                                onChange={(e) => setAdress(e.target.value)}
                                type="text"
                                value={address}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Teléfono de contacto
                            <input
                                onChange={(e) => setPhone_number(e.target.value)}
                                type="text"
                                value={phone_number}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Ciudad
                            <input
                                onChange={(e) => setCity(e.target.value)}
                                type="text"
                                value={city}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Email
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                value={email}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Web
                            <textarea
                                onChange={(e) => setWeb_url(e.target.value)}
                                type="text"
                                value={web_url}
                                className="form-control"
                            />
                        </span>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
            </form>
        </div>
    );
};
