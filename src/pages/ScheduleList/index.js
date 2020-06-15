import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { AdminContainer } from './styles';
import api from '~/services/api';
import { useSelector } from 'react-redux';
import history from '~/services/history';
import SignUp from '../SignUp';
import DialogDelete from '~/components/DialogDelete';
import { toast } from 'react-toastify';
import {
    DialogTitle,
    DialogContent,
    DialogContentText,
} from '@material-ui/core';
import user from '~/store/modules/user/reducer';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

function ScheduleList({
    match: {
        params: { id },
    },
}) {
    const [openDialog, setOpenDialog] = useState({ open: false, id: '' });
    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const { profile } = useSelector(state => state.user);
    useEffect(() => {
        if (!(profile.admin || profile.receptionist)) history.goBack();
    }, [profile]);
    async function getSchedules() {
        try {
            setLoading(true);
            const response = await api.get(`receptionist/schedules/${id}`);

            setDataTable(
                response.data.map(item => ({
                    ...item,
                    user: item.user?.name,
                    provider: item.provider?.name,
                    past: item.past ? 'Sim' : 'Não',
                }))
            );
        } catch (error) {
            console.log('err', error);
        } finally {
            setLoading(false);
        }
    }

    async function confirmDelete(id) {
        try {
            setLoading(true);
            setOpenDialog(prevState => ({ ...prevState, open: false }));

            const response = await api.delete(`receptionist/schedules/${id}`);
            getSchedules();
            toast.success('Agendamento cancelado com sucesso!');
        } catch (error) {
            toast.error(error?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getSchedules();
    }, [id]);

    return (
        <AdminContainer>
            <header>Controle de agendamentos</header>
            <main>
                <MaterialTable
                    isLoading={loading}
                    columns={[
                        { title: 'Id do agendamento', field: 'id' },
                        { title: 'Passado', field: 'past' },
                        {
                            title: 'Data do agendamento',
                            field: 'date',
                            type: 'datetime',
                        },
                        { title: 'Cliente', field: 'user' },
                        {
                            title: 'Barbeiro',
                            field: 'provider',
                        },
                    ]}
                    actions={[
                        {
                            icon: 'event_busy',
                            iconProps: { style: { color: 'red' } },
                            tooltip: 'Cancelar agendamento',
                            onClick: (event, rowData) => {
                                if (rowData.past === 'Sim')
                                    return alert(
                                        'Agendamento no passado não pode ser cancelado!'
                                    );
                                setOpenDialog(prevState => ({
                                    ...prevState,
                                    open: true,
                                    id: rowData.id,
                                    user: {
                                        name: rowData.user,
                                        provider: rowData.provider,
                                    },
                                    date: format(
                                        parseISO(rowData.date),
                                        "'dia' dd 'de' MMMM', às' H:mm'h'",
                                        { locale: ptBR }
                                    ),
                                }));
                            },
                        },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                    }}
                    data={dataTable}
                    title="Listagem de agendamentos"
                />
            </main>
            <DialogDelete
                open={openDialog.open}
                handleClose={() =>
                    setOpenDialog(prevState => ({ ...prevState, open: false }))
                }
                user={openDialog.user}
                confirm={() => confirmDelete(openDialog.id)}
            >
                <DialogTitle id="alert-dialog-title">
                    Cancelar agendamento no {openDialog?.date}.
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deseja realmente cancelar o agendamento de{' '}
                        <b style={{ color: '#5b6467' }}>
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

export default ScheduleList;
