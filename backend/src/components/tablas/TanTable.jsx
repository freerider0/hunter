import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from "react-i18next";
import toast from 'react-hot-toast';


import {

    flexRender,
    getCoreRowModel,

    useReactTable, createColumnHelper, getSortedRowModel,
} from '@tanstack/react-table'
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {
    getHashOfFilteredProperties,
    getProperties,
    setPropertiesReadyForSearchForContactDetails
} from "../../apiClient/properties.js";
import {getLocalities, getPropertyTypes} from "../../apiClient/dictionaries.js";
import '../../css/components/table.css'
import AutoCompleteSelect from "../AutoCompleteSelect.jsx";
import {useStore} from "../../store/store.js";

const IndeterminateCheckbox = forwardRef(({indeterminate, onClick, onChange, ...rest}, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;
    const [t, i18n] = useTranslation()

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <input type="checkbox" ref={resolvedRef} onChange={onChange} onClick={onClick} {...rest} />
    );
});

const getRejectionChanceColor = (score) => {
    if (score == 100) {
        return <div className={'abstenerse red'}></div>
    }
    if (score == 50) {
        return <div className={'abstenerse orange'}></div>
    }
    if (score == 0) {
        return <div className={'abstenerse green'}></div>
    }
}

export function TanTable() {

    const [t, i18n] = useTranslation()

    const navigate = useNavigate()
    const columnHelper = createColumnHelper();
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });
    const [sorting, setSorting] = useState([]) // can set initial sorting state here


    const rowSelection = useStore((state) => state.rowSelection)
    const toggleFullSelection = useStore((state) => state.toggleFullSelection)

    const setRowSelection = useStore((state) => state.setRowSelection)
    const filters = useStore((state) => state.filters)
    const setFilters = useStore((state) => state.setFilters)

const handleToggleFullSelection = async ()=>{
        const length = Object.keys(rowSelection).length
        if(length > 0){
            toggleFullSelection([])
        }
        else{
            const hashes = await getHashOfFilteredProperties(filters)
            console.log('hashes', hashes.data)
            toggleFullSelection(hashes.data)
        }
}


    const defaultData = React.useMemo(() => [], [])
    const columns = [
        columnHelper.accessor('rejectionChance', {
            header: 'Score',
            cell: props => getRejectionChanceColor(props.getValue())
        }),
        columnHelper.display({
            id: 'selection',
            header: ({table}) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: ()=>{
                            handleToggleFullSelection()
                        }
                    }}
                />
            ),
            cell: ({row}) => (
                <>
                <IndeterminateCheckbox checked={row.getIsSelected()}
                                       disabled={!row.getCanSelect()}
                                       onChange={()=>setRowSelection(row.original._id)}
                /> <div>{row.original._id}</div>
                </>
            ),
        }),

        columnHelper.accessor(row => `${row.listing.ad2 ? row.listing.ad2 : 'N/A'} / ${row.listing.ad3 ? row.listing.ad3 : 'N/A'}`, {
            id: 'localidad',
            header: 'Localidad',


        }),
        columnHelper.accessor(row => {
            // Ensure 'row.listing' exists and is an object
            if (!row || typeof row.listing !== 'object' || row.listing === null) {
                return 'path/to/default/image';
            }

            // Ensure 'row.listing.originalImages' is an array and has at least one item
            if (Array.isArray(row.listing.originalImages) && row.listing.originalImages.length > 0) {
                // Additional check: Ensure the first item in the array is a string (or a valid URL)
                if (typeof row.listing.originalImages[0] === 'string') {
                    return row.listing.originalImages[0];
                }
            }

            // Fallback to a default image path if any of the above conditions fail
            return 'path/to/default/image';
        }, {
            id: 'image',
            header: 'Image',
            cell: info => {
                // Ensure 'info.getValue()' returns a valid string (or URL) before attempting to render the image
                const src = typeof info.getValue() === 'string' ? info.getValue() : 'path/to/default/image';

                return (
                    <img
                        src={src}
                        alt="Listing"
                    />
                );
            },
        }),
        columnHelper.accessor('listing.assetType', {
            header: 'Tipo',
            cell: info => t(info.getValue()) ?? 'N/A',
        }),
        columnHelper.accessor('listing.price', {
            header: 'Precio',
            cell: info => info.getValue() ? `${info.getValue().toLocaleString()} €` : 'N/A',
        }),
        columnHelper.accessor('listing.enteredMarket', {
            header: 'Start',
            cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',

        }),
        columnHelper.accessor('listing.grossArea', {
            header: 'm²',
            cell: info => info.getValue() ? `${info.getValue()} m²` : 'N/A',
        }),


        // Añade más columnas según sea necesario
    ];

    const {status: statusLocalities, data: localities, error: errorLocalities} = useQuery({
        queryKey: ['getLocalities'],
        queryFn: () => getLocalities(),
        keepPreviousData: true,
    });

    const {status: statusPropertyTypes, data: dataPropetyTypes, error: errorPropertyTypes} = useQuery({
        queryKey: ['getPropertyTypes'],
        queryFn: () => getPropertyTypes(),
        keepPreviousData: true,
    });

    const {status, data, error} = useQuery({
        queryKey: ['getProperties', {pagination, sorting, filters}],
        queryFn: () => getProperties({pagination, sorting, filters}),
        keepPreviousData: true,
    });

    const table = useReactTable({
        data: data?.data ?? defaultData,
        columns,
        getRowId: (row)=> {
            return row._id},
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true, //turn off client-side pagination
        manualSorting: true, //use pre-sorted row model instead of sorted row model, is for server sorting.
        rowCount: data?.totalItems ?? 0,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        //sortDescFirst: true,
        state: {
            pagination,
            sorting,
            rowSelection: useStore(state => state.rowSelection),
        },
        enableRowSelection: true, //enable row selection for all rows
        //onRowSelectionChange: newSelection => useStore.getState().setRowSelection(newSelection),
        debugTable: true,

    })

    useEffect(() => {
        // Reset to the first page, remembering that page indices are zero-based
        table.setPageIndex(0); // This should navigate to the first page
    }, [filters.localidad, table]);

    const handleTdClick = (houseId) => {
        navigate(`/particular/${houseId}`);
    };

    const handleBuscarTelefonosClick = async ()=>{
        await setPropertiesReadyForSearchForContactDetails(rowSelection)
        toast.success('propieddes marcadas')
    }

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
        <div className={'search-block'}>
            <input type="button" name="" id="" value={"Buscar telefonos"} onClick={handleBuscarTelefonosClick}/>
                <div>
                <AutoCompleteSelect options={localities} filters={filters} setValue={setFilters}
                                    optionFilterid={'localidad'}></AutoCompleteSelect>
                <AutoCompleteSelect options={dataPropetyTypes} filters={filters} setValue={setFilters}
                                    optionFilterid={'propertyType'}></AutoCompleteSelect>
                </div>

                {data && <div>
                    <div className={'results'}>{data?.totalItems.toLocaleString()} Resultados</div>

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
                        <tr key={row.original._id} className={row.original._id}>
                            {row.getVisibleCells().map(cell => {
                                    if (cell.column.id === 'selection') {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        )
                                    }
                                    return (
                                        <td key={cell.row.original.listing.platform_hash + Math.random()}
                                            onClick={() => {
                                                handleTdClick(cell.row.original.listing.platform_hash)
                                            }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    )
                                }
                            )}
                        </tr>
                    ))}
                    </tbody>

                </table>




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
                        {table.getState().pagination.pageIndex + 1} of{' '} {table.getPageCount().toLocaleString()}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
          | Go to page:
          <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onBlur={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
              }}
              onKeyDown={e => {
                  if (e.key === "Enter") {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                  }
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
            </div>}
        </div>
    )
}


