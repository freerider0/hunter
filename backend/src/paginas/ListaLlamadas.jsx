import {useQuery} from "@tanstack/react-query";
import {getCallList} from "../apiClient/properties.js";
import React from "react";

export const ListaLlamadas = () => {

    const { status, data, error } = useQuery({
        queryKey: ['getCallList'],
        queryFn: () => getCallList(),
        keepPreviousData: true,

    });
    if (status === 'loading') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error.message}</span>
    }

    if (!data) {
        return <div>Loading...</div>; // or any other loading state representation
    }
    return (
        <>
            {data.map(property=>{
                return <div>
                    <div>
                        <div>{property.listing.title}</div>
                    </div>
                    <div>
                        <div>{property.listing.numberOfRooms} habitaciones, {property.listing.numberOfWcs} baños, {property.listing.price} €</div>
                    </div>
                    <div>
                        <div>{property.name}, {property.phone}</div>
                    </div>

                    <div>
                        <div>{property.listing.link}</div>
                    </div>
                    <hr/>


                </div>
            })}
        </>
    )
}
