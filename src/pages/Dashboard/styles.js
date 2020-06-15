import styled from 'styled-components';
import { List } from '@material-ui/core';

export const Container = styled.div`
    max-width: 600px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    header {
        display: flex;
        align-self: center;
        align-items: center;
        button {
            border: 0;
            background: none;
        }

        strong {
            color: #fff;
            font-size: 24px;
            margin: 0 15px;
        }
    }

    ul {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
        margin-top: 30px;
    }
`;

export const Time = styled.li`
    padding: 20px;
    border-radius: 4px;
    background: #fff;
    opacity: ${props => (props.past ? 0.6 : 1)};
    .hour-space {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .admin-space {
            cursor: pointer;
            svg {
                color: #5b6467;
                font-size: 30px;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    strong {
        display: block;
        color: ${props => (props.available ? '#999' : '#5b6467')};
        font-size: 20px;
        font-weight: normal;
    }

    span {
        display: block;
        margin-top: 3px;
        color: #666;
    }
`;

export const ListOptions = styled(List)`
    &.MuiList-root {
        padding: 0px;

        .MuiListItem-gutters {
            height: 45px;
            color: #4a4748;
            font-family: Roboto;
            font-size: 14px;

            :hover {
                font-weight: bold;
                color: #5b6467;
            }
        }
    }
`;
