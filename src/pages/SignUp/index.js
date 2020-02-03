import React from 'react';

import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
    name: Yup.string().required('Nome completo obrigatório'),
    email: Yup.string()
        .email('Email inválido')
        .required('Email obrigatório'),
    password: Yup.string()
        .min(6, 'Senha mínima de 6 caracteres')
        .required('Senha obrigatória'),
});

export default function SignUp() {
    function handleSubmit(data) {
        console.tron.log(data);
    }
    return (
        <>
            <img src={logo} alt="barbershop" />
            <Form onSubmit={handleSubmit} autoComplete="off" schema={schema}>
                <Input name="name" placeholder="Nome completo" type="text" />
                <Input
                    type="email"
                    name="email"
                    id=""
                    placeholder="Seu e-mail"
                />
                <Input
                    type="password"
                    name="password"
                    id=""
                    placeholder="Sua senha"
                />
                <button type="submit">Criar conta</button>
                <Link to="/">Já tenho conta</Link>
            </Form>
        </>
    );
}
