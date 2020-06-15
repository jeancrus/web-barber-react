import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import { darken } from 'polished';

export const ModalBox = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100 !important;

    .MuiPaper-root {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 600px;
        padding: 40px;

        form {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            > div {
                margin-bottom: 20px;
            }

            .title {
                text-align: center;
                color: #5b6467;
                font-size: 20px;
                font-weight: bold;
            }
            footer {
                width: 300px;
                .submit {
                    width: 100%;

                    margin: 5px 0 0;
                    height: 44px;
                    background-color: #045de9;
                    background-image: linear-gradient(
                        315deg,
                        #045de9 0%,
                        #09c6f9 74%
                    );
                    font-weight: bold;
                    color: #fff;
                    border: 0;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: background 0.2s;
                    &:hover {
                        opacity: 0.8;
                    }
                }

                .cancel {
                    width: 100%;
                    margin: 10px 0 0;
                    height: 44px;
                    background-color: #756213;
                    background-image: linear-gradient(
                        315deg,
                        #756213 0%,
                        #000000 74%
                    );

                    font-weight: bold;
                    color: #fff;
                    border: 0;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: background 0.2s;
                    &:hover {
                        opacity: 0.8;
                    }
                }
            }
        }
    }
`;
