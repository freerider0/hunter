import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'

import {

    flexRender,
    getCoreRowModel,

    useReactTable, createColumnHelper,
} from '@tanstack/react-table'
import { useNavigate  } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getProperties} from "../../apiClient/properties.js";
import {getLocalities, getPropertyTypes} from "../../apiClient/dictionaries.js";

const IndeterminateCheckbox = forwardRef(({ indeterminate, onChange, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <input type="checkbox" ref={resolvedRef} onChange={onChange} {...rest} />
    );
});




const getRejectionChanceColor = (score)=>{
    if(score==100){
        return <div className={'abstenerse red'}></div>
    }
    if(score==50){
        return <div className={'abstenerse orange'}></div>
    }
    if(score==0){
        return <div className={'abstenerse green'}></div>
    }
}
export function TanTable() {

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.display({
            id: 'selection',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox {...row.getIsSelected()} />
            ),
        }),
        columnHelper.accessor('rejectionChance', {
            header: 'Score',
            cell: info => getRejectionChanceColor(info.getValue()),
        }),
        columnHelper.accessor(row => `${row.listing.ad2 ? row.listing.ad2 : 'N/A'} / ${row.listing.ad3 ? row.listing.ad3 : 'N/A'}`, {
            id: 'localidad',
            header: 'Localidad',


        }),
        columnHelper.accessor(row => row.listing.originalImages.length > 0 ? row.listing.originalImages[0] : 'path/to/default/image', {
            id: 'image',
            header: 'Image',
            cell: info => (
                <img
                    src={info.getValue()}
                    alt="Listing"
                    style={{ width: 100, height: 50 }}
                />
            ),
        }),
        columnHelper.accessor('listing.assetType', {
            header: 'Tipo',
            cell: info => info.getValue() ?? 'N/A',
        }),
        columnHelper.accessor('listing.price', {
            header: 'Precio',
            cell: info => info.getValue() ? `${info.getValue().toLocaleString()} €` : 'N/A',
        }),
        columnHelper.accessor('listing.grossArea', {
            header: 'm²',
            cell: info => info.getValue() ? `${info.getValue()} m²` : 'N/A',
        }),
        columnHelper.accessor('listing.portal', {
            header: 'Portal',
            cell: info => info.getValue() ?? 'N/A',
        }),
        columnHelper.accessor('listing.foundDate', {
            header: 'Encontrado',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
        }),
        columnHelper.accessor('listing.status', {
            header: 'Estado',
            cell: info => info.getValue() ?? 'N/A',
        }),
        columnHelper.accessor('listing.won', {
            header: 'Ganado',
            cell: info => info.getValue() ? 'Sí' : 'No',
        }),
        // Añade más columnas según sea necesario
    ];

    const { status: statusLocalities, data : localities, error:errorLocalities  } = useQuery({
        queryKey: ['getLocalities'],
        queryFn: () => getLocalities(),
        keepPreviousData: true,
    });

    const { status: statusPropertyTypes, data : dataPropetyTypes, error:errorPropertyTypes  } = useQuery({
        queryKey: ['getPropertyTypes'],
        queryFn: () => getPropertyTypes(),
        keepPreviousData: true,
    });

    const { status, data, error } = useQuery({
        queryKey: ['getProperties'],
        queryFn: () => getProperties({}),
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
            {data && <MyTable data={data} columns={columns}/>}
        </>
    )
}

function MyTable({
    data,
    columns
}) {


    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const [sorting, setSorting] = useState([]) // can set initial sorting state here

    const [filters, setFilters] = useState({
        localidad: '',
        precioMin: null,
        precioMax: null,
        portal: '',
        abstenerse: false,
        propertyType:''
    }) // {localitie, minPrice, maxPrice, }



    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true, //turn off client-side pagination
        manualSorting: true, //use pre-sorted row model instead of sorted row model, is for server sorting.
        rowCount: data.totalItems,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        state: {
            pagination,
            sorting,
        }
    })

    const handleTdClick = (houseId) => {
        console.log('navigating', houseId)
        navigate(`/particular/${houseId}`);
    };

    return (
        <>
            <div >
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
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
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                console.log('cell', cell)
                                return (
                                <td key={cell.row.original.listing.platform_hash} onClick={()=>{handleTdClick(cell.row.original.listing.platform_hash)}}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            )}
                            )}
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </tfoot>
                </table>
                <hr/>

            </div>

            <div className="pagination">
                <button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
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
                <button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
          </strong>
        </span>
                <span className="flex items-center gap-1">
          | Go to page:
          <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16"
          />
        </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                {data.isFetching ? 'Loading...' : null}
            </div>
            <div>
                Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                {data.totalItems.toLocaleString()} Rows
            </div>
        </>

    )
}
