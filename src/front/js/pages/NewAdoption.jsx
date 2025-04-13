import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Fondologin from "../../img/fondo2.png";

export const NewAdoption = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [img_url, setImg_url] = useState("");
    const [how_old, setHow_old] = useState("");
    const [specie, setSpecie] = useState("");
    const [race, setRace] = useState("");
    const [sex, setSex] = useState("");
    const [province, setProvince] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [file, setFile] = useState(null);

    const sexLabels = {
        Male: "Macho",
        Female: "Hembra"
    };

    const specieLabels = {
        Dog: "Perro",
        Cat: "Gato",
        Other: "Otros"
    };

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
            console.log(uploadData);

            if (!uploadRes.ok || !uploadData.img_url) {
                setError("Error al subir la imagen.");
                return;
            }

            uploadedImageUrl = uploadData.img_url;
            setImg_url(uploadedImageUrl);
        }

        const response = await fetch(`${process.env.BACKEND_URL}/api/adoptions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.token}`,
            },
            body: JSON.stringify({
                how_old,
                specie,
                race,
                sex,
                province,
                description,
                img_url: uploadedImageUrl || img_url,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("¡Adopción creada con éxito! Redirigiendo...");
            setTimeout(() => navigate("/adopciones"), 2000);
        } else {
            setError(data.message || "Error al crear la adopción.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: `url(${Fondologin})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
            <form
                className="container d-flex flex-column align-items-center justify-content-center"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-3">
                    <h2>Nueva adopción</h2>
                </div>
                <div>
                    <div className="input-group mb-3">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {file && <p className="text-white">Imagen lista para subir</p>}
                        {img_url && <img src={img_url} alt="Subida" style={{ maxWidth: "300px" }} />}
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Edad
                            <input
                                onChange={(e) => setHow_old(e.target.value)}
                                type="number"
                                min="0"
                                step="1"
                                value={how_old}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Especie
                            <div className="dropdown">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {specieLabels[specie] || "Selecciona"}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><span className="dropdown-item" onClick={() => setSpecie("Dog")}>Perro</span></li>
                                    <li><span className="dropdown-item" onClick={() => setSpecie("Cat")}>Gato</span></li>
                                    <li><span className="dropdown-item" onClick={() => setSpecie("Other")}>Otros</span></li>
                                </ul>
                            </div>
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Raza
                            <input
                                onChange={(e) => setRace(e.target.value)}
                                type="text"
                                value={race}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Sexo
                            <div className="dropdown">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {sexLabels[sex] || "Selecciona"}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><span className="dropdown-item" onClick={() => setSex("Male")}>Macho</span></li>
                                    <li><span className="dropdown-item" onClick={() => setSex("Female")}>Hembra</span></li>
                                </ul>
                            </div>
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Provincia
                            <input
                                onChange={(e) => setProvince(e.target.value)}
                                type="text"
                                value={province}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="text-white">Descripción
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="form-control"
                                required
                            />
                        </span>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    </div>
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
            </form>
        </div>
    );
};
