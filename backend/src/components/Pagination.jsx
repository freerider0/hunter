import React, { useState, useEffect } from 'react';


const Pagination = ({goToPreviousPage, goToNextPage, changePage, currentPage, totalPages}) => {
    const [pageNumbers, setPageNumbers] = useState([])



    // Función para generar los números de página
    const getPageNumbers = () => {
        const windowSize = 5; // Cantidad de números de página para mostrar alrededor de la página actual
        let startPage = Math.max(currentPage - windowSize, 1);
        let endPage = Math.min(currentPage + windowSize, totalPages);

        // Ajuste para asegurar que siempre se muestren `windowSize * 2 + 1` números de página cuando sea posible
        const maxPagesToShow = windowSize * 2 + 1;
        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage > 1) {
                startPage = Math.max(endPage - maxPagesToShow + 1, 1);
            } else if (endPage < totalPages) {
                endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
            }
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        console.log('buttos pages', pages )

        return pages;
    };

    useEffect(() => {
        setPageNumbers(getPageNumbers())
    }, [totalPages]);


    return (

            <div>
                {currentPage}/{totalPages}
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior</button>
                {pageNumbers.map(page => (
                    <button key={page} onClick={() => changePage(page)} disabled={page === currentPage}>
                        {page}
                    </button>
                ))}
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>Siguiente</button>

        </div>
    );
};

export default Pagination;