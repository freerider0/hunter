import { getMongoDatabase } from "./client.js";

export async function updateRejectionChance() {
    try {
        // Conectando al servidor de MongoDB
        const db = await getMongoDatabase('propdata');

        // Asegurándose de llamar correctamente a updateMany con await
        const result = await db.collection('property').updateMany(
            {}, // Filtro para aplicar a todos los documentos
            [
                {
                    $set: {
                        rejectionChance: {
                            $cond: {
                                if: {
                                    $regexMatch: {
                                        input: "$listing.addText",
                                        regex: /(abstenerse|no).*(agencias|intermediarios|inmobiliarias)|(agencias|intermediarios|inmobiliarias).*(abstenerse|no)/i
                                    }
                                },
                                then: 100,
                                else: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                { $regexMatch: { input: "$listing.addText", regex: /agencias/i } },
                                                { $regexMatch: { input: "$listing.addText", regex: /intermediarios/i } },
                                                { $regexMatch: { input: "$listing.addText", regex: /inmobiliarias/i } }
                                            ]
                                        },
                                        then: 50,
                                        else: 0
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        );

        console.log('Actualización completada:', result.modifiedCount, 'documentos actualizados.');
    } catch (err) {
        console.error('Ocurrió un error al actualizar la probabilidad de rechazo:', err);
    }
}

async function count(){
    const db = await getMongoDatabase('propdata');

    const count = await db.collection('property').countDocuments({
        "listing.addText": {
            $regex: /(abstenerse|no).*(agencias|intermediarios|inmobiliarias)|(agencias|intermediarios|inmobiliarias).*(abstenerse|no)/i
        }
    });
    console.log('Documentos que deben actualizar a 100:', count);

}


updateRejectionChance().then(() => console.log('Base de datos actualizada'));