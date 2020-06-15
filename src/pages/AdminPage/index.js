import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { AdminContainer } from './styles';
import api from '~/services/api';
import { useSelector } from 'react-redux';
import history from '~/services/history';
import SignUp from '../SignUp';
import DialogDelete from '~/components/DialogDelete';
import { toast } from 'react-toastify';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function AdminPage() {
    const [openModal, setOpenModal] = useState({ open: false });
    const [openDialog, setOpenDialog] = useState({ open: false, id: '' });
    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const { profile } = useSelector(state => state.user);
    useEffect(() => {
        if (!(profile.admin || profile.receptionist)) history.goBack();
    }, [profile]);
    async function getUsers() {
        try {
            setOpenModal(prevState => ({ ...prevState, open: false }));

            setLoading(true);
            const response = await api.get('admins');
            const userList = response.data.map(usr => {
                let userType = 'Cliente';
                if (usr.admin) userType = 'Administrador';
                if (usr.receptionist) userType = 'Recepcionista';
                if (usr.provider) userType = 'Barbeiro';

                return { ...usr, userType };
            });
            setDataTable(userList);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    async function confirmDelete(id) {
        try {
            setLoading(true);
            setOpenDialog(prevState => ({ ...prevState, open: false }));

            const response = await api.delete(`admin/${id}`);
            getUsers();
            toast.success(response.data);
        } catch (error) {
            toast.error(error?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getUsers();
    }, []);

    return (
        <AdminContainer>
            <header>Controle de usuários</header>
            <main>
                <MaterialTable
                    isLoading={loading}
                    columns={[
                        { title: 'Id do usuário', field: 'id' },
                        { title: 'Nome', field: 'name' },
                        { title: 'Email', field: 'email' },
                        {
                            title: 'Tipo de usuário',
                            field: 'userType',
                        },
                    ]}
                    actions={[
                        {
                            icon: 'add_box',
                            tooltip: 'Criar usuário',
                            isFreeAction: true,
                            onClick: () =>
                                setOpenModal(prevState => ({
                                    ...prevState,
                                    open: true,
                                    id: '',
                                })),
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Deletar usuário',
                            onClick: (event, rowData) =>
                                setOpenDialog(prevState => ({
                                    ...prevState,
                                    open: true,
                                    id: rowData.id,
                                    user: {
                                        name: rowData.name,
                                        userType: rowData.userType,
                                    },
                                })),
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar usuário',
                            onClick: (event, rowData) =>
                                setOpenModal(prevState => ({
                                    ...prevState,
                                    open: true,
                                    id: rowData.id,
                                })),
                        },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                    }}
                    data={dataTable}
                    title="Listagem de usuários"
                />
            </main>
            <SignUp
                open={openModal.open}
                cancelModal={() =>
                    setOpenModal(prevState => ({ ...prevState, open: false }))
                }
                id={openModal.id}
                getUsers={getUsers}
            ></SignUp>
            <DialogDelete
                open={openDialog.open}
                handleClose={() =>
                    setOpenDialog(prevState => ({ ...prevState, open: false }))
                }
                user={openDialog.user}
                confirm={() => confirmDelete(openDialog.id)}
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmação para excluir usuário.
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deseja realmente excluir o{' '}
                        <b style={{ color: '#5b6467' }}>
                            {openDialog?.user?.userType}{' '}
                            {openDialog?.user?.name}
                        </b>{' '}
                        ? <br></br>
                        <b style={{ color: 'red' }}>
                            Essa ação não pode ser revertida!
                        </b>
                    </DialogContentText>
                </DialogContent>
            </DialogDelete>
        </AdminContainer>
    );
}

export default AdminPage;
