import React, { useState } from 'react';

function ContactForm({id}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento de envío predeterminado del formulario

        // Define los detalles de la solicitud
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, id })
        };

        try {
            // Realiza la solicitud al endpoint
            const response = await fetch('http://127.0.0.1:3000/api/property/set-name-and-phone', requestOptions);
            if (!response.ok) throw new Error('Something went wrong');

            // Aquí puedes manejar la respuesta como desees
            const data = await response.json();
            console.log(data);
            alert('Datos enviados con éxito');

            // Opcional: resetear el formulario o redirigir al usuario
            setName('');
            setPhone('');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar los datos');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="phone">Teléfono:</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Enviar</button>
        </form>
    );
}

export default ContactForm;
