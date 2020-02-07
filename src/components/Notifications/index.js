import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import {
    Container,
    Badge,
    NotificationList,
    Notification,
    Scroll,
} from './styles';
import api from '~/services/api';
import useOutsideClick from '~/tools/clickOutside';

export default function Notifications() {
    const [visible, setVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const ref = useRef();

    const hasUnread = useMemo(
        () => !!notifications.find(notification => notification.read === false),
        [notifications]
    );

    useEffect(() => {
        async function loadNotifications() {
            const response = await api.get('notifications');

            const data = response.data.map(notification => ({
                ...notification,
                timeDistance: formatDistance(
                    parseISO(notification.createdAt),
                    new Date(),
                    { addSuffix: true, locale: ptBr }
                ),
            }));

            setNotifications(data);
        }
        loadNotifications();
    }, []);

    function handleToggleVisible() {
        setVisible(!visible);
    }

    useOutsideClick(ref, () => {
        if (visible) handleToggleVisible();
    });

    async function handleMarkAsRead(id) {
        await api.put(`notifications/${id}`);
        setNotifications(
            notifications.map(notification =>
                notification._id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }

    return (
        <Container ref={ref}>
            <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
                <MdNotifications color="#7159c1" size={20} />
            </Badge>

            <NotificationList visible={visible}>
                <Scroll>
                    {notifications.map(notification => {
                        return (
                            <Notification
                                key={notification._id}
                                unread={!notification.read}
                            >
                                <p>{notification.content}</p>
                                <time>{notification.timeDistance}</time>
                                {!notification.read && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMarkAsRead(notification._id)
                                        }
                                    >
                                        Marcar como lida
                                    </button>
                                )}
                            </Notification>
                        );
                    })}
                </Scroll>
            </NotificationList>
        </Container>
    );
}
