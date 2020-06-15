import React, {
    useState,
    useMemo,
    useEffect,
    useContext,
    useCallback,
} from 'react';

import { MdChevronLeft, MdChevronRight, MdMoreHoriz } from 'react-icons/md';
import {
    format,
    subDays,
    addDays,
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    isBefore,
    isEqual,
    parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz/esm';
import { Container, Time, ListOptions } from './styles';
import api from '~/services/api';
import { useSelector } from 'react-redux';
import ModalSchedule from '../ModalSchedule';
import AppContext from '~/store/context';
import Ballon from '~/components/Popover/Ballon';
import { List, ListItem } from '@material-ui/core';
import history from '~/services/history';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
    const { setAppConfig } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState({
        current: '',
        hour: '',
    });

    const [schedule, setSchedule] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        usersAvailable: [],
        providersAvailable: [],
        date: new Date(),
    });

    const [date, setDate] = useState(new Date());
    const {
        profile: { admin, receptionist },
    } = useSelector(state => state.user);

    const dateFormatted = useMemo(
        () => format(date, "d 'de' MMMM", { locale: ptBR }),
        [date]
    );

    async function loadSchedule() {
        try {
            setAppConfig(prevState => ({ ...prevState, loading: true }));

            let response;
            if (admin || receptionist) {
                response = await api.get('receptionist/schedules', {
                    params: { date },
                });
            } else {
                response = await api.get('schedule', { params: { date } });
            }

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const data = range.map(hour => {
                const checkDate = setMilliseconds(
                    setSeconds(setMinutes(setHours(date, hour), 0), 0),
                    0
                );
                const compareDate = utcToZonedTime(checkDate, timezone);

                return {
                    time: `${hour}:00h`,
                    past: isBefore(compareDate, new Date()),
                    date: response.data.filter(dateValue =>
                        isEqual(parseISO(dateValue.value), compareDate)
                    )[0]?.value,
                    providersAvailable: response.data
                        .filter(a => isEqual(parseISO(a.value), compareDate))
                        .map(item => item.providersAvailable)[0],
                    usersAvailable: response.data
                        .filter(a => isEqual(parseISO(a.value), compareDate))
                        .map(item => item.usersAvailable)[0],
                    appointment: response.data.find(a =>
                        isEqual(parseISO(a.date), compareDate)
                    ),
                };
            });
            setSchedule(data);
        } catch (error) {
        } finally {
            setAppConfig(prevState => ({ ...prevState, loading: false }));
            setModal(prevState => ({ ...prevState, open: false }));
        }
    }

    useEffect(() => {
        loadSchedule();
    }, [date, admin, receptionist]);

    function handlePrevDay() {
        setDate(subDays(date, 1));
    }

    function handleNextDay() {
        setDate(addDays(date, 1));
    }

    const textCard = useCallback(time => {
        if (time.appointment) {
            return time?.appointment?.user?.name;
        }

        if ((admin || receptionist) && time?.providersAvailable?.length > 0) {
            return 'Em aberto';
        }

        if (!admin && !receptionist && !time.appointment) return 'Em aberto';
        return 'Sem barbeiros disponíveis';
    }, []);

    const openModal = (event, hour) => {
        setAnchorEl({
            current: event.currentTarget,
            hour,
        });
    };

    const closeModal = () => {
        setAnchorEl({
            current: '',
            hour: '',
        });
    };

    return (
        <Container>
            <header>
                <button type="button" onClick={handlePrevDay}>
                    <MdChevronLeft size={36} color="#fff" />
                </button>
                <strong>{dateFormatted}</strong>
                <button type="button" onClick={handleNextDay}>
                    <MdChevronRight size={36} color="#fff" />
                </button>
            </header>

            <ul>
                {schedule.map(time => (
                    <Time
                        key={time.time}
                        past={time.past}
                        user={
                            (admin || receptionist) &&
                            !time.past &&
                            time.providersAvailable.length > 0
                        }
                        available={!time.appointment}
                    >
                        <div className="hour-space">
                            <div>
                                <strong>{time.time}</strong>
                            </div>
                            {(admin || receptionist) && !time.past && (
                                <div
                                    className="admin-space"
                                    onClick={e => openModal(e, time.time)}
                                >
                                    <MdMoreHoriz />
                                </div>
                            )}
                            <Ballon
                                anchorEl={anchorEl.current}
                                open={anchorEl.hour === time.time}
                                handleClose={closeModal}
                            >
                                <ListOptions>
                                    {time?.providersAvailable?.length > 0 && (
                                        <ListItem
                                            button
                                            onClick={() => {
                                                closeModal();
                                                setModal(prevState => ({
                                                    ...prevState,
                                                    open: true,
                                                    providersAvailable:
                                                        time.providersAvailable,
                                                    usersAvailable:
                                                        time.usersAvailable,
                                                    date: time.date,
                                                }));
                                            }}
                                        >
                                            Agendar novo horário
                                        </ListItem>
                                    )}
                                    <ListItem
                                        button
                                        onClick={() => {
                                            closeModal();
                                            history.push(
                                                `/schedule/${time.date}`
                                            );
                                        }}
                                    >
                                        Lista de agendamentos
                                    </ListItem>
                                </ListOptions>
                            </Ballon>
                        </div>
                        <span>{textCard(time)}</span>
                    </Time>
                ))}
            </ul>
            <ModalSchedule
                modalData={modal}
                onClose={() =>
                    setModal(prevState => ({ ...prevState, open: false }))
                }
                loadSchedule={loadSchedule}
                cancelModal={() =>
                    setModal(prevState => ({
                        ...prevState,
                        open: false,
                    }))
                }
            ></ModalSchedule>
        </Container>
    );
}
