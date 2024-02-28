'use client'

import {
    Table as ReactTable,
    ColumnDef,
    flexRender,
    PaginationState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    useReactTable,
    Column,
} from '@tanstack/react-table'

import { data, User } from './data'
import Image from 'next/image'
import { useVirtualizer } from '@tanstack/react-virtual'
import Styles from './table.module.scss'


import React from 'react'

const Datatable = () => {

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const columns = React.useMemo<ColumnDef<User>[]>(() => [

        {
            accessorFn: row => row.organization,
            id: 'organization',
            cell: info => info.getValue(),
            header: () => <span>Organization</span>,
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.name,
            id: 'name',
            cell: info => info.getValue(),
            header: () => <span>Username</span>,
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.email,
            id: 'email',
            cell: info => info.getValue(),
            header: () => <span>Email</span>,
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.phone,
            id: 'phone',
            cell: info => info.getValue(),
            header: () => <span>Phone</span>,
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.registered,
            id: 'registered',
            cell: info => info.getValue(),
            header: () => <span>Date joined</span>,
            footer: props => props.column.id,
        },
    ], [])

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
        },
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    })


    const { rows } = table.getRowModel()


    //The virtualizer needs to know the scrollable container element
    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
        getScrollElement: () => tableContainerRef.current,
        //measure dynamic row height, except in firefox because it measures table border height incorrectly
        measureElement:
            typeof window !== 'undefined' &&
                navigator.userAgent.indexOf('Firefox') === -1
                ? element => element?.getBoundingClientRect().height
                : undefined,
        overscan: 5,
    })



    return (

        <div
            className={Styles.container}
            ref={tableContainerRef}
        >

            <table style={{ display: 'grid' }}>
                <thead
                    style={{
                        display: 'grid',
                        padding: '20px 0px'
                    }}
                >
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
                        >
                            {headerGroup.headers.map(header => {
                                return (
                                    <th
                                        key={header.id}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            width: header.getSize(),
                                            padding: '10px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div

                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            {{
                                                asc: <Image
                                                    src='/icons/filter-up.svg'
                                                    alt='toggle'
                                                    width={16}
                                                    height={16}
                                                />,
                                                desc: <Image
                                                    src='/icons/filter-down.svg'
                                                    alt='toggle'
                                                    width={16}
                                                    height={16}
                                                />,
                                            }[header.column.getIsSorted() as string] ?? <Image
                                                    src='/icons/filter-down.svg'
                                                    alt='toggle'
                                                    width={16}
                                                    height={16}
                                                />}

                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} table={table} />
                                            </div>
                                        ) : null}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody
                    style={{
                        display: 'grid',
                        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                        position: 'relative', //needed for absolute positioning of rows
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<User>
                        return (
                            <tr
                                data-index={virtualRow.index} //needed for dynamic row height measurement
                                ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                                key={row.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '20px',
                                    position: 'absolute',
                                    transform: `translateY(${virtualRow.start}px)`,
                                    width: '100%',
                                }}
                            >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td
                                            key={cell.id}
                                            style={{
                                                display: 'flex',
                                                width: cell.column.getSize(),
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className={Styles.pagination}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                    <p>Showing</p>
                    <select
                        className={Styles.paginationSelect}
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >

                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}

                    </select>
                    <p style={{ paddingLeft: '5px' }}> out of 100</p>
                </div>

                <div>
                    <button
                        className={Styles.paginationButton}
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className={Styles.paginationButton}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className={Styles.paginationButton}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className={Styles.paginationButton}
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </div>
    )



    function Filter({
        column,
        table,
    }: {
        column: Column<any, any>;
        table: ReactTable<any>;
    }) {
        const firstValue = table
            .getPreFilteredRowModel()
            .flatRows[0]?.getValue(column.id);

        const columnFilterValue = column.getFilterValue();

        return typeof firstValue === "number" ? (
            <div className="flex space-x-2">
                <input
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ""}
                    onChange={(e) =>
                        column.setFilterValue((old: [number, number]) => [
                            e.target.value,
                            old?.[1],
                        ])
                    }
                    placeholder={`Min`}
                    className={Styles.filterInput}
                />
                <input
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ""}
                    onChange={(e) =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            e.target.value,
                        ])
                    }
                    placeholder={`Max`}
                    className={Styles.filterInput}
                />
            </div>
        ) : (
            <input
                type="text"
                value={(columnFilterValue ?? "") as string}
                onChange={(e) => column.setFilterValue(e.target.value)}
                placeholder={`Search...`}
                className={Styles.filterInput}
            />
        );
    }




}

export default Datatable