import React, {useEffect} from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

// Componente de tabla
const SimilarPropertiesTable = ({ data }) => {

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 5,
    })

    const [sorting, setSorting] = React.useState([])


    // Definición de columnas
    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'ad3',
                header: 'Location',
            },
            {
                accessorKey: 'numberOfRooms',
                header: 'Number of Rooms',
            },
            {
                accessorKey: 'daysOnMarket',
                header: 'Days on Market',
            },
            {
                accessorKey: 'grossArea',
                header: 'Gross Area (sq m)',
            },
            // Puedes seguir agregando el resto de las columnas aquí
            {
                accessorKey: 'price',
                header: 'Price',
            },
            {
                accessorKey: 'pricePerSq',
                header: 'Price per Sq',
            },
            {
                accessorKey: 'distance',
                header: 'Distance',
            }

        ],
        []
    );

    // Hook de react-table
    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
            sorting
        },

        onSortingChange: setSorting,

    })


    return (
            <div className="p-2">
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : ''
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                                title={
                                                    header.column.getCanSort()
                                                        ? header.column.getNextSortingOrder() === 'asc'
                                                            ? 'Sort ascending'
                                                            : header.column.getNextSortingOrder() === 'desc'
                                                                ? 'Sort descending'
                                                                : 'Clear sort'
                                                        : undefined
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>

                </table>
                <div className="pagination">

                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>

                </div>
            </div>
        )
};

export default SimilarPropertiesTable;
