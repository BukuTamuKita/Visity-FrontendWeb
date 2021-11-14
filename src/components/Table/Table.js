import React, { useMemo } from "react";
import { 
    useTable, 
    useSortBy,
    useGlobalFilter,
    usePagination,
    useRowSelect,
} from "react-table";
import { Link } from "react-router-dom";
import { GlobalFilter } from "./GlobalFilter";
import { ColumnFilter } from "./ColumnFilter";
import { Checkbox } from "./Checkbox";
import { AppointmentAction } from "../../pages/AppointmentPage/AppointmentHistory";
import { UserAction } from "../../pages/UserAdmin/UserList";
import { EXPORT_DATA } from "../../constants/urls";

const Table = ({ 
    columns, 
    data,
 }) => {
    const defaultColumn = useMemo(() => {
        return { 
            Filter: ColumnFilter
        }
    }, []);

    const tableInstance = useTable({
        columns,
        data,
        defaultColumn,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => { 
        hooks.visibleColumns.push((columns) => {
            return [
                {
                    id: 'selection',
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <Checkbox {...getToggleAllPageRowsSelectedProps()} />
                    ),
                    Cell: ({ row }) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    ),
                },
                ...columns,
            ]
        })
    },
    (hooks) => {
        if (window.location.pathname !== "/guest-list") {
            hooks.visibleColumns.push((columns) => [
                ...columns,
                {
                    id: "action",
                    Header: "Action",
                    Cell: ({ row }) => {
                        return window.location.pathname === "/appointment-history" ? (
                            <AppointmentAction id={row.values.id} />
                        ) : (
                            <UserAction id={row.values.id} /> 
                        )
                    }
                },
            ]);
        }
    },
    );

    const { 
        getTableProps,
        getTableBodyProps, 
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows, 
    } = tableInstance;

    const { 
        globalFilter, 
        pageIndex, 
        pageSize, 
        selectedRowIds 
    } = state;
    
    return (
        <>
            <pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        2,
                    )}
                </code>
            </pre>
            <pre className="mb-4">
                <code>
                    {JSON.stringify(
                        {
                            selectedRowIds: selectedRowIds,
                            'selectedFlatRows[].original': selectedFlatRows.map(
                                d => d.original
                            ),
                        },
                        null,
                        2,
                    )}
                </code>
            </pre>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

                            <div className="flex flex-row justify-between items-center p-4 sticky top-0 bg-white border-b border-gray-100">
                                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                <div className="flex flex-row justify-center items-center gap-5">
                                    {window.location.pathname === "/user-list" &&
                                        <Link to="/user-create">
                                            <button className="px-12 py-3.5 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700 focus:ring-purple-300">
                                                Create
                                            </button>
                                        </Link> 
                                    }
                                    {window.location.pathname === "/appointment-history" &&
                                        <button 
                                            className="px-12 py-3.5 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700 focus:ring-purple-300"
                                            onClick={(e) => window.open(EXPORT_DATA)}
                                        >
                                            Export
                                        </button>
                                    }
                                </div>

                            </div>
                            <table className="w-full" {...getTableProps()}>
                                <thead className="border-b border-gray-100">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th className="p-2" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                    {column.render('Header')}
                                                    <span>
                                                        {column.isSorted? (column.iSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="" {...getTableBodyProps()}>
                                    {page.map((row) => {
                                        prepareRow(row)
                                        return (
                                            <tr className="border-b border-gray-100" {...row.getRowProps()}>
                                                {row.cells.map((cell) => {
                                                    return <td className="p-4 " {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="flex flex-row justify-between items-center p-4">
                                <div>
                                    Displaying <strong>10</strong> of <strong>{data.length}</strong> data -  
                                    Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
                                </div>
                                <div className="flex flex-row justify-center items-center gap-4">
                                    <div>
                                        <input 
                                            type="number" 
                                            defaultValue={pageIndex + 1} 
                                            onChange={(e) => {
                                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                                gotoPage(pageNumber); 
                                            }}
                                            className="block w-16 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <select 
                                        value={pageSize} 
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                        className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        {[10, 25, 50].map((pageSize) => (
                                            <option key={pageSize} value={pageSize}>
                                                { pageSize }
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex flex-row gap-2">
                                        <button className="p-1 bg-white rounded-full hover:bg-gray-100" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="p-1 bg-white rounded-full hover:bg-gray-100" onClick={() => previousPage()} disabled={!canPreviousPage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="p-1 bg-white rounded-full hover:bg-gray-100" onClick={() => nextPage()} disabled={!canNextPage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="p-1 bg-white rounded-full hover:bg-gray-100" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Table;