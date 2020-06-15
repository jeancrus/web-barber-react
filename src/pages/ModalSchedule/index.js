import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Paper } from '@material-ui/core';
import { ModalBox } from './styles';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppContext from '~/store/context';
import api from '~/services/api';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const schema = Yup.object().shape({
    user_id: Yup.object().shape({
        id: Yup.number().required('Usuário obrigatório'),
        name: Yup.string().required('Usuário obrigatório'),
    }),
    provider_id: Yup.object().shape({
        id: Yup.number().required('Barbeiro obrigatório'),
        name: Yup.string().required('Barbeiro obrigatório'),
    }),
});

function ModalSchedule({ loadSchedule, modalData, cancelModal, ...props }) {
    const { handleSubmit, errors, control } = useForm({
        validationSchema: schema,
    });
    const { setAppConfig } = useContext(AppContext);

    async function submitSchedule(value) {
        try {
            setAppConfig(prevState => ({ ...prevState, loading: true }));
            const response = await api.post('receptionist/schedules', {
                provider_id: value.provider_id.id,
                user_id: value.user_id.id,
                date: modalData.date,
            });
            loadSchedule();
            toast.success(
                `Cliente: ${value.user_id.name} agendado com barbeiro: ${value.provider_id.name}!`
            );
        } catch (error) {
        } finally {
            setAppConfig(prevState => ({ ...prevState, loading: false }));
        }
    }
    return (
        <ModalBox open={modalData.open} {...props}>
            <Paper>
                <form onSubmit={handleSubmit(submitSchedule)}>
                    <div className="title">
                        Agendar cliente horário:{' '}
                        {isValid(parseISO(modalData.date)) &&
                            format(
                                parseISO(modalData.date),
                                "d 'de' MMMM 'às' HH:mm",
                                {
                                    locale: ptBR,
                                }
                            )}
                    </div>
                    <div>
                        <Controller
                            as={
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={modalData.usersAvailable}
                                    getOptionLabel={option => option.name}
                                    style={{ width: 300 }}
                                    getOptionSelected={(option, value) => {
                                        return option.id === value.id;
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            error={errors?.user_id}
                                            helperText={
                                                errors?.user_id?.name?.message
                                            }
                                            label="Cliente"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            }
                            onChange={event => {
                                return event[1]
                                    ? event[1]
                                    : { id: '', name: '' };
                            }}
                            name="user_id"
                            control={control}
                            defaultValue={{ id: '', name: '' }}
                        ></Controller>
                    </div>
                    <div>
                        <Controller
                            as={
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={modalData.providersAvailable}
                                    getOptionLabel={option => option.name}
                                    style={{ width: 300 }}
                                    getOptionSelected={(option, value) => {
                                        return option.id === value.id;
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Barbeiro"
                                            variant="outlined"
                                            error={errors?.provider_id}
                                            helperText={
                                                errors?.provider_id?.name
                                                    ?.message
                                            }
                                        />
                                    )}
                                />
                            }
                            onChange={event => {
                                return event[1]
                                    ? event[1]
                                    : { id: '', name: '' };
                            }}
                            name="provider_id"
                            control={control}
                            defaultValue={{ id: '', name: '' }}
                        ></Controller>
                    </div>
                    <footer>
                        <button type="submit" className="submit">
                            Agendar
                        </button>
                        <button
                            type="button"
                            onClick={cancelModal}
                            className="cancel"
                        >
                            Cancelar
                        </button>
                    </footer>
                </form>
            </Paper>
        </ModalBox>
    );
}

export default ModalSchedule;
