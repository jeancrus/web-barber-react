import { all, takeLatest, put, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '~/services/api';
import { signInSuccess, signFailure } from './actions';
import history from '~/services/history';

export function* signIn({ payload }) {
    const { email, password } = payload;
    try {
        const {
            data: { token, user },
        } = yield call(api.post, '/sessions', {
            email,
            password,
        });

        if (!user.provider) {
            yield put(signFailure());
            toast.error('Usuário não é prestador');
            return;
        }
        api.defaults.headers.Authorization = `Bearer ${token}`;

        yield put(signInSuccess(token, user));
        history.push('/dashboard');
    } catch (error) {
        yield put(signFailure());
        toast.error(error.response.data.error);
    }
}

export function* signUp({ payload }) {
    const { name, email, password } = payload;
    try {
        yield call(api.post, '/users', {
            name,
            email,
            password,
            provider: true,
        });
        history.push('/');
    } catch (error) {
        yield put(signFailure());
        toast.error(error.response.data.error);
    }
}

export function setToken({ payload }) {
    if (!payload) return;

    const { token } = payload.auth;

    if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }
}

export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
