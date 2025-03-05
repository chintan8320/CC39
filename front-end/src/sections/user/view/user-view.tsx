import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator, exportToExcel } from '../utils';

import type { UserProps } from '../user-table-row';
import { UserModal } from '../user-modal';
import { LiveLocationModal } from '../live-location-modal';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();
  const [users, setUsers] = useState(_users);
  const [total, setTotal] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProps | null>(null);
  const [openLiveLocationModal, setOpenLiveLocationModal] = useState(false);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = (user?: UserProps) => {
    setEditingUser(user || null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveUser = (user: UserProps) => {
    if (editingUser) {
      editData(user, editingUser.id);
    } else {
      addData(user);
    }
  };

  const fetchData = (page = 1, limit = 5) => {
    fetch(`http://localhost:3333/api/users?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch((error) => console.error('Error:', error));
  };

  const addData = (newUser: UserProps) => {
    fetch('http://localhost:3333/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => fetchData(table.page + 1, table.rowsPerPage))
      .catch((error) => console.error('Error:', error));
  };

  const editData = (newUser: UserProps, id: string) => {
    fetch(`http://localhost:3333/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => fetchData(table.page + 1, table.rowsPerPage))
      .catch((error) => console.error('Error:', error));
  };

  const deleteData = (id: string) => {
    fetch(`http://localhost:3333/api/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => fetchData(table.page + 1, table.rowsPerPage))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    fetchData(table.page + 1, table.rowsPerPage);
  }, [table.page, table.rowsPerPage]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1} textAlign="left">
          Users
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenModal()}
          >
            New User
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mdi:file-excel" />}
            onClick={() => exportToExcel()}
          >
            Export as Excel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mdi:map-marker" />}
            onClick={() => setOpenLiveLocationModal(true)}
          >
            Show live location
          </Button>
        </Box>
      </Box>

      <Card>
        <UserTableToolbar numSelected={table.selected.length} />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user: any) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'company', label: 'Company' },
                  { id: 'role', label: 'Role' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {users.map((row: any) => (
                  <UserTableRow
                    key={row.id ?? ''}
                    row={row}
                    selected={table.selected.includes(row.id ?? '')}
                    onSelectRow={() => row.id && table.onSelectRow(row.id)}
                    handleOpenModal={handleOpenModal}
                    deleteData={deleteData}
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <UserModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
      <LiveLocationModal
        open={openLiveLocationModal}
        onClose={() => setOpenLiveLocationModal(false)}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
