import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoHeader from '~/assets/logo-header.svg';
import { Container, Content, Profile } from './styles';
import Notifications from '../Notifications';

export default function Header() {
    const profile = useSelector(state => state.user.profile);
    return (
        <Container>
            <Content>
                <nav>
                    <img src={logoHeader} alt="" />
                    <Link to="/dashboard">DASHBOARD</Link>
                    {(profile.admin || profile.receptionist) && (
                        <Link to="/admin" style={{ marginLeft: 20 }}>
                            PAINEL ADMIN
                        </Link>
                    )}
                    {(profile.admin || profile.receptionist) && (
                        <Link to="/schedule/all" style={{ marginLeft: 20 }}>
                            AGENDAMENTOS
                        </Link>
                    )}
                </nav>

                <aside>
                    {!(profile.admin || profile.receptionist) && (
                        <Notifications />
                    )}
                    <Profile>
                        <div>
                            <strong>{profile.name}</strong>
                            <Link to="/profile">Meu perfil</Link>
                        </div>
                        <img
                            src={
                                (profile.avatar && profile.avatar.url) ||
                                'https://api.adorable.io/avatars/50/abott@adorable.png'
                            }
                            alt=""
                        />
                    </Profile>
                </aside>
            </Content>
        </Container>
    );
}
