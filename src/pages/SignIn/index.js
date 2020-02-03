import React from 'react';

import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Email inválido')
        .required('Email obrigatório'),
    password: Yup.string().required('Senha obrigatória'),
});

export default function SignIn() {
    function handleSubmit(data) {
        console.tron.log(data);
    }
    return (
        <>
            <img src={logo} alt="barbershop" />
            <Form onSubmit={handleSubmit} autoComplete="off" schema={schema}>
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
                <button type="submit">Acessar</button>
                <Link to="/register">Criar conta gratuita</Link>
            </Form>
        </>
    );
}
