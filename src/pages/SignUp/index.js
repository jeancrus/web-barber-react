import React, { useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import logo from '~/assets/logo.svg';
import { signUpRequest } from '~/store/modules/auth/actions';
import { ModalBox } from './styles';
import { Paper, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { toast } from 'react-toastify';
import AppContext from '~/store/context';
import api from '~/services/api';

const schema = Yup.object().shape({
    name: Yup.string().required('Nome completo obrigatório'),
    email: Yup.string()
        .email('Email inválido')
        .required('Email obrigatório'),
    password: Yup.string()
        .min(6, 'Senha mínima de 6 caracteres')
        .required('Senha obrigatória'),
    userType: Yup.object().shape({
        id: Yup.string().required('Tipo de usuário obrigatório'),
        name: Yup.string().required('Tipo de usuário obrigatório'),
    }),
});

export default function SignUp({ cancelModal, getUsers, id, ...props }) {
    const { handleSubmit, errors, control, reset } = useForm({
        validationSchema: schema,
    });
    const { setAppConfig } = useContext(AppContext);

    useEffect(() => {
        async function getUser() {
            try {
                if (id && props.open) {
                    setAppConfig(prevState => ({
                        ...prevState,
                        loading: true,
                    }));

                    const { data } = await api.get(`admin/${id}`);
                    let userType = { id: 'client', name: 'Cliente' };
                    if (data.admin)
                        userType = { id: 'admin', name: 'Administrador' };
                    if (data.receptionist)
                        userType = {
                            id: 'recepcionist',
                            name: 'Recepcionista',
                        };
                    if (data.provider)
                        userType = {
                            id: 'provider',
                            name: 'Barbeiro',
                        };
                    return reset({ ...data, userType });
                }
                reset({
                    name: '',
                    email: '',
                    password: '',
                    userType: { id: '', name: '' },
                });
            } catch (error) {
                toast.error(error?.response?.data?.error);
            } finally {
                setAppConfig(prevState => ({ ...prevState, loading: false }));
            }
        }
        getUser();
    }, [id, props.open]);

    async function submitUser(value) {
        try {
            if (!id) {
                setAppConfig(prevState => ({ ...prevState, loading: true }));
                const response = await api.post('admin', {
                    ...value,
                    [value.userType.id]: true,
                });
                getUsers();
                return toast.success(`Usuário criado com sucesso!`);
            }

            setAppConfig(prevState => ({ ...prevState, loading: true }));
            const response = await api.put(`admin/${id}`, {
                ...value,
                provider: false,
                admin: false,
                receptionist: false,
                [value.userType.id]: true,
            });
            toast.info(`Usuário alterado com sucesso!`);
            getUsers();
        } catch (error) {
            toast.error(error?.response?.data?.error);
        } finally {
            setAppConfig(prevState => ({ ...prevState, loading: false }));
        }
    }

    return (
        <ModalBox {...props} onClose={cancelModal}>
            <Paper>
                <form onSubmit={handleSubmit(submitUser)} autoComplete="off">
                    <div className="title">
                        {id ? 'Alteração' : 'Cadastro'} de usuário
                    </div>

                    <Controller
                        as={
                            <TextField
                                style={{ width: 300 }}
                                error={errors?.name}
                                helperText={errors?.name?.message}
                                label="Nome do usuário"
                                variant="outlined"
                            />
                        }
                        name="name"
                        control={control}
                        defaultValue=""
                    ></Controller>
                    <Controller
                        as={
                            <TextField
                                style={{ width: 300 }}
                                error={errors?.email}
                                helperText={errors?.email?.message}
                                label="Email do usuário"
                                variant="outlined"
                            />
                        }
                        name="email"
                        control={control}
                        defaultValue=""
                    ></Controller>
                    <Controller
                        as={
                            <TextField
                                style={{ width: 300 }}
                                error={errors?.password}
                                helperText={errors?.password?.message}
                                label="Senha do usuário"
                                variant="outlined"
                                type="password"
                            />
                        }
                        name="password"
                        control={control}
                        defaultValue=""
                    ></Controller>
                    <Controller
                        as={
                            <Autocomplete
                                options={[
                                    { id: 'admin', name: 'Administrador' },
                                    { id: 'client', name: 'Cliente' },
                                    {
                                        id: 'receptionist',
                                        name: 'Recepcionista',
                                    },
                                    { id: 'provider', name: 'Barbeiro' },
                                ]}
                                getOptionLabel={option => option.name}
                                style={{ width: 300 }}
                                getOptionSelected={(option, value) => {
                                    return option.id === value.id;
                                }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        error={errors?.userType}
                                        helperText={
                                            errors?.userType?.name?.message
                                        }
                                        label="Tipo de usuário"
                                        variant="outlined"
                                    />
                                )}
                            />
                        }
                        onChange={event => {
                            return event[1] ? event[1] : { id: '', name: '' };
                        }}
                        name="userType"
                        control={control}
                        defaultValue={{ id: '', name: '' }}
                    ></Controller>
                    <footer>
                        <button type="submit" className="submit">
                            {id ? 'Editar' : 'Criar'} conta
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
